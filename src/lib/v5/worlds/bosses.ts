export type BossesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createBosses=(id:string):BossesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchBosses=(x:BossesRecord):BossesRecord=>({...x,updatedAt:Date.now()});
