export type SeasonsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createSeasons=(id:string):SeasonsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchSeasons=(x:SeasonsRecord):SeasonsRecord=>({...x,updatedAt:Date.now()});
