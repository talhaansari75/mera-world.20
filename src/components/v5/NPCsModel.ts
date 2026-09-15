export type NPCsModel={loading:boolean;error?:string;updatedAt:number};
export const emptyNPCs=():NPCsModel=>({loading:false,updatedAt:Date.now()});
