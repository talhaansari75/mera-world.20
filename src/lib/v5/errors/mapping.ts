export type MappingRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createMapping=(id:string):MappingRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchMapping=(x:MappingRecord):MappingRecord=>({...x,updatedAt:Date.now()});
