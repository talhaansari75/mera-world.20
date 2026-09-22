import { useEffect, useState } from "react";
import { CreditCard, ExternalLink, Wallet, CheckCircle2 } from "lucide-react";
import { Screen, HudChips } from "@/components/screens/chrome";

type Product = { id: string; name: string; priceUsd: string; amountAtomic: string; diamonds: number };
type PaymentConfig = { chainId: number; tokenAddress: string; recipientAddress: string; products: Product[] };

function pad32(hex: string) { return hex.replace(/^0x/, "").padStart(64, "0"); }
function transferData(to: string, amount: string) {
  const selector = "a9059cbb";
  const recipient = pad32(to);
  const value = BigInt(amount).toString(16).padStart(64, "0");
  return "0x" + selector + recipient + value;
}

export function PaymentsScreen() {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [address, setAddress] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [paid, setPaid] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/payments/base").then(async r => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Payments unavailable");
      setConfig(data);
    }).catch(e => setMessage(e instanceof Error ? e.message : "Payments unavailable"));
  }, []);

  async function connect() {
    const ethereum = (window as any).ethereum;
    if (!ethereum) { setMessage("Install a Base-compatible wallet such as MetaMask or Coinbase Wallet."); return; }
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setAddress(String(accounts?.[0] || "").toLowerCase());
  }

  async function buy(product: Product) {
    const ethereum = (window as any).ethereum;
    if (!ethereum || !config || !address) { setMessage("Connect your wallet first."); return; }
    setBusy(true); setMessage("");
    try {
      const chainHex = await ethereum.request({ method: "eth_chainId" });
      const wanted = "0x" + config.chainId.toString(16);
      if (chainHex !== wanted) {
        try { await ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: wanted }] }); }
        catch { throw new Error("Please switch your wallet to the configured Base network."); }
      }
      const intentRes = await fetch("/api/payments/base", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "create", productId: product.id, payerAddress: address }),
      });
      const intent = await intentRes.json();
      if (!intentRes.ok) throw new Error(intent.error || "Could not create payment");
      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [{ from: address, to: intent.tokenAddress, data: transferData(intent.recipientAddress, intent.amountAtomic) }],
      });
      const verifyRes = await fetch("/api/payments/base", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "verify", intentId: intent.intentId, txHash }),
      });
      const verified = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verified.error || "Payment verification failed");
      setPaid(String(txHash)); setMessage(`Payment confirmed. +${product.diamonds} diamonds.`);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Payment failed");
    } finally { setBusy(false); }
  }

  return (
    <Screen title="Diamond Vault">
      <HudChips />
      <div className="mt-4 space-y-4 pb-8">
        <section className="panel rounded-3xl p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/15"><Wallet className="size-6 text-primary" /></span>
            <div><h2 className="font-display text-2xl text-fg">Buy Diamonds</h2><p className="text-sm text-muted">Verified USDC payments on Base.</p></div>
          </div>
          <button type="button" onClick={() => void connect()} className="btn-primary mt-5" disabled={busy}>
            <Wallet className="mr-2 size-4" /> {address ? address.slice(0, 6) + "…" + address.slice(-4) : "Connect wallet"}
          </button>
        </section>
        {config && <div className="grid gap-3 sm:grid-cols-3">{config.products.map(p => (
          <button key={p.id} type="button" disabled={busy || !address} onClick={() => void buy(p)} className="panel rounded-2xl p-4 text-left transition-transform hover:-translate-y-0.5 disabled:opacity-50">
            <p className="text-xs uppercase tracking-wider text-accent">{p.name}</p>
            <p className="mt-2 font-display text-2xl text-fg">{p.diamonds.toLocaleString()} ◆</p>
            <p className="mt-1 text-sm text-muted">${p.priceUsd} USDC</p>
          </button>
        ))}</div>}
        {message && <div className="panel rounded-2xl p-4 text-sm text-muted">{message}</div>}
        {paid && <a className="inline-flex items-center gap-2 text-xs text-accent" target="_blank" rel="noreferrer" href={`https://basescan.org/tx/${paid}`}>View verified transaction <ExternalLink className="size-3" /></a>}
        <div className="rounded-2xl border border-border bg-surface-2 p-4 text-xs text-muted">
          <CheckCircle2 className="mb-2 size-4 text-success" /> Payments are not credited from the client alone. The server verifies chain, token, sender, recipient, amount and transaction status before granting diamonds.
        </div>
      </div>
    </Screen>
  );
}
export default PaymentsScreen;
