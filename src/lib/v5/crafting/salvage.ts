export type SalvageRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createSalvage=(id:string):SalvageRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchSalvage=(x:SalvageRecord):SalvageRecord=>({...x,updatedAt:Date.now()});
