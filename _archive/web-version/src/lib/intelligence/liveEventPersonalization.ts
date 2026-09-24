import type { PlayerSave } from "../game/types.ts";
import { profileFor, personalizationEnabled } from "./playerIntelligence.ts";

export type PersonalizedLiveEvent = { id:string; title:string; detail:string; kind:"daily"|"speed"|"pet"|"collection"|"mastery" };
export function recommendLiveEvent(save: PlayerSave): PersonalizedLiveEvent {
  if (!personalizationEnabled(save)) return {id:"standard-daily",title:"Daily Challenge",detail:"Today's short puzzle is ready.",kind:"daily"};
  const p = profileFor(save);
  if (p.speed_preference >= 72 && p.skill_score >= 68) return {id:"speed-pulse",title:"60-Second Speed Pulse",detail:"Beat the clock without changing your normal journey.",kind:"speed"};
  if (p.pet_affinity >= 68) return {id:"pet-trail",title:"Pet Trail",detail:"A short pet-focused objective is live.",kind:"pet"};
  if (p.collection_affinity >= 68) return {id:"artifact-hunt",title:"Artifact Hunt",detail:"Find a collectible on your next few clears.",kind:"collection"};
  if (p.difficulty_preference >= 72 && p.skill_score >= 68) return {id:"mastery-window",title:"Mastery Window",detail:"Try one harder bonus objective today.",kind:"mastery"};
  return {id:"daily-pulse",title:"Daily Discovery",detail:"A small fresh objective is waiting.",kind:"daily"};
}
