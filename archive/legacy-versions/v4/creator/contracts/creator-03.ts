export type CreatorContract3 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const creator03 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
