import { createFileRoute } from "@tanstack/react-router";
import { randomUUID } from "node:crypto";
import { getPrisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/verify.server";

const PRODUCTS = {
  starter_gems: { name: "Starter Gems", priceUsd: "1.99", amountAtomic: "1990000", diamonds: 250 },
  adventurer_gems: { name: "Adventurer Gems", priceUsd: "4.99", amountAtomic: "4990000", diamonds: 700 },
  legendary_gems: { name: "Legendary Gems", priceUsd: "9.99", amountAtomic: "9990000", diamonds: 1600 },
} as const;

const CHAIN_ID = Number(process.env.BASE_CHAIN_ID || 84532);
const TOKEN_ADDRESS = (process.env.BASE_USDC_ADDRESS || "").trim();
const RECIPIENT_ADDRESS = (process.env.BASE_PAYMENT_RECIPIENT || "").trim();
const RPC_URL = (process.env.BASE_RPC_URL || (CHAIN_ID === 8453 ? "https://mainnet.base.org" : "https://sepolia.base.org")).trim();

function json(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } }); }
function bearer(request: Request) { const value = request.headers.get("authorization"); return value?.startsWith("Bearer ") ? value.slice(7) : undefined; }
function assertAddress(value: string) { if (!/^0x[0-9a-fA-F]{40}$/.test(value)) throw new Error("Invalid address"); }
function product(productId: string) {
  const item = PRODUCTS[productId as keyof typeof PRODUCTS];
  if (!item) throw new Error("Unknown product");
  return item;
}
async function rpc(method: string, params: unknown[]) {
  const response = await fetch(RPC_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }) });
  if (!response.ok) throw new Error("Blockchain RPC unavailable");
  const body = await response.json() as { result?: any; error?: { message?: string } };
  if (body.error) throw new Error(body.error.message || "Blockchain RPC error");
  return body.result;
}
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

export const Route = createFileRoute("/api/payments/base")({
  server: { handlers: {
    GET: async ({ request }) => {
      try {
        const userId = await requireUserId(bearer(request));
        return json({ chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS, recipientAddress: RECIPIENT_ADDRESS, products: Object.entries(PRODUCTS).map(([id, p]) => ({ id, ...p })), userId });
      } catch (error) { return json({ error: error instanceof Error ? error.message : "Unauthorized" }, 401); }
    },
    POST: async ({ request }) => {
      try {
        const userId = await requireUserId(bearer(request));
        const body = await request.json() as { action?: string; productId?: string; intentId?: string; txHash?: string };
        const db = getPrisma();

        if (body.action === "create") {
          if (!TOKEN_ADDRESS || !RECIPIENT_ADDRESS) return json({ error: "Blockchain payments are not configured." }, 503);
          assertAddress(TOKEN_ADDRESS); assertAddress(RECIPIENT_ADDRESS);
          const item = product(String(body.productId || ""));
          const id = randomUUID();
          const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
          await db.${queryRaw`
            insert into blockchain_payment_intents
              (id,user_id,product_id,chain_id,token_address,recipient_address,amount_atomic,status,expires_at)
            values
              (${id},${userId},${body.productId},${CHAIN_ID},${TOKEN_ADDRESS},${RECIPIENT_ADDRESS},${item.amountAtomic},'pending',${expiresAt})
          `;
          return json({ intentId: id, chainId: CHAIN_ID, tokenAddress: TOKEN_ADDRESS, recipientAddress: RECIPIENT_ADDRESS, amountAtomic: item.amountAtomic, product: item, expiresAt });
        }

        if (body.action === "verify") {
          if (!body.intentId || !body.txHash) return json({ error: "intentId and txHash are required" }, 400);
          if (!/^0x[0-9a-fA-F]{64}$/.test(body.txHash)) return json({ error: "Invalid transaction hash" }, 400);
          const intents = await db.${queryRaw`select * from blockchain_payment_intents where id = ${body.intentId} and user_id = ${userId} limit 1`;
          const intent = intents[0] as any;
          if (!intent) return json({ error: "Payment intent not found" }, 404);
          if (intent.status === "paid") return json({ ok: true, status: "paid", txHash: intent.tx_hash });
          if (new Date(String(intent.expires_at)).getTime() < Date.now()) return json({ error: "Payment intent expired" }, 400);

          const tx = await rpc("eth_getTransactionByHash", [body.txHash]);
          const receipt = await rpc("eth_getTransactionReceipt", [body.txHash]);
          if (!tx || !receipt) return json({ error: "Transaction not found yet" }, 202);
          if (tx.blockHash === null || receipt.status !== "0x1") return json({ error: "Transaction is not confirmed successfully" }, 400);
          if (String(tx.to || "").toLowerCase() !== TOKEN_ADDRESS.toLowerCase()) return json({ error: "Transaction did not call the configured USDC contract" }, 400);

          const from = String(tx.from || "").toLowerCase();
          const wantedRecipient = String(intent.recipient_address).toLowerCase().replace(/^0x/, "");
          const wantedAmount = BigInt(String(intent.amount_atomic)).toString(16).padStart(64, "0").toLowerCase();
          const recipientTopic = wantedRecipient.padStart(64, "0").toLowerCase();
          let matched = false;
          for (const log of receipt.logs ?? []) {
            const topics = log.topics ?? [];
            if (String(log.address).toLowerCase() !== TOKEN_ADDRESS.toLowerCase()) continue;
            if (String(topics[0]).toLowerCase() !== TRANSFER_TOPIC) continue;
            if (String(topics[2] || "").toLowerCase().replace(/^0x/, "").padStart(64, "0") !== recipientTopic) continue;
            if (String(topics[1] || "").toLowerCase().replace(/^0x/, "").padStart(64, "0") !== from.slice(2).padStart(64, "0")) continue;
            if (String(log.data || "").toLowerCase().replace(/^0x/, "").padStart(64, "0") !== wantedAmount) continue;
            matched = true; break;
          }
          if (!matched) return json({ error: "Payment amount, sender or recipient does not match the intent" }, 400);

          const item = product(String(intent.product_id));
          await db.$transaction(async (txDb: any) => {
            await txDb.${queryRaw`update blockchain_payment_intents set status='paid', tx_hash=${body.txHash}, paid_at=now() where id=${body.intentId} and status='pending'`;
            await txDb.purchaseReceipt.upsert({
              where: { provider_externalId: { provider: "base-usdc", externalId: body.txHash } },
              create: { userId, provider: "base-usdc", externalId: body.txHash, productId: intent.product_id, amountMinor: Math.round(Number(item.priceUsd) * 100), currency: "USD", status: "verified", rawJson: { chainId: CHAIN_ID, txHash: body.txHash, from, tokenAddress: TOKEN_ADDRESS } },
              update: { status: "verified", userId, productId: intent.product_id, amountMinor: Math.round(Number(item.priceUsd) * 100), currency: "USD" },
            });
            await txDb.entitlement.upsert({
              where: { userId_productId: { userId, productId: intent.product_id } },
              create: { userId, productId: intent.product_id, active: true, source: "purchase", expiresAt: null },
              update: { active: true, source: "purchase", expiresAt: null },
            });
          });
          return json({ ok: true, status: "paid", txHash: body.txHash, product: item });
        }
        return json({ error: "Unknown action" }, 400);
      } catch (error) { return json({ error: error instanceof Error ? error.message : "Payment request failed" }, 400); }
    },
  }},
});
