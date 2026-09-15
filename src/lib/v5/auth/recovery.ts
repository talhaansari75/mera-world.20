export type RecoveryRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createRecovery=(id:string):RecoveryRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchRecovery=(x:RecoveryRecord):RecoveryRecord=>({...x,updatedAt:Date.now()});
