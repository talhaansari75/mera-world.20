export type PlayerState={id:string,ready:boolean,score:number,connected:boolean};
export type RoomState={id:string,hostId:string,maxPlayers:number,players:Record<string,PlayerState>,started:boolean};
export function canStart(room:RoomState){const players=Object.values(room.players);return players.length>=2&&players.every(p=>p.ready)}
