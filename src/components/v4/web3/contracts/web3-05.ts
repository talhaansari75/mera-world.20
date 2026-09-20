export type Web3Contract5 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const web305 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
