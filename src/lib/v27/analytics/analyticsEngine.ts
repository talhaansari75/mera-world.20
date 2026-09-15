import type { PlayerSave } from "@/lib/game/types";

export type AnalyticsSnapshot = {
  gamesPlayed: number;
  winRate: number;
  perfectRate: number;
  wordsPerGame: number;
  averagePlayMinutes: number;
  hintsPerGame: number;
  bossWins: number;
  dailyCompletions: number;
  currentStreak: number;
  bestStreak: number;
  levelsCompleted: number;
};

const safe = (n: number) => Number.isFinite(n) ? Math.max(0, n) : 0;

export function buildAnalytics(save: PlayerSave): AnalyticsSnapshot {
  const s = save.stats;
  const games = safe(s.gamesPlayed);
  return {
    gamesPlayed: games,
    winRate: games ? Math.round((safe(s.gamesWon) / games) * 1000) / 10 : 0,
    perfectRate: games ? Math.round((safe(s.perfectClears) / games) * 1000) / 10 : 0,
    wordsPerGame: games ? Math.round((safe(s.wordsFound) / games) * 10) / 10 : 0,
    averagePlayMinutes: games ? Math.round((safe(s.playTimeMs) / games / 60000) * 10) / 10 : 0,
    hintsPerGame: games ? Math.round((safe(s.hintsUsed) / games) * 10) / 10 : 0,
    bossWins: safe(s.bossesDefeated),
    dailyCompletions: safe(s.dailyCompleted),
    currentStreak: safe(s.currentStreak),
    bestStreak: safe(s.bestStreak),
    levelsCompleted: safe(s.levelsCompleted),
  };
}

export function analyticsCsv(snapshot: AnalyticsSnapshot): string {
  const rows = [
    ["metric", "value"],
    ["games_played", snapshot.gamesPlayed],
    ["win_rate_percent", snapshot.winRate],
    ["perfect_clear_rate_percent", snapshot.perfectRate],
    ["words_per_game", snapshot.wordsPerGame],
    ["average_play_minutes", snapshot.averagePlayMinutes],
    ["hints_per_game", snapshot.hintsPerGame],
    ["bosses_defeated", snapshot.bossWins],
    ["daily_completions", snapshot.dailyCompletions],
    ["current_streak", snapshot.currentStreak],
    ["best_streak", snapshot.bestStreak],
    ["levels_completed", snapshot.levelsCompleted],
  ];
  return rows.map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(",")).join("\n");
}
