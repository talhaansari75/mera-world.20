export type QuestsModel={loading:boolean;error?:string;updatedAt:number};
export const emptyQuests=():QuestsModel=>({loading:false,updatedAt:Date.now()});
