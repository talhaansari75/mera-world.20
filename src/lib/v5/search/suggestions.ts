export type SuggestionsRecord={id:string;createdAt:number;updatedAt:number;metadata:Record<string,unknown>};
export const createSuggestions=(id:string):SuggestionsRecord=>({id,createdAt:Date.now(),updatedAt:Date.now(),metadata:{}});
export const touchSuggestions=(x:SuggestionsRecord):SuggestionsRecord=>({...x,updatedAt:Date.now()});
