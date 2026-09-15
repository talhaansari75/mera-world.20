export type RarityRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createRarity=(id:string):RarityRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchRarity=(x:RarityRecord):RarityRecord=>({...x,updatedAt:Date.now()});
