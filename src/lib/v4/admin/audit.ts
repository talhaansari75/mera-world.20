export type AuditEntry={actorId:string,action:string,targetId?:string,ts:number,metadata:Record<string,unknown>};
export const audit=(actorId:string,action:string,targetId?:string,metadata:Record<string,unknown>={}):AuditEntry=>({actorId,action,targetId,ts:Date.now(),metadata});
