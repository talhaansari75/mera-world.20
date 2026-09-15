import type { PlayerStats, LevelResult } from '@/lib/game/types';
import { buildAdaptiveProfile } from '@/lib/v32/adaptive/difficulty';

export type SessionStep = {
  title: string;
  mode: string;
  level: number;
  minutes: number;
  goal: string;
};

export type JourneyPlan = {
  score: number;
  focus: 'recovery' | 'consistency' | 'growth' | 'mastery';
  summary: string;
  steps: SessionStep[];
};

export function buildJourneyPlan(stats: PlayerStats, unlockedLevel: number, results: Record<string, LevelResult>): JourneyPlan {
  const p = buildAdaptiveProfile(stats, unlockedLevel);
  const recent = Object.values(results).slice(-12);
  const recentPerfect = recent.length ? recent.filter(r => r.perfect).length / recent.length : 0;
  const recentHints = recent.length ? recent.reduce((n, r) => n + r.hints, 0) / recent.length : 0;
  const focus = p.band === 'gentle' ? 'recovery' : p.band === 'steady' ? 'consistency' : p.band === 'challenge' ? 'growth' : 'mastery';
  const level = p.recommendedLevel;
  const modeA = p.recommendedModes[0] ?? 'classic';
  const modeB = p.recommendedModes[1] ?? 'timed';
  const modeC = p.recommendedModes[2] ?? 'no_hints';
  const hintGoal = recentHints > 1.5 ? 'Finish with one fewer hint than your recent average.' : 'Keep hints at zero or one.';
  const perfectGoal = recentPerfect < 0.35 ? 'Aim for a clean clear with every target found.' : 'Protect your perfect-clear streak.';
  return {
    score: p.score,
    focus,
    summary: focus === 'recovery' ? 'Lower pressure first, then rebuild speed.' : focus === 'consistency' ? 'Stabilize your pace before adding pressure.' : focus === 'growth' ? 'Stretch one skill at a time without overloading the session.' : 'You are ready for a high-pressure mastery run.',
    steps: [
      { title: 'Warm-up', mode: modeA, level: Math.max(1, level - 1), minutes: 5, goal: 'Settle into the board and scan accurately.' },
      { title: 'Skill push', mode: modeB, level, minutes: 8, goal: hintGoal },
      { title: 'Finish strong', mode: modeC, level: Math.min(2000, level + 1), minutes: 7, goal: perfectGoal },
    ],
  };
}
