export type StorageRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createStorage=(id:string):StorageRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchStorage=(x:StorageRecord):StorageRecord=>({...x,updatedAt:Date.now()});
