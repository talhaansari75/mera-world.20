import { getPrisma } from "@/lib/db";

export async function settleMatch(matchId:string){
 const db=getPrisma();
 return db.$transaction(async(tx:any)=>{
  const rows=await tx.$queryRaw`select user_id,is_bot,score from multiplayer_members where room_id=(select room_id from multiplayer_matches where match_id=${matchId}) order by score desc,user_id asc`;
  if(!rows.length)return {settled:false};
  const m=await tx.$queryRaw`select status,settled_at from multiplayer_matches where match_id=${matchId} for update`;
  if(!m.length)return {settled:false};
  if(m[0].settled_at)return {settled:true};
  await tx.$queryRaw`insert into multiplayer_match_results(match_id,user_id,rank,score,is_bot) select ${matchId},user_id,row_number() over(order by score desc,user_id asc),score,is_bot from multiplayer_members where room_id=(select room_id from multiplayer_matches where match_id=${matchId}) on conflict (match_id,user_id) do nothing`;
  const humans=rows.filter((x:any)=>!x.is_bot);
  for(const h of humans){
   const rank=rows.findIndex((x:any)=>x.user_id===h.user_id)+1;
   const delta=rank===1?20:rank===2?5:-15;
   await tx.$queryRaw`insert into multiplayer_ratings(user_id,rating,wins,losses,games,updated_at) values(${h.user_id},1000+${delta},${rank===1?1:0},${rank===1?0:1},1,now()) on conflict(user_id) do update set rating=greatest(100, multiplayer_ratings.rating+${delta}),wins=multiplayer_ratings.wins+${rank===1?1:0},losses=multiplayer_ratings.losses+${rank===1?0:1},games=multiplayer_ratings.games+1,updated_at=now()`;
  }
  const winner=rows[0]?.is_bot?null:rows[0]?.user_id;
  await tx.$queryRaw`update multiplayer_matches set status=case when status='live' then 'finished' else status end,finished_at=coalesce(finished_at,now()),winner_user_id=coalesce(winner_user_id,${winner}),settled_at=now() where match_id=${matchId}`;
  return {settled:true,winner};
 });
}
