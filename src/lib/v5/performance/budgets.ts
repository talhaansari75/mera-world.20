export type BudgetsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createBudgets=(id:string):BudgetsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchBudgets=(x:BudgetsRecord):BudgetsRecord=>({...x,updatedAt:Date.now()});
