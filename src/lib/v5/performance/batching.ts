export type BatchingRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createBatching=(id:string):BatchingRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchBatching=(x:BatchingRecord):BatchingRecord=>({...x,updatedAt:Date.now()});
