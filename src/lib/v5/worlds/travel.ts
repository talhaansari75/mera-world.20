export type TravelRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createTravel=(id:string):TravelRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchTravel=(x:TravelRecord):TravelRecord=>({...x,updatedAt:Date.now()});
