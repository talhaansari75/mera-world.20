export type DialogueModel={loading:boolean;error?:string;updatedAt:number};
export const emptyDialogue=():DialogueModel=>({loading:false,updatedAt:Date.now()});
