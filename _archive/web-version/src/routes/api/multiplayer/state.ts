import {createFileRoute} from "@tanstack/react-router";
import {getPrisma} from "@/lib/db";
import {requireUserId} from "@/lib/auth/verify.server";
import {tickBots} from "@/lib/multiplayer/botEngine";
const json=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json"}});
export const Route=createFileRoute("/api/multiplayer/state")({server:{handlers:{GET:async({request})=>{try{
 const userId=await requireUserId(),url=new URL(request.url),roomId=url.searchParams.get("roomId"),since=Math.max(0,Number(url.searchParams.get("since")||0));if(!roomId)return json({error:"roomId required"},400);const db=getPrisma();
 const room=await db.$queryRaw`select r.room_id as "roomId",r.mode,r.status,r.max_players as "maxPlayers",r.state_json as "state",m.match_id as "matchId",m.status as "matchStatus",m.puzzle_seed as "puzzleSeed",m.world_id as "worldId",m.duration_seconds as "durationSeconds",m.started_at as "startedAt",m.finished_at as "finishedAt",m.winner_user_id as "winnerUserId",m.event_version as "eventVersion" from multiplayer_rooms r join multiplayer_matches m on m.room_id=r.room_id where r.room_id=${roomId} and exists(select 1 from multiplayer_members where room_id=${roomId} and user_id=${userId} and is_bot=false) limit 1`;
 if(!room.length)return json({error:"Room not found"},404);
 const matchId=room[0].matchId;
 const members=await db.$queryRaw`select display_name as "displayName",country_code as "countryCode",is_bot as "isBot",avatar_id as "avatarId",score,progress,combo,ready,last_seen_at as "lastSeenAt",bot_skill as "botSkill",found_words as "foundWords" from multiplayer_members where room_id=${roomId} order by score desc,user_id asc`;
 const messages=await db.$queryRaw`select user_id as "userId",message,created_at as "createdAt" from multiplayer_chat where room_id=${roomId} order by created_at desc limit 50`;
 const events=await db.$queryRaw`select seq,user_id as "userId",event_type as "eventType",payload,created_at as "createdAt" from multiplayer_match_events where match_id=${matchId} and seq>${Number.isInteger(since)?since:0} order by seq asc limit 100`;
 return json({room:room[0],members,messages:messages.reverse(),events,nextSince:events.length?Number(events[events.length-1].seq):since});
}catch(e){return json({error:e instanceof Error?e.message:"State failed"},400);}}}}});