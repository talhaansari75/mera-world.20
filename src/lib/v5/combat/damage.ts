export type DamageRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createDamage=(id:string):DamageRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchDamage=(x:DamageRecord):DamageRecord=>({...x,updatedAt:Date.now()});
