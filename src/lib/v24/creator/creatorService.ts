import { generatePuzzle } from "@/lib/game/generator";
import { validatePuzzleQuality } from "@/lib/v16/core/puzzleQuality";

export type CreatorDraft = { id:string; title:string; words:string[]; category:string; createdAt:number; updatedAt:number; status:"draft"|"published" };
const KEY="mwsv24.creator.drafts";
const cleanWord=(w:string)=>w.trim().toUpperCase().replace(/[^A-Z]/g,"").slice(0,14);
export function sanitizeWords(input:string){return Array.from(new Set(input.split(/[\n,]+/).map(cleanWord).filter(w=>w.length>=3))).slice(0,12)}
export function validateCreatorWords(words:string[]){
  if(words.length<3) return {ok:false,reason:"Add at least 3 words."};
  if(words.some(w=>w.length<3||w.length>14)) return {ok:false,reason:"Words must be 3–14 letters."};
  const puzzle=generatePuzzle({seed:7001+words.length,size:12,wordCount:words.length,minLen:3,maxLen:14,dirs:[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],category:"creator",title:"Creator Puzzle"});
  const q=validatePuzzleQuality(puzzle);
  return q.valid ? {ok:true,reason:"Puzzle is solvable and quality-checked."} : {ok:false,reason:q.errors.join(", ") || "Puzzle quality check failed."};
}
export function listDrafts():CreatorDraft[]{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return[]}}
export function saveDraft(d:CreatorDraft){const all=listDrafts().filter(x=>x.id!==d.id);localStorage.setItem(KEY,JSON.stringify([d,...all].slice(0,30)))}
export function publishDraft(id:string){const d=listDrafts().find(x=>x.id===id);if(!d)return false;saveDraft({...d,status:"published",updatedAt:Date.now()});return true}
export function newDraft(title:string,words:string[],category:string):CreatorDraft{const now=Date.now();return{id:crypto.randomUUID(),title:title.trim().slice(0,48)||"Untitled Journey",words,category:category.trim().slice(0,32)||"creator",createdAt:now,updatedAt:now,status:"draft"}}
