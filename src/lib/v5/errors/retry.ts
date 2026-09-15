export type RetryRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createRetry=(id:string):RetryRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchRetry=(x:RetryRecord):RetryRecord=>({...x,updatedAt:Date.now()});
