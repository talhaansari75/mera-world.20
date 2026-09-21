import { createFileRoute } from "@tanstack/react-router";
import { randomUUID } from "node:crypto";
import { getPrisma } from "@/lib/db";
import { requireUserId } from "@/lib/auth/verify.server";
import { botForCountry, botDisplayName } from "@/lib/multiplayer/bots";
const json=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json"}});
export const Route=createFileRoute("/api/multiplayer/match")({server:{handlers:{
POST:async({request})=>{try{
const userId=await requireUserId(); const b=await request.json().catch(()=>({})) as {countryCode?:string;maxPlayers?:number;mode?:string;worldId?:number;levelId?:number;durationSeconds?:number};
const db=getPrisma(),roomId=randomUUID(),matchId=randomUUID(),cc=String(b.countryCode||"PK").slice(0,2).toUpperCase();
const maxPlayers=Math.min(4,Math.max(2,Number(b.maxPlayers||2))),mode=["classic","blitz","timed"].includes(String(b.mode))?String(b.mode):"classic";
const duration=Math.min(600,Math.max(30,Number(b.durationSeconds||(mode==="blitz"?90:180)))),seed=Math.floor(Math.random()*2147483647),levelId=Math.min(2000,Math.max(1,Number(b.levelId||1)));
await db.$transaction(async(tx:any)=>{
await tx.$queryRaw`insert into multiplayer_rooms(room_id,host_user_id,mode,status,max_players,state_json) values(${roomId},${userId},${mode},'open',${maxPlayers},jsonb_build_object('matchId',${matchId},'phase','lobby'))`;
await tx.$queryRaw`insert into multiplayer_matches(match_id,room_id,status,mode,puzzle_seed,world_id,duration_seconds,level_id) values(${matchId},${roomId},'waiting',${mode},${seed},${Number(b.worldId||1)},${duration},${levelId})`;
await tx.$queryRaw`insert into multiplayer_members(room_id,user_id,display_name,role,country_code,is_bot,avatar_id,ready) values(${roomId},${userId},'Traveler','player',${cc},false,'traveler',false)`;
const bot=botForCountry(cc,seed);
for(let i=1;i<maxPlayers;i++){const botId="bot:"+randomUUID();await tx.$queryRaw`insert into multiplayer_members(room_id,user_id,display_name,role,country_code,is_bot,avatar_id,bot_profile_id,bot_skill,ready) values(${roomId},${botId},${botDisplayName(bot,i+seed)},'bot',${bot.countryCode},true,${bot.avatar},${bot.id+"-"+i},${bot.skill},true)`;}
});
return json({ok:true,roomId,matchId,mode,maxPlayers,phase:"lobby",botFill:true});
}catch(e){return json({error:e instanceof Error?e.message:"Matchmaking failed"},400);}}
}}});