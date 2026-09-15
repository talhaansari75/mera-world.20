export type ProgressRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createProgress=(id:string):ProgressRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchProgress=(x:ProgressRecord):ProgressRecord=>({...x,updatedAt:Date.now()});
