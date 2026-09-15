export type MilestonesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createMilestones=(id:string):MilestonesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchMilestones=(x:MilestonesRecord):MilestonesRecord=>({...x,updatedAt:Date.now()});
