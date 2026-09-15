import { gameEvents } from '../../game/core/eventBus';
import { telemetry } from '../../platform/analytics/telemetry';

export type GameplayMetric = {
  sessionId: string;
  startedAt: number;
  wordsFound: number;
  wordsMissed: number;
  completed: boolean;
};

let active: GameplayMetric | null = null;

function id() { return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`; }

export function installGameplayBridge(): () => void {
  const unsubs = [
    gameEvents.on('level:start', (p) => {
      active = { sessionId: id(), startedAt: Date.now(), wordsFound: 0, wordsMissed: 0, completed: false };
      telemetry.track('v9_level_start', { level: p.level, mode: p.mode, seed: p.seed, sessionId: active.sessionId });
    }),
    gameEvents.on('word:found', (p) => {
      if (!active) return;
      active.wordsFound++;
      telemetry.track('v9_word_found', { word: p.word, index: p.index, combo: p.combo, sessionId: active.sessionId });
    }),
    gameEvents.on('word:miss', (p) => {
      if (!active) return;
      active.wordsMissed++;
      telemetry.track('v9_word_miss', { letters: p.letters, sessionId: active.sessionId });
    }),
    gameEvents.on('level:complete', (p) => {
      if (!active) return;
      active.completed = true;
      telemetry.track('v9_level_complete', { level: p.level, stars: p.stars, timeMs: p.timeMs, sessionId: active.sessionId, durationMs: Date.now() - active.startedAt, wordsFound: active.wordsFound, wordsMissed: active.wordsMissed });
      active = null;
    }),
    gameEvents.on('level:fail', (p) => {
      if (!active) return;
      telemetry.track('v9_level_fail', { level: p.level, reason: p.reason, sessionId: active.sessionId, durationMs: Date.now() - active.startedAt, wordsFound: active.wordsFound, wordsMissed: active.wordsMissed });
      active = null;
    }),
  ];
  return () => unsubs.forEach((u) => u());
}
