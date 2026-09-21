import {getPrisma} from "@/lib/db";
export async function settleMatch(matchId:string){
 const db=getPrisma();
 return db.$transaction(async(tx:any)=>{
  const locked=await tx.$queryRaw`select match_id,room_id,status,settled_at from multiplayer_matches where match_id=${matchId} for update`;
  if(!locked.length)return {settled:false}; if(locked[0].settled_at)return {settled:true};
  const rows=await tx.$queryRaw`select user_id,is_bot,score from multiplayer_members where room_id=${locked[0].room_id} order by score desc,user_id asc`;
  if(!rows.length)return {settled:false};
  await tx.$queryRaw`insert into multiplayer_match_results(match_id,user_id,rank,score,is_bot) select ${matchId},user_id,row_number() over(order by score desc,user_id asc),score,is_bot from multiplayer_members where room_id=${locked[0].room_id} on conflict(match_id,user_id) do update set rank=excluded.rank,score=excluded.score,is_bot=excluded.is_bot`;
  const humans=rows.filter((r:any)=>!r.is_bot), humanCount=humans.length;
  if(humanCount>=2){
   for(let i=0;i<humans.length;i++){const h=humans[i];const rank=i+1;const delta=rank===1?20:rank===2?5:-15;
    await tx.$queryRaw`insert into multiplayer_ratings(user_id,rating,wins,losses,draws,games,updated_at) values(${h.user_id},1000+${delta},${rank===1?1:0},${rank===1?0:1},0,1,now()) on conflict(user_id) do update set rating=greatest(100,multiplayer_ratings.rating+${delta}),wins=multiplayer_ratings.wins+${rank===1?1:0},losses=multiplayer_ratings.losses+${rank===1?0:1},games=multiplayer_ratings.games+1,updated_at=now()`;
   }
  }
  const winner=rows[0]?.is_bot?null:rows[0]?.user_id;
  await tx.$queryRaw`update multiplayer_matches set status=case when status in ('live','waiting','countdown') then 'finished' else status end,finished_at=coalesce(finished_at,now()),winner_user_id=coalesce(winner_user_id,${winner}),settled_at=now(),event_version=event_version+1 where match_id=${matchId}`;
  await tx.$queryRaw`update multiplayer_rooms set status='finished',updated_at=now(),state_json=jsonb_set(coalesce(state_json,'{}'::jsonb),'{phase}','"finished"'::jsonb) where room_id=${locked[0].room_id}`;
  return {settled:true,winner,ranked:humanCount>=2};
 });
}