export type ModesModel={loading:boolean;error?:string;updatedAt:number};
export const emptyModes=():ModesModel=>({loading:false,updatedAt:Date.now()});
