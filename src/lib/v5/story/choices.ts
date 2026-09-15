export type ChoicesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createChoices=(id:string):ChoicesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchChoices=(x:ChoicesRecord):ChoicesRecord=>({...x,updatedAt:Date.now()});
