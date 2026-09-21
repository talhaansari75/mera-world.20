import {createFileRoute} from "@tanstack/react-router";
import {getPrisma} from "@/lib/db";
import {requireUserId} from "@/lib/auth/verify.server";
import {multiplayerPuzzle,sameCells} from "@/lib/multiplayer/serverPuzzle";
import {settleMatch} from "@/lib/multiplayer/settle";
import {tickBots} from "@/lib/multiplayer/botEngine";
import {consumeRateLimit} from "@/lib/server/v3/rateLimit";
const json=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json"}});
const text=(v:unknown,max=240)=>typeof v==="string"?v.trim().slice(0,max):"";
export const Route=createFileRoute("/api/multiplayer/action")({server:{handlers:{POST:async({request})=>{try{
 const userId=await requireUserId(); const limited=await consumeRateLimit(userId,"multiplayer_action",120,60); if(!limited.allowed)return json({error:"rate_limited"},429); const b=await request.json().catch(()=>({})) as Record<string,unknown>,db=getPrisma();
 const roomId=text(b.roomId,80),action=text(b.action,30),matchId=text(b.matchId,80),payload=(b.payload&&typeof b.payload==="object"?b.payload:{}) as Record<string,unknown>;
 if(!roomId)return json({error:"roomId required"},400);
 const room=await db.$queryRaw`select room_id from multiplayer_rooms where room_id=${roomId} and exists(select 1 from multiplayer_members where room_id=${roomId} and user_id=${userId} and is_bot=false)`;
 if(!room.length)return json({error:"Room not found"},404);
 if(action==="heartbeat"){await tickBots((await db.$queryRaw`select match_id from multiplayer_matches where room_id=${roomId} limit 1`))[0]?.match_id);await db.$queryRaw`update multiplayer_members set last_seen_at=now(),disconnected_at=null where room_id=${roomId} and user_id=${userId} and is_bot=false`;return json({ok:true});}
 if(action==="chat"){const message=text(payload.message);if(!message)return json({error:"Empty message"},400);await db.$queryRaw`insert into multiplayer_chat(room_id,user_id,message) values(${roomId},${userId},${message})`;return json({ok:true});}
 if(action==="ready"){await db.$queryRaw`update multiplayer_members set ready=true,last_seen_at=now() where room_id=${roomId} and user_id=${userId} and is_bot=false`;const m=await db.$queryRaw`select match_id from multiplayer_matches where room_id=${roomId} and status='waiting' limit 1`;if(m.length){const p=await db.$queryRaw`select count(*)::int as n from multiplayer_members where room_id=${roomId} and ready=false`;if(Number(p[0].n)===0){await db.$queryRaw`update multiplayer_matches set status='live',started_at=coalesce(started_at,now()) where match_id=${m[0].match_id} and status='waiting'`;await db.$queryRaw`update multiplayer_rooms set status='playing',updated_at=now(),state_json=jsonb_set(coalesce(state_json,'{}'::jsonb),'{phase}','"live"'::jsonb) where room_id=${roomId}`;}}return json({ok:true});}
 if(action!=="word_found")return json({error:"Unsupported match action"},400);
 if(!clientActionId)return json({error:"clientActionId required"},400);
 if(!matchId)return json({error:"matchId required"},400);
 const match=await db.$queryRaw`select match_id,status,mode,level_id,puzzle_seed,started_at,duration_seconds from multiplayer_matches where match_id=${matchId} and room_id=${roomId} limit 1`;
 if(!match.length)return json({error:"Match not found"},404);
 if(match[0].status!=="live")return json({error:"Match is not live"},409);
 const started=new Date(match[0].started_at).getTime();if(!Number.isFinite(started))return json({error:"Match start time invalid"},500);
 if(Date.now()>started+Number(match[0].duration_seconds)*1000){await settleMatch(matchId);return json({error:"Match time expired",settled:true},409);}
 const word=text(payload.word,80).toUpperCase(),cells=payload.cells,puzzle=multiplayerPuzzle(Number(match[0].level_id),String(match[0].mode),Number(match[0].puzzle_seed));
 const placement=puzzle.placements.find(p=>p.word===word);if(!placement||!sameCells(cells,placement.cells))return json({error:"Invalid word selection"},400);
 const claimed=await db.$queryRaw`insert into multiplayer_found_words(match_id,user_id,word) values(${matchId},${userId},${word}) on conflict do nothing returning word`;
 if(!claimed.length)return json({error:"Word already found"},409);
 const countRows=await db.$queryRaw`select count(*)::int as n from multiplayer_found_words where match_id=${matchId} and user_id=${userId}`;
 const count=Number(countRows[0]?.n||0),score=count*100+Math.max(0,word.length-3)*20,progress=Math.min(100,Math.floor(count/puzzle.words.length*100));
 await db.$queryRaw`update multiplayer_members set found_words=(select coalesce(jsonb_agg(word order by word),'[]'::jsonb) from multiplayer_found_words where match_id=${matchId} and user_id=${userId}),progress=${progress},score=${score},combo=${count},last_seen_at=now() where room_id=${roomId} and user_id=${userId} and is_bot=false`;
 await db.$transaction(async(tx:any)=>{
  await tx.$queryRaw`insert into multiplayer_match_event_counters(match_id,next_seq) values(${matchId},1) on conflict(match_id) do nothing`;
  const c=await tx.$queryRaw`update multiplayer_match_event_counters set next_seq=next_seq+1 where match_id=${matchId} returning next_seq-1 as seq`;
  const seq=Number(c[0].seq);
  await tx.$queryRaw`insert into multiplayer_match_events(match_id,seq,user_id,event_type,payload) values(${matchId},${seq},${userId},'word_found',${JSON.stringify({word})}::jsonb)`;
  await tx.$queryRaw`update multiplayer_matches set event_version=event_version+1 where match_id=${matchId}`;
 });
 if(count>=puzzle.words.length){await settleMatch(matchId);await db.$queryRaw`update multiplayer_rooms set status='finished',updated_at=now(),state_json=jsonb_set(coalesce(state_json,'{}'::jsonb),'{phase}','"finished"'::jsonb) where room_id=${roomId}`;}
 return json({ok:true,found:count,total:puzzle.words.length,score});
}catch(e){return json({error:e instanceof Error?e.message:"Multiplayer action failed"},400);}}}}});