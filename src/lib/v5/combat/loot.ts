export type LootRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createLoot=(id:string):LootRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchLoot=(x:LootRecord):LootRecord=>({...x,updatedAt:Date.now()});
