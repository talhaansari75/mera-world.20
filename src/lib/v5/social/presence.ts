export type PresenceRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createPresence=(id:string):PresenceRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchPresence=(x:PresenceRecord):PresenceRecord=>({...x,updatedAt:Date.now()});
