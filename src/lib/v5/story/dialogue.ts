export type DialogueRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createDialogue=(id:string):DialogueRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchDialogue=(x:DialogueRecord):DialogueRecord=>({...x,updatedAt:Date.now()});
