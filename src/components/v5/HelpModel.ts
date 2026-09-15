export type HelpModel={loading:boolean;error?:string;updatedAt:number};
export const emptyHelp=():HelpModel=>({loading:false,updatedAt:Date.now()});
