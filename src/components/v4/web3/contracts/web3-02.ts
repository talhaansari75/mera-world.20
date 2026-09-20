export type Web3Contract2 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const web302 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
