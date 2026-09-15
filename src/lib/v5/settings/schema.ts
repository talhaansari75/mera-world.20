export type SchemaRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createSchema=(id:string):SchemaRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchSchema=(x:SchemaRecord):SchemaRecord=>({...x,updatedAt:Date.now()});
