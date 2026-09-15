export type CareRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createCare=(id:string):CareRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchCare=(x:CareRecord):CareRecord=>({...x,updatedAt:Date.now()});
