import { evaluatePublishReadiness, type PublishReadiness } from "@/lib/v39/publish/readiness";
import { listDrafts, type CreatorDraft } from "@/lib/v24/creator/creatorService";

export type CreatorReleasePackage = {
  schema: "mera-word-search-journey.creator-release";
  version: 1;
  exportedAt: string;
  appVersion: "v40";
  draft: CreatorDraft;
  readiness: Pick<PublishReadiness, "score" | "ready" | "blockers" | "recommendations"> & { auditScore:number; latestPlaytestScore:number|null };
  integrity: { algorithm: "SHA-256" | "FNV-1a"; digest: string };
};

export function canonicalReleaseData(draft: CreatorDraft, readiness: PublishReadiness) {
  return JSON.stringify({
    id:draft.id,title:draft.title,words:draft.words,category:draft.category,
    createdAt:draft.createdAt,updatedAt:draft.updatedAt,status:draft.status,
    readiness:{score:readiness.score,ready:readiness.ready,blockers:readiness.blockers,recommendations:readiness.recommendations,
      auditScore:readiness.audit.score,latestPlaytestScore:readiness.latest?.score ?? null}
  });
}

function fnv1a(input:string) { let h=2166136261; for(let i=0;i<input.length;i++) h=Math.imul(h ^ input.charCodeAt(i),16777619); return (h>>>0).toString(16).padStart(8,"0"); }

export async function digestFor(input:string):Promise<{algorithm:"SHA-256"|"FNV-1a";digest:string}> {
  try {
    if (globalThis.crypto?.subtle) {
      const bytes=new TextEncoder().encode(input);
      const hash=await crypto.subtle.digest("SHA-256",bytes);
      return {algorithm:"SHA-256",digest:Array.from(new Uint8Array(hash)).map(x=>x.toString(16).padStart(2,"0")).join("")};
    }
  } catch { /* deterministic fallback below */ }
  return {algorithm:"FNV-1a",digest:fnv1a(input)};
}

export async function buildReleasePackage(draftId:string):Promise<CreatorReleasePackage|null>{
  const draft=listDrafts().find(d=>d.id===draftId); if(!draft)return null;
  const readiness=evaluatePublishReadiness(draftId); if(!readiness)return null;
  const data=canonicalReleaseData(draft,readiness);
  return {schema:"mera-word-search-journey.creator-release",version:1,exportedAt:new Date().toISOString(),appVersion:"v40",draft,
    readiness:{score:readiness.score,ready:readiness.ready,blockers:readiness.blockers,recommendations:readiness.recommendations,auditScore:readiness.audit.score,latestPlaytestScore:readiness.latest?.score??null},
    integrity:await digestFor(data)};
}

export function listReleaseCandidates(){return listDrafts().filter(d=>d.status!=="archived").map(d=>({draft:d,readiness:evaluatePublishReadiness(d.id)})).filter(x=>x.readiness)};

export function downloadReleasePackage(pkg:CreatorReleasePackage){
  const blob=new Blob([JSON.stringify(pkg,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob); const a=document.createElement("a");
  a.href=url; a.download=`${pkg.draft.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"creator-puzzle"}-release-v40.json`;
  a.click(); setTimeout(()=>URL.revokeObjectURL(url),0);
}
