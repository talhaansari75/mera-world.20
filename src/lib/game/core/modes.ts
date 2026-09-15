import type { GameMode } from "../types.ts";

export type ModeDefinition = { id: GameMode; name: string; description: string; free: boolean; difficulty: number };

export const MODE_CATALOG: ModeDefinition[] = [
  { id: "classic", name: "Classic", description: "Balanced word-search journey.", free: false, difficulty: 1 },
  { id: "timed", name: "Time Attack", description: "Beat the clock.", free: false, difficulty: 2 },
  { id: "survival", name: "Survival", description: "Three mistakes end the run.", free: false, difficulty: 3 },
  { id: "blitz", name: "Blitz", description: "Short, intense rounds.", free: false, difficulty: 4 },
  { id: "zen", name: "Zen", description: "No energy cost or timer.", free: true, difficulty: 0 },
  { id: "daily", name: "Daily", description: "One deterministic challenge each day.", free: true, difficulty: 3 },
  { id: "endless", name: "Endless", description: "Procedural rounds without a level cap.", free: true, difficulty: 4 },
  { id: "fog", name: "Fog", description: "Only the discovered area stays visible.", free: false, difficulty: 4 },
  { id: "mirror", name: "Mirror", description: "Words are displayed in reverse.", free: false, difficulty: 3 },
  { id: "category", name: "Category", description: "Focus on a themed vocabulary set.", free: false, difficulty: 2 },
  { id: "boss", name: "Boss", description: "Extra words and a strict timer.", free: false, difficulty: 5 },
];
