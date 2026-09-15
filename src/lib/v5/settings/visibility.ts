export type VisibilityRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createVisibility=(id:string):VisibilityRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchVisibility=(x:VisibilityRecord):VisibilityRecord=>({...x,updatedAt:Date.now()});
