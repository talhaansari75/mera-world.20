export type QueueRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createQueue=(id:string):QueueRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchQueue=(x:QueueRecord):QueueRecord=>({...x,updatedAt:Date.now()});
