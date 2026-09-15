export type PerformanceContract3 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const performance03 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
