export type RulesRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createRules=(id:string):RulesRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchRules=(x:RulesRecord):RulesRecord=>({...x,updatedAt:Date.now()});
