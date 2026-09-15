import { createFileRoute } from "@tanstack/react-router";
import { HmacPaymentProvider } from "@/lib/payments/providerBoundary";
import { getPrisma } from "@/lib/db";
import { Currency } from "@prisma/client";

export const Route = createFileRoute("/api/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const providerName = process.env.PAYMENT_PROVIDER?.trim();
        const secret = process.env.PAYMENT_WEBHOOK_SECRET?.trim();
        if (!providerName || !secret) {
          return new Response(JSON.stringify({ ok: false, error: "Payment provider is not configured." }), {
            status: 503,
            headers: { "content-type": "application/json" },
          });
        }
        const verified = await new HmacPaymentProvider(secret, providerName).verifyWebhook(
          raw,
          request.headers.get("x-payment-signature") ?? request.headers.get("x-signature") ?? undefined,
        );
        if (!verified) {
          return new Response(JSON.stringify({ ok: false, error: "Invalid webhook signature or payload." }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }
        const db = getPrisma();
        await db.$transaction(async (tx) => {
          if (verified.status === "refunded") {
            await tx.purchaseReceipt.updateMany({
              where: { provider: verified.provider, externalId: verified.externalId },
              data: { status: "refunded", rawJson: verified.raw },
            });
            await tx.entitlement.updateMany({
              where: { userId: verified.userId, productId: verified.productId },
              data: { active: false, source: "refund" },
            });
            return;
          }
          const currency = (Object.prototype.hasOwnProperty.call(Currency, verified.currency) ? verified.currency : "USD") as Currency;
          await tx.purchaseReceipt.upsert({
            where: { provider_externalId: { provider: verified.provider, externalId: verified.externalId } },
            create: {
              userId: verified.userId,
              provider: verified.provider,
              externalId: verified.externalId,
              productId: verified.productId,
              amountMinor: verified.amountMinor,
              currency,
              status: "verified",
              rawJson: verified.raw,
            },
            update: {
              status: "verified",
              rawJson: verified.raw,
              userId: verified.userId,
              productId: verified.productId,
              amountMinor: verified.amountMinor,
              currency,
            },
          });
          await tx.entitlement.upsert({
            where: { userId_productId: { userId: verified.userId, productId: verified.productId } },
            create: {
              userId: verified.userId,
              productId: verified.productId,
              active: true,
              source: "purchase",
              expiresAt: verified.expiresAt ? new Date(verified.expiresAt) : null,
            },
            update: {
              active: true,
              source: "purchase",
              expiresAt: verified.expiresAt ? new Date(verified.expiresAt) : null,
            },
          });
        });
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
