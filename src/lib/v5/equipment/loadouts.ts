export type LoadoutsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createLoadouts=(id:string):LoadoutsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchLoadouts=(x:LoadoutsRecord):LoadoutsRecord=>({...x,updatedAt:Date.now()});
