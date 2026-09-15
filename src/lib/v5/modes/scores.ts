export type ScoresRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createScores=(id:string):ScoresRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchScores=(x:ScoresRecord):ScoresRecord=>({...x,updatedAt:Date.now()});
