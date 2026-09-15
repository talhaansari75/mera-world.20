export type PublishingRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createPublishing=(id:string):PublishingRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchPublishing=(x:PublishingRecord):PublishingRecord=>({...x,updatedAt:Date.now()});
