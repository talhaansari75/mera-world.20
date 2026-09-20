export type LeaderboardRow={userId:string,score:number,rank:number};
export function rankScores(scores:{userId:string,score:number}[]):LeaderboardRow[]{return [...scores].sort((a,b)=>b.score-a.score).map((x,i)=>({...x,rank:i+1}))}
