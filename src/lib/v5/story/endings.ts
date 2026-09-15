export type EndingsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createEndings=(id:string):EndingsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchEndings=(x:EndingsRecord):EndingsRecord=>({...x,updatedAt:Date.now()});
