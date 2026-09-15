export type SafemessageRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createSafemessage=(id:string):SafemessageRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchSafemessage=(x:SafemessageRecord):SafemessageRecord=>({...x,updatedAt:Date.now()});
