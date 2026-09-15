export type SessionsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createSessions=(id:string):SessionsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchSessions=(x:SessionsRecord):SessionsRecord=>({...x,updatedAt:Date.now()});
