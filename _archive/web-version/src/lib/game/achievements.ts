import type { PlayerSave, PlayerStats } from "./types.ts";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  metric: "levels" | "words" | "coins" | "bosses" | "streak";
  target: number;
  reward: number;
};

export const ACHIEVEMENTS: readonly Achievement[] = [
  { id: "a1", title: "First Word", description: "Find 1 word.", metric: "words", target: 1, reward: 25 },
  { id: "a2", title: "Word Hunter", description: "Find 100 words.", metric: "words", target: 100, reward: 150 },
  { id: "a3", title: "Level Runner", description: "Complete 50 levels.", metric: "levels", target: 50, reward: 300 },
  { id: "a4", title: "Century", description: "Complete 100 levels.", metric: "levels", target: 100, reward: 600 },
  { id: "a5", title: "Guardian Slayer", description: "Defeat 5 bosses.", metric: "bosses", target: 5, reward: 750 },
  { id: "a6", title: "Coin Collector", description: "Earn 5000 coins.", metric: "coins", target: 5000, reward: 1000 },
  { id: "a7", title: "Streak Master", description: "Reach a 30-day streak.", metric: "streak", target: 30, reward: 1500 },
  { id: "a8", title: "First Clear", description: "Complete 1 level.", metric: "levels", target: 1, reward: 40 },
  { id: "a9", title: "Ten Trails", description: "Complete 10 levels.", metric: "levels", target: 10, reward: 120 },
  { id: "a10", title: "Wordsmith", description: "Find 25 words.", metric: "words", target: 25, reward: 80 },
  { id: "a11", title: "Lexicon", description: "Find 500 words.", metric: "words", target: 500, reward: 400 },
  { id: "a12", title: "Atlas Keeper", description: "Complete 250 levels.", metric: "levels", target: 250, reward: 1200 },
];

export function achievementProgress(a: Achievement, stats: PlayerStats) {
  const k =
    a.metric === "levels"
      ? "levelsCompleted"
      : a.metric === "words"
        ? "wordsFound"
        : a.metric === "coins"
          ? "coinsEarned"
          : a.metric === "bosses"
            ? "bossesDefeated"
            : "bestStreak";
  const v = Number(stats[k] ?? 0);
  return { value: Math.min(v, a.target), done: v >= a.target };
}

export function unlockedAchievements(save: PlayerSave) {
  return ACHIEVEMENTS.filter((a) => achievementProgress(a, save.stats).done).map((a) => a.id);
}
