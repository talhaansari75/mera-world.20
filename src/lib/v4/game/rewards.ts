export type Reward={coins?:number;xp?:number;gems?:number;itemId?:string};
export function mergeRewards(a:Reward,b:Reward):Reward{return {coins:(a.coins??0)+(b.coins??0),xp:(a.xp??0)+(b.xp??0),gems:(a.gems??0)+(b.gems??0),itemId:b.itemId??a.itemId}}
