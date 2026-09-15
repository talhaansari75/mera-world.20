export type IndexRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createIndex=(id:string):IndexRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchIndex=(x:IndexRecord):IndexRecord=>({...x,updatedAt:Date.now()});
