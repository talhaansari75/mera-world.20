export type OfflineContract3 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const offline03 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
