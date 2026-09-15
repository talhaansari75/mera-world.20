export type CloudContract2 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const cloud02 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
