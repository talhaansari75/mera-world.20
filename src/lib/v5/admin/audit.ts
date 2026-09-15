export type AuditEntry={actorId:string;action:string;target?:string;at:number;metadata:Record<string,unknown>};
export const audit=(actorId:string,action:string,target?:string):AuditEntry=>({actorId,action,target,at:Date.now(),metadata:{}});
