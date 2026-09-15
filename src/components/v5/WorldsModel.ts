export type WorldsModel={loading:boolean;error?:string;updatedAt:number};
export const emptyWorlds=():WorldsModel=>({loading:false,updatedAt:Date.now()});
