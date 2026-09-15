export type ValidationRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createValidation=(id:string):ValidationRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchValidation=(x:ValidationRecord):ValidationRecord=>({...x,updatedAt:Date.now()});
