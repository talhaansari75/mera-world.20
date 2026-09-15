export type ReportsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createReports=(id:string):ReportsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchReports=(x:ReportsRecord):ReportsRecord=>({...x,updatedAt:Date.now()});
