import { getPrisma } from "@/lib/db";
import { multiplayerPuzzle } from "./serverPuzzle";
import { settleMatch } from "./settle";

export async function tickBots(matchId:string){
 const db=getPrisma();
 const m=await db.$queryRaw`select match_id,room_id,status,mode,level_id,puzzle_seed,started_at,duration_seconds from multiplayer_matches where match_id=${matchId} limit 1`;
 if(!m.length||m[0].status!=="live"||!m[0].started_at)return;
 if(Date.now()>new Date(m[0].started_at).getTime()+Number(m[0].duration_seconds)*1000){await settleMatch(matchId);return;}
 const puzzle=multiplayerPuzzle(Number(m[0].level_id),String(m[0].mode),Number(m[0].puzzle_seed));
 const bots=await db.$queryRaw`select user_id,bot_skill,found_words from multiplayer_members where room_id=${m[0].room_id} and is_bot=true`;
 for(const bot of bots){
  const skill=String(bot.bot_skill||"medium");
  const delay=skill==="expert"?3500:skill==="hard"?5000:skill==="easy"?10000:7500;
  const elapsed=Date.now()-new Date(m[0].started_at).getTime();
  const target=Math.min(puzzle.words.length,Math.floor(elapsed/delay));
  const found=Array.isArray(bot.found_words)?bot.found_words as string[]:[];
  if(found.length>=target)continue;
  const word=puzzle.words.find((w:string)=>!found.includes(w)); if(!word)continue;
  const next=[...found,word]; const score=next.length*100+Math.max(0,word.length-3)*20;
  await db.$queryRaw`update multiplayer_members set found_words=${JSON.stringify(next)}::jsonb,progress=${Math.floor(next.length/puzzle.words.length*100)},score=${score},combo=${next.length},last_seen_at=now() where room_id=${m[0].room_id} and user_id=${bot.user_id} and is_bot=true`;
 }
}