export type StackingRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createStacking=(id:string):StackingRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchStacking=(x:StackingRecord):StackingRecord=>({...x,updatedAt:Date.now()});
