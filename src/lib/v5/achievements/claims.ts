export type ClaimsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createClaims=(id:string):ClaimsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchClaims=(x:ClaimsRecord):ClaimsRecord=>({...x,updatedAt:Date.now()});
