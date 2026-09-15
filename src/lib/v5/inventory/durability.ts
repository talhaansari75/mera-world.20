export type DurabilityRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createDurability=(id:string):DurabilityRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchDurability=(x:DurabilityRecord):DurabilityRecord=>({...x,updatedAt:Date.now()});
