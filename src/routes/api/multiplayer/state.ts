import {createFileRoute} from "@tanstack/react-router";
import {getPrisma} from "@/lib/db";
import {requireUserId} from "@/lib/auth/verify.server";
const json=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json"}});
export const Route=createFileRoute("/api/multiplayer/state")({server:{handlers:{GET:async({request})=>{try{
 const userId=await requireUserId();const url=new URL(request.url);const roomId=url.searchParams.get("roomId");if(!roomId)return json({error:"roomId required"},400);const db=getPrisma();
 const members=await db.$queryRaw`select display_name as "displayName",country_code as "countryCode",is_bot as "isBot",avatar_id as "avatarId",score,ready,last_seen_at as "lastSeenAt" from multiplayer_members where room_id=${roomId} order by score desc`;
 const messages=await db.$queryRaw`select user_id as "userId",message,created_at as "createdAt" from multiplayer_chat where room_id=${roomId} order by created_at desc limit 50`;
 const room=await db.$queryRaw`select room_id as "roomId",mode,status,max_players as "maxPlayers",updated_at as "updatedAt" from multiplayer_rooms where room_id=${roomId} and exists(select 1 from multiplayer_members where room_id=${roomId} and user_id=${userId})`;
 if(!room.length)return json({error:"Room not found"},404);return json({room:room[0],members,messages:messages.reverse()});
}catch(e){return json({error:e instanceof Error?e.message:"State failed"},400)}}}}});