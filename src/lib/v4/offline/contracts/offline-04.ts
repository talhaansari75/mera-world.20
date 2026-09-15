export type OfflineContract4 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const offline04 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
