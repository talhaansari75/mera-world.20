import {createFileRoute} from "@tanstack/react-router";
import {randomUUID} from "node:crypto";
import {getPrisma} from "@/lib/db";
import {requireUserId} from "@/lib/auth/verify.server";
const json=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json"}});
export const Route=createFileRoute("/api/multiplayer/action")({server:{handlers:{
POST:async({request})=>{try{
 const userId=await requireUserId(); const b=await request.json() as {action:string;roomId:string;matchId?:string;payload?:Record<string,unknown>};
 const db=getPrisma(); const room=await db.$queryRaw`select room_id,status,max_players from multiplayer_rooms where room_id=${b.roomId} and exists(select 1 from multiplayer_members where room_id=${b.roomId} and user_id=${userId}) limit 1`;
 if(!room.length)return json({error:"Room not found"},404);
 if(b.action==="chat"){const message=String(b.payload?.message||"").trim().slice(0,240);if(!message)return json({error:"Empty message"},400);await db.$queryRaw`insert into multiplayer_chat(room_id,user_id,message) values(${b.roomId},${userId},${message})`;return json({ok:true});}
 if(b.action==="heartbeat"){await db.$queryRaw`update multiplayer_members set last_seen_at=now() where room_id=${b.roomId} and user_id=${userId}`;return json({ok:true});}
 if(b.action==="ready"){await db.$queryRaw`update multiplayer_members set ready=true,last_seen_at=now() where room_id=${b.roomId} and user_id=${userId}`;return json({ok:true});}
 if(!b.matchId)return json({error:"matchId required"},400);
 const match=await db.$queryRaw`select match_id,status from multiplayer_matches where match_id=${b.matchId} and room_id=${b.roomId} limit 1`;
 if(!match.length)return json({error:"Match not found"},404);
 const n=await db.$queryRaw`select coalesce(max(seq),0)+1 as seq from multiplayer_match_events where match_id=${b.matchId}`;
 await db.$queryRaw`insert into multiplayer_match_events(match_id,seq,user_id,event_type,payload) values(${b.matchId},${Number(n[0].seq)},${userId},${b.action},${JSON.stringify(b.payload||{})}::jsonb)`;
 return json({ok:true,seq:Number(n[0].seq)});
}catch(e){return json({error:e instanceof Error?e.message:"Multiplayer action failed"},400)}}}}});