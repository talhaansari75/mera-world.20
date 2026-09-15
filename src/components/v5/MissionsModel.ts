export type MissionsModel={loading:boolean;error?:string;updatedAt:number};
export const emptyMissions=():MissionsModel=>({loading:false,updatedAt:Date.now()});
