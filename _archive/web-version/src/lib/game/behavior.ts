import type { GameMode, PetId, PlayerSave } from "./types.ts";

export type BehaviorProfile = {
  skill_score: number;
  difficulty_preference: number;
  speed_preference: number;
  pet_affinity: number;
  collection_affinity: number;
  challenge_affinity: number;
  hint_dependency: number;
  session_length: number;
  recent_engagement: number;
  preferred_worlds: number[];
  preferred_categories: string[];
  average_completion_ms: number;
  completions: number;
  failures: number;
  quits: number;
  hints: number;
  combo_best: number;
  session_levels: number;
  last_close_level: number;
  reward_affinity: Record<string, number>;
  category_affinity: Record<string, number>;
  updatedAt: number;
};

export const defaultBehaviorProfile = (): BehaviorProfile => ({
  skill_score: 50, difficulty_preference: 50, speed_preference: 50,
  pet_affinity: 50, collection_affinity: 50, challenge_affinity: 50,
  hint_dependency: 0, session_length: 1, recent_engagement: 50,
  preferred_worlds: [], preferred_categories: [], average_completion_ms: 0,
  completions: 0, failures: 0, quits: 0, hints: 0, combo_best: 0,
  session_levels: 0, last_close_level: 0, reward_affinity: {}, category_affinity: {}, updatedAt: 0,
});

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const bump = (old: number, signal: number, weight = 0.12) => old + (signal - old) * weight;

export function normalizeBehaviorProfile(raw?: Partial<BehaviorProfile> | null): BehaviorProfile {
  const base = defaultBehaviorProfile();
  const p = { ...base, ...(raw ?? {}) };
  return {
    ...p,
    skill_score: clamp(p.skill_score), difficulty_preference: clamp(p.difficulty_preference),
    speed_preference: clamp(p.speed_preference), pet_affinity: clamp(p.pet_affinity),
    collection_affinity: clamp(p.collection_affinity), challenge_affinity: clamp(p.challenge_affinity),
    hint_dependency: clamp(p.hint_dependency), session_length: Math.max(1, Math.round(p.session_length)),
    recent_engagement: clamp(p.recent_engagement), average_completion_ms: Math.max(0, p.average_completion_ms || 0),
    completions: Math.max(0, Math.floor(p.completions || 0)), failures: Math.max(0, Math.floor(p.failures || 0)),
    quits: Math.max(0, Math.floor(p.quits || 0)), hints: Math.max(0, Math.floor(p.hints || 0)),
    combo_best: Math.max(0, Math.floor(p.combo_best || 0)), session_levels: Math.max(0, Math.floor(p.session_levels || 0)),
    last_close_level: Math.max(0, Math.floor(p.last_close_level || 0)),
    preferred_worlds: Array.from(new Set((p.preferred_worlds ?? []).filter(Number.isInteger).map(Number))).slice(0, 6),
    preferred_categories: Array.from(new Set((p.preferred_categories ?? []).filter(Boolean).map(String))).slice(0, 6),
    reward_affinity: { ...(p.reward_affinity ?? {}) }, category_affinity: { ...(p.category_affinity ?? {}) },
    updatedAt: Math.max(0, Number(p.updatedAt) || 0),
  };
}

export function observeCompletion(save: PlayerSave, input: {
  level: number; world: number; category: string; mode: GameMode; timeMs: number; hints: number;
  combo: number; perfect: boolean; stars: number; pet: PetId | null; rewardCoins: number; daily?: boolean;
}): PlayerSave {
  const p = normalizeBehaviorProfile(save.behaviorProfile);
  const fast = input.timeMs <= 75_000 ? 100 : input.timeMs >= 150_000 ? 0 : 50;
  const challenge = input.daily || input.mode !== "classic" ? 100 : 40;
  const petSignal = input.pet ? 100 : 0;
  const skillSignal = input.perfect ? 90 : input.stars >= 3 ? 78 : input.stars <= 1 ? 30 : 58;
  const cat = String(input.category || "general");
  const categoryAffinity = { ...p.category_affinity, [cat]: (p.category_affinity[cat] ?? 0) + 1 };
  const rewards = { ...p.reward_affinity, coins: (p.reward_affinity.coins ?? 0) + Math.max(1, input.rewardCoins) };
  const recent = p.completions + 1;
  const avg = p.average_completion_ms ? Math.round(p.average_completion_ms + (input.timeMs - p.average_completion_ms) / recent) : input.timeMs;
  const worlds = [input.world, ...p.preferred_worlds.filter((w) => w !== input.world)].slice(0, 6);
  const categories = Object.entries(categoryAffinity).sort((a, b) => b[1] - a[1]).map(([k]) => k).slice(0, 6);
  return { ...save, behaviorProfile: normalizeBehaviorProfile({ ...p,
    skill_score: bump(p.skill_score, skillSignal), difficulty_preference: bump(p.difficulty_preference, input.stars >= 3 ? 80 : input.stars <= 1 ? 25 : 55),
    speed_preference: bump(p.speed_preference, fast), pet_affinity: bump(p.pet_affinity, petSignal),
    collection_affinity: bump(p.collection_affinity, input.rewardCoins >= 80 ? 75 : 45), challenge_affinity: bump(p.challenge_affinity, challenge),
    hint_dependency: bump(p.hint_dependency, input.hints > 0 ? Math.min(100, input.hints * 30) : 0),
    session_length: Math.max(1, p.session_levels + 1), recent_engagement: bump(p.recent_engagement, input.perfect ? 95 : 70),
    preferred_worlds: worlds, preferred_categories: categories, average_completion_ms: avg, completions: recent,
    hints: p.hints + input.hints, combo_best: Math.max(p.combo_best, input.combo), session_levels: p.session_levels + 1,
    reward_affinity: rewards, category_affinity: categoryAffinity, updatedAt: Date.now(),
  }) };
}

export function observeFailure(save: PlayerSave, level: number): PlayerSave {
  const p = normalizeBehaviorProfile(save.behaviorProfile);
  return { ...save, behaviorProfile: normalizeBehaviorProfile({ ...p, failures: p.failures + 1, skill_score: bump(p.skill_score, 28), recent_engagement: bump(p.recent_engagement, 35), last_close_level: level, updatedAt: Date.now() }) };
}

export function observeQuit(save: PlayerSave, level: number): PlayerSave {
  const p = normalizeBehaviorProfile(save.behaviorProfile);
  return { ...save, behaviorProfile: normalizeBehaviorProfile({ ...p, quits: p.quits + 1, recent_engagement: bump(p.recent_engagement, 25), last_close_level: level, updatedAt: Date.now() }) };
}

export type BehaviorRecommendation = { id: "speed" | "hard" | "assist" | "pets" | "daily" | "collection" | "steady"; title: string; detail: string };
export function behaviorRecommendation(save: PlayerSave): BehaviorRecommendation {
  const p = normalizeBehaviorProfile(save.behaviorProfile);
  if (p.speed_preference >= 72 && p.skill_score >= 68) return { id: "speed", title: "60-Second Speed Run", detail: "A fast challenge matched to your pace." };
  if (p.difficulty_preference >= 72 && p.skill_score >= 68) return { id: "hard", title: "Mastery Challenge", detail: "Harder bonus objectives are ready." };
  if (p.pet_affinity >= 68) return { id: "pets", title: "Pet Quest", detail: "Your pet-focused progress is calling." };
  if (p.collection_affinity >= 68) return { id: "collection", title: "Collection Hunt", detail: "Look for the next rare world reward." };
  if (p.challenge_affinity >= 68) return { id: "daily", title: "Today's Challenge", detail: "Your play style fits a daily challenge." };
  if (p.hint_dependency >= 60 || p.failures > p.completions * 0.25) return { id: "assist", title: "Gentle Assist", detail: "A little extra help is available." };
  return { id: "steady", title: "Continue Journey", detail: "The next puzzle is tuned to your recent pace." };
}
