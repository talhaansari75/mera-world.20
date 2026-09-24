import { puzzleForSeed } from "@/lib/game/levels";
import type { GameMode } from "@/lib/game/types";
export function multiplayerPuzzle(level:number,mode:string,seed:number){
 const safe=( ["classic","timed","blitz"] as string[]).includes(mode)?mode as GameMode:"classic";
 return puzzleForSeed(Math.max(1,Math.min(2000,level)),safe,seed,"en");
}
export function sameCells(a:unknown,b:Array<[number,number]>){return Array.isArray(a)&&a.length===b.length&&a.every((x,i)=>Array.isArray(x)&&x.length===2&&Number(x[0])===b[i]![0]&&Number(x[1])===b[i]![1]);}
