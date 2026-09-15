export type Achievement={id:string,target:number,progress:number,unlocked:boolean};
export function unlock(a:Achievement):Achievement{const progress=Math.min(a.target,a.progress+1);return {...a,progress,unlocked:progress>=a.target}}
