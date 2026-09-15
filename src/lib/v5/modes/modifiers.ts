export type ModifiersRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createModifiers=(id:string):ModifiersRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchModifiers=(x:ModifiersRecord):ModifiersRecord=>({...x,updatedAt:Date.now()});
