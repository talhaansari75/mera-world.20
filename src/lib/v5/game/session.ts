export type SessionStatus="created"|"active"|"paused"|"completed"|"failed"|"abandoned";
export type GameSession={id:string;userId:string;levelId:number;seed:string;startedAt:number;status:SessionStatus;score:number;found:string[]};
export const createSession=(input:Pick<GameSession,"id"|"userId"|"levelId"|"seed">):GameSession=>({...input,startedAt:Date.now(),status:"created",score:0,found:[]});
export const transition=(s:GameSession,next:SessionStatus):GameSession=>({...s,status:next});
