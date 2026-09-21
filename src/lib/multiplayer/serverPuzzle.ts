import { puzzleForLevel } from "@/lib/game/levels";
import type { GameMode } from "@/lib/game/types";

export function multiplayerPuzzle(level:number,mode:string){
  const safeMode=(["classic","timed","blitz"] as string[]).includes(mode)?mode as GameMode:"classic";
  return puzzleForLevel(Math.max(1,Math.min(2000,level)),safeMode,"en");
}
export function sameCells(a:unknown,b:Array<[number,number]>){
  if(!Array.isArray(a)||a.length!==b.length)return false;
  return a.every((x,i)=>Array.isArray(x)&&x.length===2&&Number(x[0])===b[i]![0]&&Number(x[1])===b[i]![1]);
}
