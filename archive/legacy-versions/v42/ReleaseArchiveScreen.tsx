import { useMemo, useState } from "react";
import { Archive, Download, ShieldCheck, Trash2, Upload } from "lucide-react";
import { Screen } from "@/components/screens/chrome";
import { useGame } from "@/lib/store";
import { archiveRelease, exportArchiveManifest, listArchivedReleases, removeArchivedRelease, type ArchivedRelease } from "@/lib/v42_releaseArchive";
import { parseReleasePackage } from "@/lib/v41_releaseVerifier";

function download(text: string, name: string) { const url=URL.createObjectURL(new Blob([text],{type:"application/json"})); const a=document.createElement("a"); a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url),0); }
export function ReleaseArchiveScreen() {
  const go = useGame.getState().go; const [items,setItems]=useState<ArchivedRelease[]>(listArchivedReleases()); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
  const refresh=()=>setItems(listArchivedReleases()); const readyCount=useMemo(()=>items.filter(x=>x.package.readiness.ready).length,[items]);
  const inspect=async(file:File)=>{setBusy(true);setMessage("");try{const entry=await archiveRelease(parseReleasePackage(await file.text()),file.name);refresh();setMessage(`Archived “${entry.package.draft.title}” after local verification.`);}catch(e){setMessage(e instanceof Error?e.message:"Could not archive package.");}finally{setBusy(false);}};
  return <Screen title="Release Archive"><div className="grid gap-4">
    <section className="panel rounded-2xl p-5"><p className="text-xs uppercase tracking-wider text-primary">V42 local release catalog</p><h2 className="font-display mt-1 text-2xl text-fg">Verified release archive</h2><p className="mt-2 text-sm text-muted">Keep verified Creator release packages on this device, deduplicate by integrity digest, and export a lightweight catalog manifest. Files remain local.</p></section>
    <label className="panel flex cursor-pointer items-center justify-center gap-3 rounded-2xl p-5 text-sm font-semibold text-fg"><Upload className="size-5 text-primary"/><span>{busy?"Verifying & archiving…":"Import verified release JSON"}</span><input type="file" accept="application/json,.json" className="sr-only" disabled={busy} onChange={e=>{const f=e.target.files?.[0];if(f)void inspect(f);}}/></label>
    {message&&<p className="rounded-xl border border-border p-3 text-sm text-muted">{message}</p>}
    <section className="panel rounded-2xl p-5"><div className="flex items-center gap-2 text-fg"><Archive className="size-5 text-primary"/><b>{items.length} archived release{items.length===1?"":"s"}</b><span className="ml-auto text-xs text-muted">{readyCount} ready</span></div>
      <div className="mt-4 grid gap-3">{items.length===0?<p className="text-sm text-muted">No releases archived yet. Import a verified JSON package.</p>:items.map(x=><article key={x.archiveId} className="rounded-xl border border-border p-4"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 size-5 text-primary"/><div className="min-w-0 flex-1"><b className="text-fg">{x.package.draft.title}</b><p className="mt-1 text-xs text-muted">{x.fileName} · readiness {x.package.readiness.score}/100 · {x.package.readiness.ready?"ready":"blocked"}</p><p className="mt-1 break-all font-mono text-[10px] text-muted">{x.package.integrity.algorithm}: {x.package.integrity.digest}</p></div><button aria-label={`Remove ${x.package.draft.title}`} onClick={()=>{removeArchivedRelease(x.archiveId);refresh();}} className="text-muted hover:text-fg"><Trash2 className="size-4"/></button></div></article>)}</div>
    </section>
    <div className="flex flex-wrap gap-4"><button disabled={!items.length} onClick={()=>download(exportArchiveManifest(items),"creator-release-archive-v42.json")} className="flex items-center gap-2 text-sm text-primary disabled:opacity-40"><Download className="size-4"/>Export archive manifest</button><button onClick={()=>go("releaseVerifier")} className="text-sm text-primary">← Release Verifier</button><button onClick={()=>go("releasePackage")} className="text-sm text-primary">Release Package →</button><button onClick={()=>go("more")} className="text-sm text-muted">More</button></div>
  </div></Screen>;
}
