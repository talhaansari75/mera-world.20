export type FiltersRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createFilters=(id:string):FiltersRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchFilters=(x:FiltersRecord):FiltersRecord=>({...x,updatedAt:Date.now()});
