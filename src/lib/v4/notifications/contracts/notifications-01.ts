export type NotificationsContract1 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const notifications01 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
