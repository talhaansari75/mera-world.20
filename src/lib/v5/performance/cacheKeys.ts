export type CachekeysRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createCachekeys=(id:string):CachekeysRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchCachekeys=(x:CachekeysRecord):CachekeysRecord=>({...x,updatedAt:Date.now()});
