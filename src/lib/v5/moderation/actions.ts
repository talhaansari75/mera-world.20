export type ActionsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createActions=(id:string):ActionsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchActions=(x:ActionsRecord):ActionsRecord=>({...x,updatedAt:Date.now()});
