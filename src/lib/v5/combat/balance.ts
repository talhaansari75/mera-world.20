export type BalanceRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createBalance=(id:string):BalanceRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchBalance=(x:BalanceRecord):BalanceRecord=>({...x,updatedAt:Date.now()});
