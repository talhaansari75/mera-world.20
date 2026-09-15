import { hashSeed } from "./rng.ts";

export type DailyChallengeId = "speed" | "combo" | "hidden" | "ice" | "bomb" | "perfect" | "treasure";

export type DailyChallenge = {
  id: DailyChallengeId;
  title: string;
  description: string;
  icon: string;
  rewardMultiplier: number;
};

const CHALLENGES: readonly DailyChallenge[] = [
  { id: "speed", title: "Speed Day", description: "Clear the daily before the rush clock expires.", icon: "⚡", rewardMultiplier: 1.15 },
  { id: "combo", title: "Combo Day", description: "Build a long word chain for bonus glory.", icon: "🔥", rewardMultiplier: 1.15 },
  { id: "hidden", title: "Hidden Word Day", description: "Bonus words are tucked into the grid.", icon: "👻", rewardMultiplier: 1.1 },
  { id: "ice", title: "Ice Day", description: "Frozen cells make every path more deliberate.", icon: "❄️", rewardMultiplier: 1.1 },
  { id: "bomb", title: "Bomb Day", description: "Watch the blast zones while hunting words.", icon: "💣", rewardMultiplier: 1.1 },
  { id: "perfect", title: "Perfect Day", description: "Finish with zero mistakes and zero hints for the best bonus.", icon: "⭐", rewardMultiplier: 1.2 },
  { id: "treasure", title: "Treasure Day", description: "Find the bonus words to fill today's treasure meter.", icon: "💎", rewardMultiplier: 1.15 },
];

export function dailyChallengeFor(day: string): DailyChallenge {
  const index = Math.abs(hashSeed("daily-challenge", day)) % CHALLENGES.length;
  return CHALLENGES[index]!;
}

export function allDailyChallenges() {
  return CHALLENGES.slice();
}

export function dailyChallengeObjective(challenge: DailyChallenge | undefined, input: { perfect: boolean; combo: number; bonusWords: number; specialHits?: Set<string>; elapsedMs?: number }) {
  if (!challenge) return { met: true, label: "Complete the puzzle" };
  switch (challenge.id) {
    case "speed": return { met: (input.elapsedMs ?? 0) <= 90_000, label: "Beat the 90-second rush" };
    case "combo": return { met: input.combo >= 5, label: "Reach a 5-word combo" };
    case "hidden": return { met: input.bonusWords >= 1, label: "Find at least 1 bonus word" };
    case "ice": return { met: input.specialHits?.has("ice") === true, label: "Trigger an ice cell" };
    case "bomb": return { met: input.specialHits?.has("bomb") === true, label: "Trigger a bomb cell" };
    case "perfect": return { met: input.perfect, label: "Zero mistakes and zero hints" };
    case "treasure": return { met: input.bonusWords >= 2, label: "Find 2 bonus words" };
  }
}

export function dailyChallengeRewardMultiplier(challenge: DailyChallenge | undefined, input: { perfect: boolean; combo: number; bonusWords: number }) {
  if (!challenge) return 1;
  let multiplier = challenge.rewardMultiplier;
  if (challenge.id === "perfect" && input.perfect) multiplier += 0.15;
  if (challenge.id === "combo" && input.combo >= 5) multiplier += 0.1;
  if (challenge.id === "treasure" && input.bonusWords >= 2) multiplier += 0.1;
  return Math.min(1.5, multiplier);
}
