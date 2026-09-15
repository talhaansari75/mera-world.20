export type ClientEvent={type:"join"|"leave"|"ready"|"submit"|"ping";seq:number;payload?:unknown};
export type ServerEvent={type:"joined"|"left"|"state"|"error"|"pong";seq:number;payload?:unknown};
export const validSeq=(last:number,next:number)=>Number.isInteger(next)&&next>last&&next-last<=100;
