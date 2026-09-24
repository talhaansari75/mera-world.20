import type { PlayerSave } from "../game/types.ts";
import { profileFor, personalizationEnabled } from "./playerIntelligence.ts";

export function personalizedRewardMultiplier(save: PlayerSave, rewardKind: "challenge" | "pet" | "collection" | "speed" | "standard") {
  if (!personalizationEnabled(save)) return 1;
  const p = profileFor(save);
  const score = rewardKind === "pet" ? p.pet_affinity : rewardKind === "collection" ? p.collection_affinity : rewardKind === "speed" ? p.speed_preference : rewardKind === "challenge" ? p.challenge_affinity : 50;
  return 1 + Math.min(0.1, Math.max(0, (score - 60) / 400));
}
