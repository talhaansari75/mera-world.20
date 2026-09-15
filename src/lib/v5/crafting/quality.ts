export type QualityRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createQuality=(id:string):QualityRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchQuality=(x:QualityRecord):QualityRecord=>({...x,updatedAt:Date.now()});
