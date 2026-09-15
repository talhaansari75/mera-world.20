export type PlayerState={userId:string;score:number;found:number;connected:boolean};
export type RoomState={roomId:string;version:number;players:PlayerState[]};
export function applyScore(s:RoomState,userId:string,delta:number):RoomState{if(!Number.isSafeInteger(delta)||delta<0||delta>100000)throw new Error("INVALID_SCORE");return {...s,version:s.version+1,players:s.players.map(p=>p.userId===userId?{...p,score:p.score+delta,found:p.found+1}:p)};}
