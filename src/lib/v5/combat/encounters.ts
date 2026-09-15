export type EncountersRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createEncounters=(id:string):EncountersRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchEncounters=(x:EncountersRecord):EncountersRecord=>({...x,updatedAt:Date.now()});
