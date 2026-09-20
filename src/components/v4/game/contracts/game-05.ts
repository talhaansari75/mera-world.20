export type GameContract5 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const game05 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
