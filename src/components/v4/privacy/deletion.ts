export type DeletionRequest={userId:string,requestedAt:number,reason?:string};
export const deletion=(userId:string,reason?:string):DeletionRequest=>({userId,requestedAt:Date.now(),reason});
