export type AbilitiesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createAbilities=(id:string):AbilitiesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchAbilities=(x:AbilitiesRecord):AbilitiesRecord=>({...x,updatedAt:Date.now()});
