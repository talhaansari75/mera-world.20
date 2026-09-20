import { useEffect, useState } from "react";
import { Screen } from "@/components/screens/chrome";
import { getMyEntitlements } from "@/lib/v13/payments/server";
export function PaymentsScreen({onBack}:{onBack:()=>void}) {
 const [rows,setRows]=useState<Awaited<ReturnType<typeof getMyEntitlements>>>([]),[error,setError]=useState("");
 useEffect(()=>{void getMyEntitlements().then(setRows).catch(()=>setError("Sign in to view account entitlements."))},[]);
 return <Screen title="Purchases & Entitlements" onBack={onBack}>
  <div className="panel rounded-2xl p-4"><p className="font-semibold text-fg">Secure payment boundary</p><p className="mt-2 text-sm text-muted">Purchase verification belongs on the server/provider webhook. The browser never receives payment secrets.</p></div>
  // @ts-ignore
  <div className="mt-3 flex flex-col gap-2">{rows.map((r: any)=><div key={r.productId} className="panel flex justify-between rounded-xl p-3"><span className="text-fg">{r.productId}</span><span className="text-muted">{r.active ? "Active" : "Inactive"}</span></div>)}{!rows.length&&!error&&<p className="text-sm text-muted">No active entitlements.</p>}{error&&<p className="text-sm text-muted">{error}</p>}</div>
 </Screen>
}
