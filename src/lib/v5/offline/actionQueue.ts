export type QueuedAction={id:string;type:string;payload:unknown;createdAt:number;attempts:number};
export const next=(q:QueuedAction[])=>q.find(x=>x.attempts<5);
export const backoff=(attempts:number)=>Math.min(60000,1000*2**Math.max(0,attempts));
