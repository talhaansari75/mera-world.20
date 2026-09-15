export type CatalogRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createCatalog=(id:string):CatalogRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchCatalog=(x:CatalogRecord):CatalogRecord=>({...x,updatedAt:Date.now()});
