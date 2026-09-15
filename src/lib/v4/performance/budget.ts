export type Budget={name:string,ms:number};
export function withinBudget(start:number,budget:Budget){return Date.now()-start<=budget.ms}
