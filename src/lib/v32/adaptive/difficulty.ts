export type AdaptiveProfile = { score:number; band:"gentle"|"steady"|"challenge"|"expert"; recommendedLevel:number; recommendedModes:string[]; reason:string };

type Stats={gamesPlayed:number;gamesWon:number;hintsUsed:number;perfectClears:number;currentStreak:number};
export function buildAdaptiveProfile(stats:Stats, unlockedLevel:number):AdaptiveProfile {
  const played=Math.max(0,stats.gamesPlayed); const win=played?stats.gamesWon/played:0; const hints=played?stats.hintsUsed/played:0; const perfect=played?stats.perfectClears/played:0;
  let score=50 + (win-.7)*70 - Math.max(0,hints-1)*8 + perfect*25 + Math.min(stats.currentStreak,10);
  score=Math.max(0,Math.min(100,Math.round(score)));
  const band=score<40?"gentle":score<65?"steady":score<85?"challenge":"expert";
  const step=band==="gentle"?-2:band==="steady"?0:band==="challenge"?1:2;
  const recommendedLevel=Math.max(1,Math.min(2000,unlockedLevel+step));
  const recommendedModes=band==="gentle"?["classic","focus","zen"]:band==="steady"?["classic","timed","no_hints"]:band==="challenge"?["blitz","diagonal","timed"]:["speedrun","survival","nightmare"];
  const reason=!played?"Play a few boards first; the profile will adapt as results arrive.":band==="gentle"?"Lower pressure will help you rebuild consistency.":band==="steady"?"Your pace is stable; mix familiar boards with one training constraint.":band==="challenge"?"Your clears are strong enough to increase pressure gradually.":"Your recent results support an expert-level challenge.";
  return {score,band,recommendedLevel,recommendedModes,reason};
}
