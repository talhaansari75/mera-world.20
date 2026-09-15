export type UnlockingRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createUnlocking=(id:string):UnlockingRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchUnlocking=(x:UnlockingRecord):UnlockingRecord=>({...x,updatedAt:Date.now()});
