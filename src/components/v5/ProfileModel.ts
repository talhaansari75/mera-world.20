export type ProfileModel={loading:boolean;error?:string;updatedAt:number};
export const emptyProfile=():ProfileModel=>({loading:false,updatedAt:Date.now()});
