import {createFileRoute} from "@tanstack/react-router";
import {getPrisma} from "@/lib/db";
import {requireUserId} from "@/lib/auth/verify.server";
const json=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json"}});
const allowed=new Set(["word_found","combo","progress","finish"]);
export const Route=createFileRoute("/api/multiplayer/action")({server:{handlers:{POST:async({request})=>{try{
const userId=await requireUserId();const b=await request.json() as {action:string;roomId:string;matchId?:string;payload?:Record<string,unknown>};const db=getPrisma();
const room=await db.$queryRaw`select room_id from multiplayer_rooms where room_id=${b.roomId} and exists(select 1 from multiplayer_members where room_id=${b.roomId} and user_id=${userId} and is_bot=false)`;
if(!room.length)return json({error:"Room not found"},404);
if(b.action==="heartbeat"){await db.$queryRaw`update multiplayer_members set last_seen_at=now(),disconnected_at=null where room_id=${b.roomId} and user_id=${userId}`;return json({ok:true});}
if(b.action==="chat"){const message=String(b.payload?.message||"").trim().slice(0,240);if(!message)return json({error:"Empty message"},400);await db.$queryRaw`insert into multiplayer_chat(room_id,user_id,message) values(${b.roomId},${userId},${message})`;return json({ok:true});}
if(b.action==="ready"){await db.$queryRaw`update multiplayer_members set ready=true,last_seen_at=now() where room_id=${b.roomId} and user_id=${userId}`;const m=await db.$queryRaw`select match_id from multiplayer_matches where room_id=${b.roomId} and status='waiting' limit 1`;if(m.length){const p=await db.$queryRaw`select count(*)::int as n from multiplayer_members where room_id=${b.roomId} and ready=false`;if(Number(p[0].n)===0){await db.$queryRaw`update multiplayer_matches set status='live',started_at=coalesce(started_at,now()) where match_id=${m[0].match_id} and status='waiting'`;await db.$queryRaw`update multiplayer_rooms set status='playing',updated_at=now(),state_json=jsonb_set(state_json,'{phase}','"live"'::jsonb) where room_id=${b.roomId}`;}}return json({ok:true});}
if(!b.matchId||!allowed.has(b.action))return json({error:"Unsupported match action"},400);
const match=await db.$queryRaw`select match_id,status from multiplayer_matches where match_id=${b.matchId} and room_id=${b.roomId}`;
if(!match.length)return json({error:"Match not found"},404);if(match[0].status!=="live")return json({error:"Match is not live"},409);
const payload=b.payload||{};
if(b.action==="progress"){const progress=Math.min(100,Math.max(0,Number(payload.progress||0))),score=Math.min(100000,Math.max(0,Number(payload.score||0))),combo=Math.min(100,Math.max(0,Number(payload.combo||0)));await db.$queryRaw`update multiplayer_members set progress=${progress},score=${score},combo=${combo},last_seen_at=now() where room_id=${b.roomId} and user_id=${userId} and is_bot=false`;}
if(b.action==="finish"){await db.$queryRaw`update multiplayer_matches set status='finished',finished_at=now(),winner_user_id=${userId} where match_id=${b.matchId} and status='live'`;await db.$queryRaw`update multiplayer_rooms set status='finished',updated_at=now(),state_json=jsonb_set(state_json,'{phase}','"finished"'::jsonb) where room_id=${b.roomId}`;}
const n=await db.$queryRaw`select coalesce(max(seq),0)+1 as seq from multiplayer_match_events where match_id=${b.matchId}`;await db.$queryRaw`insert into multiplayer_match_events(match_id,seq,user_id,event_type,payload) values(${b.matchId},${Number(n[0].seq)},${userId},${b.action},${JSON.stringify(payload)}::jsonb)`;
return json({ok:true});
}catch(e){return json({error:e instanceof Error?e.message:"Multiplayer action failed"},400);}}}}});