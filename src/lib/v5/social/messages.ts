export type MessagesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createMessages=(id:string):MessagesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchMessages=(x:MessagesRecord):MessagesRecord=>({...x,updatedAt:Date.now()});
