export type CapacityRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createCapacity=(id:string):CapacityRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchCapacity=(x:CapacityRecord):CapacityRecord=>({...x,updatedAt:Date.now()});
