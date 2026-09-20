export type CloudSyncModel={loading:boolean;error?:string;updatedAt:number};
export const emptyCloudSync=():CloudSyncModel=>({loading:false,updatedAt:Date.now()});
