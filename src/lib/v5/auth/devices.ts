export type DevicesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createDevices=(id:string):DevicesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchDevices=(x:DevicesRecord):DevicesRecord=>({...x,updatedAt:Date.now()});
