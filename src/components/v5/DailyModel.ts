export type DailyModel={loading:boolean;error?:string;updatedAt:number};
export const emptyDaily=():DailyModel=>({loading:false,updatedAt:Date.now()});
