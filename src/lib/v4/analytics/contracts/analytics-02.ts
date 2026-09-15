export type AnalyticsContract2 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const analytics02 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
