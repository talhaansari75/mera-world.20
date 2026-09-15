export type FlagsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createFlags=(id:string):FlagsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchFlags=(x:FlagsRecord):FlagsRecord=>({...x,updatedAt:Date.now()});
