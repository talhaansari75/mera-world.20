export type PowerUpId = "reveal" | "scan" | "focus" | "streak";

export type PowerUp = {
  id: PowerUpId;
  name: string;
  description: string;
  cost: number;
  cooldownMs: number;
};

export const POWER_UPS: readonly PowerUp[] = [
  { id: "reveal", name: "Reveal", description: "Reveal the first tile of an unfound word.", cost: 18, cooldownMs: 0 },
  { id: "scan", name: "Word Scan", description: "Reveal every tile of the next target word.", cost: 45, cooldownMs: 0 },
  { id: "focus", name: "Focus", description: "A short focus boost for difficult rounds.", cost: 30, cooldownMs: 30_000 },
  { id: "streak", name: "Streak Shield", description: "Protect your current combo from the next miss.", cost: 55, cooldownMs: 60_000 },
];

export type QuestMetric =
  | "wordsFound"
  | "gamesWon"
  | "perfectClears"
  | "coinsEarned"
  | "dailyCompleted"
  | "bossesDefeated";

export type Quest = {
  id: string;
  title: string;
  description: string;
  metric: QuestMetric;
  target: number;
  rewardCoins: number;
  rewardXp: number;
};

export const DAILY_QUESTS: readonly Quest[] = [
  { id: "q_words_10", title: "Word Hunter", description: "Find 10 words.", metric: "wordsFound", target: 10, rewardCoins: 60, rewardXp: 35 },
  { id: "q_win_2", title: "Journey Forward", description: "Complete 2 rounds.", metric: "gamesWon", target: 2, rewardCoins: 75, rewardXp: 45 },
  { id: "q_perfect", title: "Flawless", description: "Get 1 perfect clear.", metric: "perfectClears", target: 1, rewardCoins: 120, rewardXp: 80 },
];

export const MILESTONES = [
  { level: 2, title: "Apprentice", reward: 100 },
  { level: 5, title: "Word Scout", reward: 150 },
  { level: 10, title: "Puzzle Ranger", reward: 250 },
  { level: 20, title: "Master Seeker", reward: 400 },
  { level: 35, title: "Legend Hunter", reward: 650 },
] as const;

export function questProgress(
  quest: Quest,
  stats: { wordsFound: number; gamesWon: number; perfectClears: number; coinsEarned: number; dailyCompleted: number; bossesDefeated: number },
) {
  const value = stats[quest.metric];
  return Math.min(quest.target, Math.max(0, value));
}

export function playerXpLevel(xp: number) {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 40)) + 1);
}

export function xpIntoLevel(xp: number) {
  const level = playerXpLevel(xp);
  const previous = Math.max(0, (level - 1) * (level - 1) * 40);
  const next = level * level * 40;
  return { level, current: Math.max(0, xp - previous), needed: Math.max(1, next - previous) };
}
