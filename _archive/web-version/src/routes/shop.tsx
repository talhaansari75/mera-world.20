import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { connectWallet, sendUsdcPayment, switchToChain } from "@/lib/web3/base";

type Product={id:string;name:string;priceUsd:string;amountAtomic:string;diamonds:number};
type Config={chainId:number;tokenAddress:string;recipientAddress:string;products:Product[];error?:string};
export const Route=createFileRoute("/shop")({component:Shop});
function Shop(){
 const [config,setConfig]=useState<Config|null>(null),[wallet,setWallet]=useState(""),[busy,setBusy]=useState(false),[message,setMessage]=useState("");
 useEffect(()=>{fetch("/api/payments/base").then(r=>r.json()).then(setConfig).catch(()=>setMessage("Payment service unavailable."));},[]);
 async function buy(item:Product){if(!config)return;setBusy(true);setMessage("");try{
  const address=await connectWallet();setWallet(address);await switchToChain(config.chainId);
  const ir=await fetch("/api/payments/base",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"create",productId:item.id,payerAddress:address})});
  const intent=await ir.json();if(!ir.ok)throw new Error(intent.error||"Could not create payment.");
  const txHash=await sendUsdcPayment(intent.tokenAddress,intent.recipientAddress,intent.amountAtomic);
  const vr=await fetch("/api/payments/base",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({action:"verify",intentId:intent.intentId,txHash})});
  const verified=await vr.json();if(!vr.ok&&vr.status!==202)throw new Error(verified.error||"Payment verification failed.");
  setMessage(verified.status==="paid"?`Payment confirmed. ${item.diamonds.toLocaleString()} gems unlocked.`:"Transaction submitted. Press Verify again after confirmation.");
 }catch(e){setMessage(e instanceof Error?e.message:"Payment failed.");}finally{setBusy(false);}}
 return <main className="min-h-dvh bg-[#060914] px-4 py-10 text-white"><div className="mx-auto max-w-5xl">
 <div className="mb-10"><p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Ink & Starlight</p><h1 className="mt-3 text-4xl font-semibold">Gem Shop</h1><p className="mt-2 text-slate-400">Pay with USDC on Base. Blockchain verification happens on the server.</p>{wallet&&<p className="mt-3 text-xs text-slate-500">Wallet: {wallet.slice(0,6)}…{wallet.slice(-4)}</p>}</div>
 {!config?<p>{message||"Loading payment options…"}</p>:config.error?<div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-amber-200">{config.error}</div>:<div className="grid gap-5 md:grid-cols-3">{config.products.map(item=><article key={item.id} className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl"><h2 className="text-xl font-semibold">{item.name}</h2><p className="mt-4 text-3xl font-bold">${item.priceUsd}</p><p className="mt-2 text-slate-400">{item.diamonds.toLocaleString()} Gems</p><button disabled={busy} onClick={()=>buy(item)} className="mt-6 w-full rounded-2xl bg-indigo-500 px-4 py-3 font-semibold disabled:opacity-50">{busy?"Processing…":"Pay with USDC"}</button></article>)}</div>}
 </div></main>;
}