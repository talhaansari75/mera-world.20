export type DraftsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createDrafts=(id:string):DraftsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchDrafts=(x:DraftsRecord):DraftsRecord=>({...x,updatedAt:Date.now()});
