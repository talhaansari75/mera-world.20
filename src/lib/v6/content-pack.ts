export interface ContentPack { id:string; locale:string; words:string[]; categories:string[]; version:number }
export function validateContentPack(pack: ContentPack): string[] {
  const errors:string[]=[];
  if(!pack.id || !pack.locale) errors.push("id and locale are required");
  if(!Array.isArray(pack.words) || pack.words.length===0) errors.push("words must be non-empty");
  const dup=pack.words.filter((w,i,a)=>a.indexOf(w)!==i);
  if(dup.length) errors.push("duplicate words: "+[...new Set(dup)].join(","));
  return errors;
}
