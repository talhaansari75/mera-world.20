import {getPrisma} from "@/lib/db";
import {multiplayerPuzzle} from "./serverPuzzle";
import {settleMatch} from "./settle";
export async function tickBots(matchId:string){
 const db=getPrisma();const m=await db.$queryRaw`select match_id,room_id,status,mode,level_id,puzzle_seed,started_at,duration_seconds from multiplayer_matches where match_id=${matchId} for update`;
 if(!m.length||m[0].status!=="live"||!m[0].started_at)return;
 if(Date.now()>new Date(m[0].started_at).getTime()+Number(m[0].duration_seconds)*1000){await settleMatch(matchId);return;}
 const puzzle=multiplayerPuzzle(Number(m[0].level_id),String(m[0].mode),Number(m[0].puzzle_seed));
 const bots=await db.$queryRaw`select user_id,bot_skill from multiplayer_members where room_id=${m[0].room_id} and is_bot=true`;
 for(const bot of bots){
  const skill=String(bot.bot_skill||"steady"),delay=skill==="expert"?3500:skill==="steady"?7500:10000;
  const target=Math.min(puzzle.words.length,Math.floor((Date.now()-new Date(m[0].started_at).getTime())/delay)); if(target<1)continue;
  const found=await db.$queryRaw`select word from multiplayer_found_words where match_id=${matchId} and user_id=${bot.user_id} order by created_at`;
  if(found.length>=target)continue; const word=puzzle.words.find(w=>!found.some((x:any)=>x.word===w)); if(!word)continue;
  await db.$queryRaw`insert into multiplayer_found_words(match_id,user_id,word) values(${matchId},${bot.user_id},${word}) on conflict do nothing`;
  const count=await db.$queryRaw`select count(*)::int as n from multiplayer_found_words where match_id=${matchId} and user_id=${bot.user_id}`;
  const n=Number(count[0].n),score=n*100+Math.max(0,word.length-3)*20;
  await db.$queryRaw`update multiplayer_members set found_words=(select coalesce(jsonb_agg(word order by word),'[]'::jsonb) from multiplayer_found_words where match_id=${matchId} and user_id=${bot.user_id}),progress=${Math.min(100,Math.floor(n/puzzle.words.length*100))},score=${score},combo=${n},last_seen_at=now() where room_id=${m[0].room_id} and user_id=${bot.user_id} and is_bot=true`;
  await db.$queryRaw`insert into multiplayer_match_event_counters(match_id,next_seq) values(${matchId},1) on conflict(match_id) do nothing`;
  const c=await db.$queryRaw`update multiplayer_match_event_counters set next_seq=next_seq+1 where match_id=${matchId} returning next_seq-1 as seq`;
  await db.$queryRaw`insert into multiplayer_match_events(match_id,seq,user_id,event_type,payload) values(${matchId},${Number(c[0].seq)},${bot.user_id},'bot_word_found',${JSON.stringify({word})}::jsonb)`;
  await db.$queryRaw`update multiplayer_matches set event_version=event_version+1 where match_id=${matchId}`;
 }
}