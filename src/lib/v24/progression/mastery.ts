import type { PlayerSave } from "@/lib/game/types";
export function levelMastery(save:PlayerSave,level:number){const r=save.results[String(level)];if(!r)return 0;return r.perfect?3:Math.max(1,Math.min(2,r.stars))}
export function masterySummary(save:PlayerSave,max=200){let cleared=0,perfect=0,stars=0;for(let i=1;i<=max;i++){const m=levelMastery(save,i);if(m){cleared++;stars+=m;if(m===3)perfect++;}}return{cleared,perfect,stars,percent:Math.round((cleared/max)*100)}}
export function masteryTier(stars:number){if(stars>=450)return"Legend";if(stars>=300)return"Master";if(stars>=150)return"Veteran";if(stars>=50)return"Pathfinder";return"Apprentice"}
