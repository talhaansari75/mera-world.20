import {createFileRoute} from "@tanstack/react-router";
import {getPrisma} from "@/lib/db";
import {requireUserId} from "@/lib/auth/verify.server";
import {multiplayerPuzzle,sameCells} from "@/lib/multiplayer/serverPuzzle";
const json=(d:unknown,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{"content-type":"application/json"}});
const allowed=new Set(["word_found","finish"]);
export const Route=createFileRoute("/api/multiplayer/action")({server:{handlers:{POST:async({request})=>{try{
const userId=await requireUserId();const b=await request.json() as {action:string;roomId:string;matchId?:string;payload?:Record<string,unknown>};const db=getPrisma();
const room=await db.$queryRaw`select room_id from multiplayer_rooms where room_id=${b.roomId} and exists(select 1 from multiplayer_members where room_id=${b.roomId} and user_id=${userId} and is_bot=false)`;
if(!room.length)return json({error:"Room not found"},404);
if(b.action==="heartbeat"){await db.$queryRaw`update multiplayer_members set last_seen_at=now(),disconnected_at=null where room_id=${b.roomId} and user_id=${userId}`;return json({ok:true});}
if(b.action==="chat"){const message=String(b.payload?.message||"").trim().slice(0,240);if(!message)return json({error:"Empty message"},400);await db.$queryRaw`insert into multiplayer_chat(room_id,user_id,message) values(${b.roomId},${userId},${message})`;return json({ok:true});}
if(b.action==="ready"){await db.$queryRaw`update multiplayer_members set ready=true,last_seen_at=now() where room_id=${b.roomId} and user_id=${userId}`;const m=await db.$queryRaw`select match_id from multiplayer_matches where room_id=${b.roomId} and status='waiting' limit 1`;if(m.length){const p=await db.$queryRaw`select count(*)::int as n from multiplayer_members where room_id=${b.roomId} and ready=false`;if(Number(p[0].n)===0){await db.$queryRaw`update multiplayer_matches set status='live',started_at=coalesce(started_at,now()) where match_id=${m[0].match_id} and status='waiting'`;await db.$queryRaw`update multiplayer_rooms set status='playing',updated_at=now(),state_json=jsonb_set(state_json,'{phase}','"live"'::jsonb) where room_id=${b.roomId}`;}}return json({ok:true});}
if(!b.matchId||!allowed.has(b.action))return json({error:"Unsupported match action"},400);
const match=await db.$queryRaw`select match_id,status,mode,level_id,started_at,duration_seconds from multiplayer_matches where match_id=${b.matchId} and room_id=${b.roomId} limit 1`;
if(!match.length)return json({error:"Match not found"},404);if(match[0].status!=="live")return json({error:"Match is not live"},409);
const started=new Date(match[0].started_at).getTime();if(Date.now()>started+Number(match[0].duration_seconds)*1000)return json({error:"Match time expired"},409);
const payload=b.payload||{};
if(b.action==="word_found"){
const word=String(payload.word||"").toUpperCase().trim();const cells=payload.cells;
const puzzle=multiplayerPuzzle(Number(match[0].level_id),String(match[0].mode));
const placement=puzzle.placements.find((p)=>p.word===word);
if(!placement||!sameCells(cells,placement.cells))return json({error:"Invalid word selection"},400);
const found=await db.$queryRaw`select found_words from multiplayer_members where room_id=${b.roomId} and user_id=${userId} and is_bot=false limit 1`;
if(!found.length)return json({error:"Player not found"},404);
const words=Array.isArray(found[0].found_words)?found[0].found_words as string[]:[];
if(words.includes(word))return json({error:"Word already found"},409);
const next=[...words,word];const score=next.length*100+Math.max(0,Number(placement.word.length)-3)*20;
await db.$queryRaw`update multiplayer_members set found_words=${JSON.stringify(next)}::jsonb,progress=${Math.floor(next.length/puzzle.words.length*100)},score=${score},combo=${next.length},last_seen_at=now() where room_id=${b.roomId} and user_id=${userId} and is_bot=false`;
await db.$queryRaw`insert into multiplayer_match_events(match_id,seq,user_id,event_type,payload) select ${b.matchId},coalesce(max(seq),0)+1,${userId},'word_found',${JSON.stringify({word})}::jsonb from multiplayer_match_events where match_id=${b.matchId}`;
if(next.length===puzzle.words.length){await db.$queryRaw`update multiplayer_matches set status='finished',finished_at=now(),winner_user_id=${userId},settled_at=now() where match_id=${b.matchId} and status='live'`;await db.$queryRaw`update multiplayer_rooms set status='finished',updated_at=now(),state_json=jsonb_set(state_json,'{phase}','"finished"'::jsonb) where room_id=${b.roomId}`;}
return json({ok:true,found:next.length,total:puzzle.words.length,score});}
if(b.action==="finish")return json({error:"Finish is server-derived"},400);
}catch(e){return json({error:e instanceof Error?e.message:"Multiplayer action failed"},400);}}}}});