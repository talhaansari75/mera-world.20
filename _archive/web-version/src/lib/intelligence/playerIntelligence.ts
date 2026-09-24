import type { GameMode, PetId, PlayerSave } from "../game/types.ts";
import type { BehaviorProfile } from "../game/behavior.ts";

export type IntelligenceEvent =
  | { type: "level_start"; level: number; mode: GameMode }
  | { type: "word_found"; level: number; category: string; combo: number }
  | { type: "hint_used"; level: number }
  | { type: "level_complete"; level: number; world: number; category: string; mode: GameMode; timeMs: number; hints: number; combo: number; stars: number; perfect: boolean; pet: PetId | null; rewardCoins: number; daily?: boolean }
  | { type: "level_fail"; level: number; reason: string }
  | { type: "session_end"; level: number; completedLevels: number };

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const blend = (old: number, signal: number, weight = 0.14) => old + (signal - old) * weight;

function defaultProfile(): BehaviorProfile {
  return { skill_score:50,difficulty_preference:50,speed_preference:50,pet_affinity:50,collection_affinity:50,challenge_affinity:50,hint_dependency:0,session_length:1,recent_engagement:50,preferred_worlds:[],preferred_categories:[],average_completion_ms:0,completions:0,failures:0,quits:0,hints:0,combo_best:0,session_levels:0,last_close_level:0,reward_affinity:{},category_affinity:{},updatedAt:0 };
}
function profileFrom(raw: Partial<BehaviorProfile> | undefined): BehaviorProfile {
  return { ...defaultProfile(), ...(raw ?? {}) };
}

export function personalizationEnabled(save: PlayerSave) {
  return save.settings.personalization !== false;
}

export function profileFor(save: PlayerSave) {
  return profileFrom(save.behaviorProfile);
}

export function applyIntelligenceEvent(save: PlayerSave, event: IntelligenceEvent): PlayerSave {
  if (!personalizationEnabled(save)) return save;
  const p = profileFor(save);
  const next = { ...p };
  if (event.type === "level_start") {
    next.recent_engagement = clamp(blend(p.recent_engagement, 65));
    next.updatedAt = Date.now();
  } else if (event.type === "word_found") {
    next.recent_engagement = clamp(blend(p.recent_engagement, 72));
    next.combo_best = Math.max(p.combo_best, event.combo);
    next.category_affinity = { ...p.category_affinity, [event.category]: (p.category_affinity[event.category] ?? 0) + 1 };
  } else if (event.type === "hint_used") {
    next.hints = p.hints + 1;
    next.hint_dependency = clamp(blend(p.hint_dependency, 100, 0.08));
  } else if (event.type === "level_complete") {
    const fastSignal = event.timeMs <= 75_000 ? 100 : event.timeMs >= 150_000 ? 0 : 50;
    const skillSignal = event.perfect ? 95 : event.stars >= 3 ? 80 : event.stars <= 1 ? 30 : 58;
    const categoryAffinity = { ...p.category_affinity, [event.category]: (p.category_affinity[event.category] ?? 0) + 2 };
    const rewardAffinity = { ...p.reward_affinity, coins: (p.reward_affinity.coins ?? 0) + Math.max(1, event.rewardCoins) };
    const completions = p.completions + 1;
    next.skill_score = clamp(blend(p.skill_score, skillSignal));
    next.difficulty_preference = clamp(blend(p.difficulty_preference, event.stars >= 3 ? 82 : event.stars <= 1 ? 24 : 55));
    next.speed_preference = clamp(blend(p.speed_preference, fastSignal));
    next.challenge_affinity = clamp(blend(p.challenge_affinity, event.daily || event.mode !== "classic" ? 90 : 40));
    next.pet_affinity = clamp(blend(p.pet_affinity, event.pet ? 100 : 0));
    next.collection_affinity = clamp(blend(p.collection_affinity, event.rewardCoins >= 80 ? 80 : 45));
    next.hint_dependency = clamp(blend(p.hint_dependency, event.hints ? Math.min(100, event.hints * 30) : 0));
    next.recent_engagement = clamp(blend(p.recent_engagement, event.perfect ? 96 : 76));
    next.average_completion_ms = p.average_completion_ms ? Math.round(p.average_completion_ms + (event.timeMs - p.average_completion_ms) / completions) : event.timeMs;
    next.completions = completions;
    next.hints = p.hints + event.hints;
    next.combo_best = Math.max(p.combo_best, event.combo);
    next.session_levels = p.session_levels + 1;
    next.preferred_worlds = [event.world, ...p.preferred_worlds.filter((w) => w !== event.world)].slice(0, 6);
    next.preferred_categories = Object.entries(categoryAffinity).sort((a,b) => b[1]-a[1]).map(([k]) => k).slice(0, 6);
    next.category_affinity = categoryAffinity;
    next.reward_affinity = rewardAffinity;
    next.updatedAt = Date.now();
  } else if (event.type === "level_fail") {
    next.failures = p.failures + 1;
    next.skill_score = clamp(blend(p.skill_score, 25));
    next.recent_engagement = clamp(blend(p.recent_engagement, 30));
    next.last_close_level = event.level;
    next.updatedAt = Date.now();
  } else if (event.type === "session_end") {
    next.quits = p.quits + 1;
    next.last_close_level = event.level;
    next.recent_engagement = clamp(blend(p.recent_engagement, event.completedLevels > 0 ? 70 : 35));
    next.updatedAt = Date.now();
  }
  return { ...save, behaviorProfile: { ...profileFrom(next), ...next } };
}

export type PlayerRecommendation = {
  id: "speed" | "mastery" | "assist" | "pets" | "collection" | "daily" | "steady";
  title: string;
  detail: string;
  priority: "now" | "next" | "optional";
};

export function recommendFor(save: PlayerSave): PlayerRecommendation {
  const p = profileFor(save);
  if (!personalizationEnabled(save)) return { id: "steady", title: "Continue Journey", detail: "Personalization is off; the journey stays on its standard path.", priority: "now" };
  if (p.failures >= 3 && p.failures > p.completions * 0.25) return { id: "assist", title: "Gentle Assist", detail: "A slightly calmer board and optional help are ready.", priority: "now" };
  if (p.speed_preference >= 72 && p.skill_score >= 68) return { id: "speed", title: "60-Second Speed Run", detail: "Your recent pace fits a fast challenge.", priority: "now" };
  if (p.difficulty_preference >= 72 && p.skill_score >= 68) return { id: "mastery", title: "Mastery Challenge", detail: "Harder bonus objectives are ready.", priority: "next" };
  if (p.pet_affinity >= 68) return { id: "pets", title: "Pet Quest", detail: "Your equipped-pet play style has a useful next objective.", priority: "next" };
  if (p.collection_affinity >= 68) return { id: "collection", title: "Collection Hunt", detail: "A collectible-focused objective is available.", priority: "next" };
  if (p.challenge_affinity >= 68) return { id: "daily", title: "Today's Challenge", detail: "A short challenge matches your recent play style.", priority: "next" };
  return { id: "steady", title: `Continue Level ${save.unlockedLevel}`, detail: "The next puzzle is tuned to your recent pace.", priority: "now" };
}

export function engagementSummary(save: PlayerSave) {
  const p = profileFor(save);
  return { skill: clamp(p.skill_score), speed: clamp(p.speed_preference), hints: clamp(p.hint_dependency), pet: clamp(p.pet_affinity), collection: clamp(p.collection_affinity), challenge: clamp(p.challenge_affinity) };
}
