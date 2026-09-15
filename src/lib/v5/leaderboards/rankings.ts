export type RankingsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createRankings=(id:string):RankingsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchRankings=(x:RankingsRecord):RankingsRecord=>({...x,updatedAt:Date.now()});
