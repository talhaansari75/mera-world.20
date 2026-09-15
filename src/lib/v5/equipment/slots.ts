export type SlotsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createSlots=(id:string):SlotsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchSlots=(x:SlotsRecord):SlotsRecord=>({...x,updatedAt:Date.now()});
