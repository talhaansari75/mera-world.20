export type AiContract4 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const ai04 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
