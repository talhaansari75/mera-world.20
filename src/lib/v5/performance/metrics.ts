export type MetricsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createMetrics=(id:string):MetricsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchMetrics=(x:MetricsRecord):MetricsRecord=>({...x,updatedAt:Date.now()});
