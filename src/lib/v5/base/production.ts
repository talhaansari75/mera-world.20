export type ProductionRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createProduction=(id:string):ProductionRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchProduction=(x:ProductionRecord):ProductionRecord=>({...x,updatedAt:Date.now()});
