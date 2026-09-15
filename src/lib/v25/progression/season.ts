import type { PlayerSave } from "@/lib/game/types";
export type SeasonTier={level:number;points:number;reward:number;claimed:boolean};
const REWARDS=[50,75,100,150,200,300,400,500,750,1000];
export function seasonKey(now=new Date()){return `${now.getUTCFullYear()}-S${Math.floor(now.getUTCMonth()/3)+1}`;}
export function seasonPoints(save:PlayerSave){return save.stats.levelsCompleted*10+save.stats.wordsFound*2+save.stats.perfectClears*15+save.stats.bossesDefeated*30;}
export function seasonTiers(save:PlayerSave):SeasonTier[]{const p=seasonPoints(save);return REWARDS.map((reward,i)=>{const level=i+1;const need=level*100;return {level,points:need,reward,claimed:p>=need};});}
