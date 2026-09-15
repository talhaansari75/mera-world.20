export type Reward={currency:"coins"|"diamonds"|"stars"|"xp";amount:number;reason:string};
export type LedgerEntry={id:string;userId:string;rewards:Reward[];createdAt:number;idempotencyKey:string};
export const validateReward=(r:Reward)=>Number.isSafeInteger(r.amount)&&r.amount>=0&&r.amount<=1_000_000&&r.reason.length<=120;
export const total=(entries:LedgerEntry[],currency:Reward["currency"])=>entries.flatMap(e=>e.rewards).filter(r=>r.currency===currency).reduce((n,r)=>n+r.amount,0);
