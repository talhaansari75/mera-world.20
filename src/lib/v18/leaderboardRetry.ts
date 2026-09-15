import { submitDaily, submitScore } from "@/lib/server/leaderboard";
type Item={id:string;kind:"score"|"daily";payload:any;attempts:number};const KEY="mwsj.v18.leaderboard.outbox";
const read=():Item[]=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return[]}};const write=(q:Item[])=>localStorage.setItem(KEY,JSON.stringify(q.slice(-50)));
export function queueLeaderboard(kind:Item["kind"],payload:any){const q=read();q.push({id:crypto.randomUUID(),kind,payload,attempts:0});write(q)}
export function pendingLeaderboardCount(){return read().length}
export async function flushLeaderboard(){if(!navigator.onLine)return{flushed:0,remaining:read().length};const remain:Item[]=[];let flushed=0;for(const item of read()){try{if(item.kind==="score")await submitScore({data:item.payload});else await submitDaily({data:item.payload});flushed++}catch{item.attempts++;remain.push(item)}}write(remain);return{flushed,remaining:remain.length}}
