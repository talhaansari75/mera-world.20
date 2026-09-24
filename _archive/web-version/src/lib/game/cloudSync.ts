export type CloudSaveEnvelope={version:1;userId:string;savedAt:number;payload:unknown};
const KEY="mwsj.cloud.save.v1";
export async function cloudSave(userId:string,payload:unknown):Promise<boolean>{
 try{localStorage.setItem(`${KEY}.${userId}`,JSON.stringify({version:1,userId,savedAt:Date.now(),payload}));return true}catch{return false}
}
export async function cloudLoad(userId:string):Promise<CloudSaveEnvelope|null>{
 try{return JSON.parse(localStorage.getItem(`${KEY}.${userId}`)||"null") as CloudSaveEnvelope|null}catch{return null}
}
export function cloudKey(userId:string){return `${KEY}.${userId}`;}
