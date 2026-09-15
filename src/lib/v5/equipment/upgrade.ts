export type UpgradeRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createUpgrade=(id:string):UpgradeRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchUpgrade=(x:UpgradeRecord):UpgradeRecord=>({...x,updatedAt:Date.now()});
