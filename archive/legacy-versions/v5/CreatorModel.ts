export type CreatorModel={loading:boolean;error?:string;updatedAt:number};
export const emptyCreator=():CreatorModel=>({loading:false,updatedAt:Date.now()});
