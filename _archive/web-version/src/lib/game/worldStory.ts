import { JOURNEY_WORLDS, journeyWorldForLevel } from "./journeyWorlds.ts";
export type StoryChapter = { id:string; world:number; title:string; summary:string; npc:string; levels:[number,number]; reward:number; boss:string; bossTitle:string };
export type WorldNode = { id:string; world:number; level:number; title:string; chapter:string; unlocked:boolean; boss:boolean };
export const STORY_CHAPTERS: readonly StoryChapter[] = JOURNEY_WORLDS.map(w => ({id:`ch${w.world}`,world:w.world,title:w.name,summary:w.story,npc:w.hero,levels:[w.from,w.to],reward:w.chestCoins,boss:w.boss,bossTitle:w.bossTitle}));
export function chapterForLevel(level:number){ const w=journeyWorldForLevel(level); return STORY_CHAPTERS[w.world-1] ?? STORY_CHAPTERS[0]!; }
export function worldNodes(maxUnlocked:number):WorldNode[]{ return STORY_CHAPTERS.flatMap(c=>{const span=c.levels[1]-c.levels[0];const step=Math.max(1,Math.floor(span/4));const levels=[c.levels[0],c.levels[0]+step,c.levels[0]+step*2,c.levels[0]+step*3,c.levels[1]];return levels.map((level,i)=>({id:`${c.id}-${i}`,world:c.world,level,title:i===4?"Boss Gate":`Stage ${i+1}`,chapter:c.id,unlocked:level<=maxUnlocked,boss:i===4}));}); }
