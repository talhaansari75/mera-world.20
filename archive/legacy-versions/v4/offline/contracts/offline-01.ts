export type OfflineContract1 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const offline01 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
