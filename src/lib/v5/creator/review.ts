export type ReviewRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createReview=(id:string):ReviewRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchReview=(x:ReviewRecord):ReviewRecord=>({...x,updatedAt:Date.now()});
