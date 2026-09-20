export type Presence={userId:string,status:'online'|'idle'|'offline';lastSeen:number};
export function isOnline(p:Presence,now=Date.now(),ttl=60000){return p.status!=='offline'&&now-p.lastSeen<=ttl}
