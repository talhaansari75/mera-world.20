export type ContentContract4 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const content04 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
