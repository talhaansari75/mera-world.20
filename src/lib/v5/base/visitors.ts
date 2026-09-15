export type VisitorsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createVisitors=(id:string):VisitorsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchVisitors=(x:VisitorsRecord):VisitorsRecord=>({...x,updatedAt:Date.now()});
