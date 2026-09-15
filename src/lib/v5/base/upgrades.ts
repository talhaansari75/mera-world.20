export type UpgradesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createUpgrades=(id:string):UpgradesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchUpgrades=(x:UpgradesRecord):UpgradesRecord=>({...x,updatedAt:Date.now()});
