export type DeletionRequest={userId:string;requestedAt:number;status:"requested"|"processing"|"completed"};
export const requestDeletion=(userId:string):DeletionRequest=>({userId,requestedAt:Date.now(),status:"requested"});
