export type DefaultsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createDefaults=(id:string):DefaultsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchDefaults=(x:DefaultsRecord):DefaultsRecord=>({...x,updatedAt:Date.now()});
