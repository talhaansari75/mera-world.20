export type DailyRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createDaily=(id:string):DailyRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchDaily=(x:DailyRecord):DailyRecord=>({...x,updatedAt:Date.now()});
