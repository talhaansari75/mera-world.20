import { apiLoadSave, apiSave, getToken } from "./onlineApi.ts";

export type SyncStatus="offline"|"idle"|"syncing"|"synced"|"conflict"|"error";
export type CloudEnvelope={version:number;payload:any;updatedAt:number|null};
export type SyncMeta={revision:number;deviceId:string;updatedAt:number};
export type SyncResult={status:SyncStatus;local?:CloudEnvelope;remote?:CloudEnvelope;message?:string};

const META_KEY="mwsj.cloud.meta";
const OUTBOX_KEY="mwsj.cloud.outbox";
const deviceId=()=>{
  const k="mwsj.device.id"; let id=localStorage.getItem(k);
  if(!id){id=crypto.randomUUID();localStorage.setItem(k,id)} return id;
};
export function readSyncMeta():SyncMeta{
  try{return JSON.parse(localStorage.getItem(META_KEY)||"")||{revision:0,deviceId:deviceId(),updatedAt:0}}
  catch{return {revision:0,deviceId:deviceId(),updatedAt:0}}
}
function writeMeta(m:SyncMeta){localStorage.setItem(META_KEY,JSON.stringify(m))}
function queue(){try{return JSON.parse(localStorage.getItem(OUTBOX_KEY)||"[]")}catch{return []}}
function writeQueue(q:any[]){localStorage.setItem(OUTBOX_KEY,JSON.stringify(q.slice(-10)))}

export function queueSave(payload:any,version=1){
  const m=readSyncMeta(), now=Date.now();
  const item={payload,version,deviceId:m.deviceId,clientUpdatedAt:now,revision:m.revision+1};
  writeMeta({revision:item.revision,deviceId:m.deviceId,updatedAt:now});
  const q=queue(); q.push(item); writeQueue(q); return item;
}

export async function syncCloud():Promise<SyncResult>{
  if(!getToken()) return {status:"offline",message:"Login required for cloud sync."};
  const q=queue();
  try{
    const remote=await apiLoadSave() as CloudEnvelope;
    if(!q.length) return {status:"synced",remote};
    const item=q[q.length-1];
    const remoteTime=remote.updatedAt||0;
    if(remoteTime>item.clientUpdatedAt){
      return {status:"conflict",remote,message:"Remote save is newer. Local queued save was kept for review."};
    }
    await apiSave(item.payload,item.version);
    writeQueue([]);
    return {status:"synced",remote:{version:item.version,payload:item.payload,updatedAt:Date.now()}};
  }catch(e:any){
    return {status:"error",message:e?.message||"Cloud sync failed."};
  }
}
export function clearOutbox(){writeQueue([])}
export function pendingSyncCount(){return queue().length}
