export type LanguageModel={loading:boolean;error?:string;updatedAt:number};
export const emptyLanguage=():LanguageModel=>({loading:false,updatedAt:Date.now()});
