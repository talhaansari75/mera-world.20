export type BaseModel={loading:boolean;error?:string;updatedAt:number};
export const emptyBase=():BaseModel=>({loading:false,updatedAt:Date.now()});
