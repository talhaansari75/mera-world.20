export type PaymentsContract3 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const payments03 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
