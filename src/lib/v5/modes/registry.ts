export type RegistryRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createRegistry=(id:string):RegistryRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchRegistry=(x:RegistryRecord):RegistryRecord=>({...x,updatedAt:Date.now()});
