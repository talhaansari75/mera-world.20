export type BuildingsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createBuildings=(id:string):BuildingsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchBuildings=(x:BuildingsRecord):BuildingsRecord=>({...x,updatedAt:Date.now()});
