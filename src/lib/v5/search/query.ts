export type QueryRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createQuery=(id:string):QueryRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchQuery=(x:QueryRecord):QueryRecord=>({...x,updatedAt:Date.now()});
