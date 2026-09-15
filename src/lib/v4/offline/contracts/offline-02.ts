export type OfflineContract2 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const offline02 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
