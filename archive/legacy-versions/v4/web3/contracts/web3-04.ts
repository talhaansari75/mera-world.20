export type Web3Contract4 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const web304 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
