export type StatisticsModel={loading:boolean;error?:string;updatedAt:number};
export const emptyStatistics=():StatisticsModel=>({loading:false,updatedAt:Date.now()});
