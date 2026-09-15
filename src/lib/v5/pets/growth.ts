export type GrowthRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createGrowth=(id:string):GrowthRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchGrowth=(x:GrowthRecord):GrowthRecord=>({...x,updatedAt:Date.now()});
