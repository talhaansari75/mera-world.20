import type { PlayerSave } from "../game/types.ts";
import { adaptivePlan as legacyAdaptivePlan } from "../game/engagement.ts";
import { profileFor, personalizationEnabled } from "./playerIntelligence.ts";

export type AdaptiveTier = "assist" | "steady" | "expert";

export function intelligenceAdaptivePlan(save: PlayerSave, level: number) {
  if (!personalizationEnabled(save)) return legacyAdaptivePlan(save, level);
  const p = profileFor(save);
  const recent = Object.entries(save.results).filter(([k]) => /^\d+$/.test(k) && Number(k) < level).sort((a,b) => Number(b[0])-Number(a[0])).slice(0,5).map(([,r]) => r);
  const struggling = recent.filter((r:any) => r.stars <= 1 || r.timeMs > 120000).length;
  const expert = recent.filter((r:any) => r.stars === 3 && r.perfect).length;
  if (struggling >= 2 || (p.hint_dependency >= 70 && p.recent_engagement < 50)) return { tier:"assist" as AdaptiveTier, timeMultiplier:1.12, startingReveals:1, bonusTarget:0, surprise:false };
  if ((expert >= 3 || p.skill_score >= 78) && p.difficulty_preference >= 65) return { tier:"expert" as AdaptiveTier, timeMultiplier:0.94, startingReveals:0, bonusTarget:1, surprise:true };
  return { tier:"steady" as AdaptiveTier, timeMultiplier:1, startingReveals:0, bonusTarget:0, surprise:false };
}
