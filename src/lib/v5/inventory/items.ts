export type ItemsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createItems=(id:string):ItemsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchItems=(x:ItemsRecord):ItemsRecord=>({...x,updatedAt:Date.now()});
