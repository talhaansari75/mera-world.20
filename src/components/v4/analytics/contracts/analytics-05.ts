export type AnalyticsContract5 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const analytics05 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
