export type MultiplayerContract3 = { id:string; version:1; enabled:boolean; metadata:Record<string,unknown> };
export const multiplayer03 = (id:string)=>({id,version:1 as const,enabled:true,metadata:{}});
