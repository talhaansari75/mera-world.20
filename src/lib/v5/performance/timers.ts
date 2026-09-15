export type TimersRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createTimers=(id:string):TimersRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchTimers=(x:TimersRecord):TimersRecord=>({...x,updatedAt:Date.now()});
