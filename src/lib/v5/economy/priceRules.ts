export type Price={currency:"coins"|"diamonds"|"stars";amount:number};
export const clampPrice=(p:Price):Price=>({...p,amount:Math.max(0,Math.min(9_999_999,Math.floor(p.amount)))});
export const isValidPrice=(p:Price)=>Number.isInteger(p.amount)&&p.amount>=0&&p.amount<=9_999_999;
