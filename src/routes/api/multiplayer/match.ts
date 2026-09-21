import { createFileRoute } from "@tanstack/react-router";
import { randomUUID } from "node:crypto";
import { getPrisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/verify.server";
import { botForCountry, botDisplayName } from "@/lib/multiplayer/bots";
import { consumeRateLimit } from "@/lib/server/v3/rateLimit";
const json=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json"}});
const int=(v:unknown,min:number,max:number,def:number)=>{const n=typeof v==="number"?v:Number(v);return Number.isInteger(n)&&n>=min&&n<=max?n:def};
export const Route=createFileRoute("/api/multiplayer/match")({server:{handlers:{POST:async({request})=>{try{
 const userId=await requireUserId(); const limited=await consumeRateLimit(userId,"multiplayer_match_create",10,60); if(!limited.allowed)return json({error:"rate_limited"},429); const b=await request.json().catch(()=>({})) as Record<string,unknown>;
 const cc=String(b.countryCode||"PK").trim().slice(0,2).toUpperCase()||"PK";
 const maxPlayers=int(b.maxPlayers,2,4,2),worldId=int(b.worldId,1,6,1),levelId=int(b.levelId,1,2000,1);
 const mode=["classic","blitz","timed"].includes(String(b.mode))?String(b.mode):"classic";
 const defaultDuration=mode==="blitz"?90:180,duration=int(b.durationSeconds,30,600,defaultDuration);
 const db=getPrisma(),roomId=randomUUID(),matchId=randomUUID(),seed=Math.floor(Math.random()*0x7fffffff);
 await db.$transaction(async(tx:any)=>{
  await tx.$queryRaw`insert into multiplayer_rooms(room_id,host_user_id,mode,status,max_players,state_json) values(${roomId},${userId},${mode},'open',${maxPlayers},jsonb_build_object('matchId',${matchId},'phase','lobby'))`;
  await tx.$queryRaw`insert into multiplayer_matches(match_id,room_id,status,mode,puzzle_seed,world_id,duration_seconds,level_id) values(${matchId},${roomId},'waiting',${mode},${seed},${worldId},${duration},${levelId})`;
  await tx.$queryRaw`insert into multiplayer_members(room_id,user_id,human_user_id,display_name,role,country_code,is_bot,avatar_id,ready,last_seen_at) values(${roomId},${userId},${userId},'Traveler','player',${cc},false,'traveler',false,now())`;
  const bot=botForCountry(cc,seed);
  for(let i=1;i<maxPlayers;i++){const botId="bot:"+randomUUID();await tx.$queryRaw`insert into multiplayer_members(room_id,user_id,display_name,role,country_code,is_bot,avatar_id,bot_profile_id,bot_skill,ready,last_seen_at) values(${roomId},${botId},${botDisplayName(bot,i+seed)},'bot',${bot.countryCode},true,${bot.avatar},${bot.id+"-"+i},${bot.skill},true,now())`;}
 });
 return json({ok:true,roomId,matchId,mode,maxPlayers,phase:"lobby",botFill:true});
}catch(e){return json({error:e instanceof Error?e.message:"Matchmaking failed"},400);}}}}});