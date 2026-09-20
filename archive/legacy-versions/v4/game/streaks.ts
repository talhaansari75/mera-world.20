export type StreakState={current:number;best:number;multiplier:number};
export function advanceStreak(s:StreakState,success:boolean):StreakState{const current=success?s.current+1:0;return {current,best:Math.max(s.best,current),multiplier:1+Math.min(current,20)*.05}}
