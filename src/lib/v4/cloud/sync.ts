export type SyncOp={id:string,entity:string,version:number,payload:unknown,ts:number};
export function newer(a:SyncOp,b:SyncOp){return a.version>b.version||(a.version===b.version&&a.ts>b.ts)}
