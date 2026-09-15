export type CodesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createCodes=(id:string):CodesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchCodes=(x:CodesRecord):CodesRecord=>({...x,updatedAt:Date.now()});
