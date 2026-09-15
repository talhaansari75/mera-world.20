export type PrivacyContract4 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const privacy04 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
