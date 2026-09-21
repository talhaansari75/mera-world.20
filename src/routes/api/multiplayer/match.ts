import {createFileRoute} from "@tanstack/react-router";
import {randomUUID} from "node:crypto";
import {getPrisma} from "@/lib/db";
import {requireUserId} from "@/lib/auth/verify.server";
import {botForCountry,botDisplayName} from "@/lib/multiplayer/bots";
const json=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json"}});
export const Route=createFileRoute("/api/multiplayer/match")({server:{handlers:{POST:async({request})=>{
try{
 const userId=await requireUserId(); const b=await request.json().catch(()=>({})) as {countryCode?:string;maxPlayers?:number;mode?:string};
 const db=getPrisma(); const roomId=randomUUID(); const cc=String(b.countryCode||"PK").slice(0,2).toUpperCase(); const max=Math.min(4,Math.max(2,Number(b.maxPlayers||2))); const mode=String(b.mode||"classic");
 await db.$queryRaw`insert into multiplayer_rooms(room_id,host_user_id,mode,status,max_players,state_json) values(${roomId},${userId},${mode},'open',${max},jsonb_build_object('createdBy','matchmaker'))`;
 await db.$queryRaw`insert into multiplayer_members(room_id,user_id,display_name,role,country_code,is_bot,avatar_id,ready) values(${roomId},${userId},'Traveler','player',${cc},false,'traveler',true)`;
 const bot=botForCountry(cc,roomId.length);
 for(let i=1;i<max;i++){const name=botDisplayName(bot,i+roomId.length);const botId="bot:"+randomUUID();const profile=bot.id+"-"+i;await db.$queryRaw`insert into multiplayer_members(room_id,user_id,display_name,role,country_code,is_bot,avatar_id,bot_profile_id,ready) values(${roomId},${botId},${name},'bot',${bot.countryCode},true,${bot.avatar},${profile},true)`;}
 return json({ok:true,roomId,mode,maxPlayers:max,botFill:true,disclosure:"NPC opponents are bots.",country:bot.country});
}catch(e){return json({error:e instanceof Error?e.message:"Matchmaking failed"},400)}
}}}});