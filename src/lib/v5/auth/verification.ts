export type VerificationRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createVerification=(id:string):VerificationRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchVerification=(x:VerificationRecord):VerificationRecord=>({...x,updatedAt:Date.now()});
