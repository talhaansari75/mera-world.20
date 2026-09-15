export type MaterialsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createMaterials=(id:string):MaterialsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchMaterials=(x:MaterialsRecord):MaterialsRecord=>({...x,updatedAt:Date.now()});
