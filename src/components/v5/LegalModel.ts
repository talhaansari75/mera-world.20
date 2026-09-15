export type LegalModel={loading:boolean;error?:string;updatedAt:number};
export const emptyLegal=():LegalModel=>({loading:false,updatedAt:Date.now()});
