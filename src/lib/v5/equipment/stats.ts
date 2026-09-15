export type StatsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createStats=(id:string):StatsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchStats=(x:StatsRecord):StatsRecord=>({...x,updatedAt:Date.now()});
