export type KeywordsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createKeywords=(id:string):KeywordsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchKeywords=(x:KeywordsRecord):KeywordsRecord=>({...x,updatedAt:Date.now()});
