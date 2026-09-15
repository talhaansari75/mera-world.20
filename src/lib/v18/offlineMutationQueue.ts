import { queueSave, pendingSyncCount, syncCloud } from "@/lib/game/cloudSyncV18";
type Mutation={id:string;kind:"save"|"leaderboard";payload:unknown;createdAt:number;attempts:number};
const KEY="mwsj.v18.mutations";
const read=():Mutation[]=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return[]}};
const write=(q:Mutation[])=>localStorage.setItem(KEY,JSON.stringify(q.slice(-100)));
export function enqueueMutation(kind:Mutation["kind"],payload:unknown){const q=read();if(kind==="save"){const i=q.findIndex(x=>x.kind==="save");const item={id:i>=0?q[i].id:crypto.randomUUID(),kind,payload,createdAt:Date.now(),attempts:i>=0?q[i].attempts:0} as Mutation;if(i>=0)q[i]=item;else q.push(item)}else q.push({id:crypto.randomUUID(),kind,payload,createdAt:Date.now(),attempts:0});write(q);return q.length}
export function pendingMutationCount(){return read().length+pendingSyncCount()}
export function clearMutations(){write([])}
export async function flushMutations(){if(!navigator.onLine)return{ok:false as const,flushed:0,remaining:read().length,reason:"offline"};const q=read();let flushed=0;const remain:Mutation[]=[];for(const item of q){try{if(item.kind==="save")queueSave(item.payload);else remain.push(item);flushed++}catch{item.attempts++;remain.push(item)}}write(remain);const cloud=await syncCloud().catch(()=>({status:"error" as const}));return{ok:true as const,flushed,remaining:remain.length,cloud}}
export function installOfflineMutationBridge(){const onOnline=()=>void flushMutations();window.addEventListener("online",onOnline);return()=>window.removeEventListener("online",onOnline)}
