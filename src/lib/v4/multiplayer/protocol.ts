export type ClientMessage={type:'join'|'leave'|'ready'|'move'|'chat';roomId:string;payload?:unknown};
export type ServerMessage={type:'joined'|'state'|'error'|'playerLeft';roomId:string;payload?:unknown};
