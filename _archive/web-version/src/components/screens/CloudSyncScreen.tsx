import React,{useEffect,useState} from "react";
import { loadCloudSave, pushCloudSave } from "@/lib/server/cloud";
import { useGame } from "@/lib/store";
import {pendingSyncCount,syncCloud,type SyncStatus} from "../../lib/game/cloudSyncV18";
export function CloudSyncScreen({onBack}:{onBack:()=>void}){
 const [status,setStatus]=useState<SyncStatus>("idle"),[message,setMessage]=useState(""),[revision,setRevision]=useState(0);
 const run=async()=>{setStatus("syncing");setMessage("");try{const r=await loadCloudSave();if(!(r as any).ok){setStatus("error");setMessage((r as any).error);return;}setRevision((r as any).revision);if((r as any).save)useGame.getState().applyCloud((r as any).save as never);setStatus("synced");setMessage((r as any).save?`Cloud revision ${(r as any).revision} loaded.`:"No cloud save yet.");}catch{const r=await syncCloud();setStatus((r as any).status);setMessage((r as any).message||"");}};
 const push=async()=>{setStatus("syncing");setMessage("");try{const r=await pushCloudSave({data:{json:useGame.getState().exportJson(),expectedRevision:revision}});if((r as any).ok){setRevision((r as any).revision);setStatus("synced");setMessage(`Saved as cloud revision ${(r as any).revision}.`);}else{setStatus((r as any).conflict?"conflict":"error");setMessage((r as any).error);} }catch{setStatus("error");setMessage("Sign in to sync.");}};
 useEffect(()=>{void run()},[]);
 return <div className="min-h-screen p-5"><div className="mx-auto max-w-xl space-y-4">
  <h1 className="text-2xl font-bold">Cloud Sync</h1>
  <div className="rounded-2xl border p-4"><div>Status: <b>{status}</b></div><div className="opacity-70">Pending local saves: {pendingSyncCount()}</div>{message&&<p className="mt-2 text-sm">{message}</p>}</div>
  <div className="flex gap-2"><button onClick={()=>void run()} className="rounded-xl border px-4 py-2">Pull Latest</button><button onClick={()=>void push()} className="rounded-xl border px-4 py-2">Push Safely</button><button onClick={onBack} className="rounded-xl border px-4 py-2">Back</button></div>
 </div></div>
}
