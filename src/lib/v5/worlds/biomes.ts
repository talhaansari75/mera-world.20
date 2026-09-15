export type BiomesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createBiomes=(id:string):BiomesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchBiomes=(x:BiomesRecord):BiomesRecord=>({...x,updatedAt:Date.now()});
