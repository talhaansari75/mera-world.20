export type PaymentsContract5 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const payments05 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
