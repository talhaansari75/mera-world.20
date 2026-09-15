export type CoachInsight = { id:string; title:string; body:string; action?:string; priority:"low"|"medium"|"high" };

export function buildCoachInsights(stats: {gamesPlayed:number; gamesWon:number; wordsFound:number; hintsUsed:number; currentStreak:number; bestStreak:number; perfectClears:number; levelsCompleted:number}, unlockedLevel:number): CoachInsight[] {
  const out: CoachInsight[] = [];
  const winRate = stats.gamesPlayed ? stats.gamesWon / stats.gamesPlayed : 0;
  const hintRate = stats.gamesPlayed ? stats.hintsUsed / stats.gamesPlayed : 0;
  if (!stats.gamesPlayed) out.push({id:"start",title:"Start with Classic",body:"Play a few Classic boards so the coach can learn your pace.",action:"Classic",priority:"medium"});
  else if (winRate < 0.65) out.push({id:"steady",title:"Build consistency",body:"Your clears are below 65%. Try Classic or Focus mode and avoid spending hints early.",action:"Focus",priority:"high"});
  else if (winRate > 0.9) out.push({id:"challenge",title:"Ready for a challenge",body:"Your clear rate is above 90%. Timed, Blitz, or diagonal rules should stretch your pace.",action:"Blitz",priority:"medium"});
  if (hintRate > 1.5) out.push({id:"hints",title:"Train your scanning",body:"You average more than 1.5 hints per game. Try a no-hints board to sharpen pattern recognition.",action:"No Hints",priority:"medium"});
  if (stats.currentStreak >= 7) out.push({id:"streak",title:"Protect the streak",body:`You are on a ${stats.currentStreak}-day streak. A Daily board is the safest way to keep momentum.` ,action:"Daily",priority:"low"});
  if (stats.perfectClears > 0 && stats.perfectClears >= Math.max(3, Math.floor(stats.gamesPlayed * .2))) out.push({id:"mastery",title:"Mastery opportunity",body:"Perfect clears are a strong share of your games. Push the next unlocked level for higher mastery value.",action:`Level ${Math.min(unlockedLevel + 1, 2000)}`,priority:"low"});
  if (stats.bestStreak >= 10) out.push({id:"survival",title:"Streak specialist",body:"Your best streak is already double digits. Survival mode is a natural next challenge.",action:"Survival",priority:"medium"});
  return out.slice(0,5);
}

export function recommendedModes(stats: {gamesPlayed:number; gamesWon:number; hintsUsed:number}) {
  const winRate = stats.gamesPlayed ? stats.gamesWon / stats.gamesPlayed : 0;
  if (!stats.gamesPlayed) return ["classic","daily","zen"];
  if (winRate < .65) return ["classic","focus","zen"];
  if (winRate > .9) return ["blitz","timed","diagonal"];
  return ["classic","timed","no_hints"];
}
