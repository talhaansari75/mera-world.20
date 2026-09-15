export type PasswordsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createPasswords=(id:string):PasswordsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchPasswords=(x:PasswordsRecord):PasswordsRecord=>({...x,updatedAt:Date.now()});
