import type { PlayerSave } from "@/lib/game/types";
export const REWARDS = [50,75,100,150,200,300,400,500,750,1000] as const;
export function seasonKey(now=new Date()){return `${now.getUTCFullYear()}-S${Math.floor(now.getUTCMonth()/3)+1}`;}
export function seasonPoints(save:PlayerSave){return save.stats.levelsCompleted*10+save.stats.wordsFound*2+save.stats.perfectClears*15+save.stats.bossesDefeated*30;}
