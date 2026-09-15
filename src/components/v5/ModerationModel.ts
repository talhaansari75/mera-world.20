export type ModerationModel={loading:boolean;error?:string;updatedAt:number};
export const emptyModeration=():ModerationModel=>({loading:false,updatedAt:Date.now()});
