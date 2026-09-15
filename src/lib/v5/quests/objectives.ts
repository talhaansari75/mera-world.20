export type ObjectivesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createObjectives=(id:string):ObjectivesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchObjectives=(x:ObjectivesRecord):ObjectivesRecord=>({...x,updatedAt:Date.now()});
