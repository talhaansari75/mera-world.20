export type RewardsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createRewards=(id:string):RewardsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchRewards=(x:RewardsRecord):RewardsRecord=>({...x,updatedAt:Date.now()});
