export type RegionsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createRegions=(id:string):RegionsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchRegions=(x:RegionsRecord):RegionsRecord=>({...x,updatedAt:Date.now()});
