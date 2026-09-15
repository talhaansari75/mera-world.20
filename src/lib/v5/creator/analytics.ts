export type AnalyticsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createAnalytics=(id:string):AnalyticsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchAnalytics=(x:AnalyticsRecord):AnalyticsRecord=>({...x,updatedAt:Date.now()});
