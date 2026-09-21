import { createFileRoute } from "@tanstack/react-router";
import { randomUUID } from "node:crypto";
import { getPrisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/verify.server";
import { consumeRateLimit } from "@/lib/server/v3/rateLimit";
const json=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json"}});
const MAX_BYTES=256*1024;
const clean=(v:unknown,max:number)=>typeof v==="string"?v.trim().slice(0,max):"";
export const Route=createFileRoute("/api/multiplayer/voice")({server:{handlers:{
 POST:async({request})=>{try{
  const userId=await requireUserId(); const limited=await consumeRateLimit(userId,"multiplayer_voice",12,60); if(!limited.allowed)return json({error:"rate_limited"},429);
  const b=await request.json().catch(()=>({})) as Record<string,unknown>; const roomId=clean(b.roomId,80),mime=clean(b.mimeType,80)||"audio/webm;codecs=opus",duration=Math.max(250,Math.min(20000,Math.floor(Number(b.durationMs)||0))),data=clean(b.data,MAX_BYTES*2);
  if(!roomId||!data)return json({error:"roomId and audio required"},400); if(!duration)return json({error:"duration required"},400);
  const raw=data.replace(/^data:[^;]+;base64,/,""); let audio:Buffer; try{audio=Buffer.from(raw,"base64")}catch{return json({error:"invalid_audio"},400)}
  if(!audio.length||audio.length>MAX_BYTES)return json({error:"voice_too_large"},413);
  const db=getPrisma(); const member=await db.$queryRaw`select 1 from multiplayer_members where room_id=${roomId} and user_id=${userId} and is_bot=false limit 1`; if(!member.length)return json({error:"not_room_member"},403);
  const id=randomUUID(); await db.$queryRaw`insert into multiplayer_voice_messages(id,room_id,user_id,mime_type,audio,duration_ms) values(${id},${roomId},${userId},${mime},${audio},${duration})`;
  return json({ok:true,id});
 }catch(e){return json({error:e instanceof Error?e.message:"voice_upload_failed"},400);}},
 GET:async({request})=>{try{
  const userId=await requireUserId(),url=new URL(request.url),roomId=clean(url.searchParams.get("roomId"),80); if(!roomId)return json({error:"roomId required"},400); const db=getPrisma();
  const member=await db.$queryRaw`select 1 from multiplayer_members where room_id=${roomId} and user_id=${userId} and is_bot=false limit 1`; if(!member.length)return json({error:"not_room_member"},403);
  await db.$queryRaw`delete from multiplayer_voice_messages where expires_at<now()`;
  const rows=await db.$queryRaw`select id,user_id as "userId",mime_type as "mimeType",encode(audio,'base64') as data,duration_ms as "durationMs",created_at as "createdAt" from multiplayer_voice_messages where room_id=${roomId} order by created_at desc limit 20`;
  return json({ok:true,messages:rows.reverse()});
 }catch(e){return json({error:e instanceof Error?e.message:"voice_fetch_failed"},400);}}
}}});