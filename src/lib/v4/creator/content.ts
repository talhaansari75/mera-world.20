export type ContentPack={id:string,name:string,version:number,language:string,words:string[],published:boolean};
export function normalizePack(p:ContentPack):ContentPack{return {...p,words:[...new Set(p.words.map(w=>w.trim().toLocaleUpperCase()).filter(Boolean))]}}
