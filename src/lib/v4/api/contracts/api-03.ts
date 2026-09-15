export type ApiContract3 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const api03 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
