export type CasesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createCases=(id:string):CasesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchCases=(x:CasesRecord):CasesRecord=>({...x,updatedAt:Date.now()});
