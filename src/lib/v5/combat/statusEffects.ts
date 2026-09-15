export type StatuseffectsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createStatuseffects=(id:string):StatuseffectsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchStatuseffects=(x:StatuseffectsRecord):StatuseffectsRecord=>({...x,updatedAt:Date.now()});
