export type RankingRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createRanking=(id:string):RankingRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchRanking=(x:RankingRecord):RankingRecord=>({...x,updatedAt:Date.now()});
