export type AdminModel={loading:boolean;error?:string;updatedAt:number};
export const emptyAdmin=():AdminModel=>({loading:false,updatedAt:Date.now()});
