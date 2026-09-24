export type ScoreEvidence = {
  levelId: string; timeMs: number; found: number; expected: number;
  hints: number; inputEvents: number; startedAt: number; finishedAt: number;
};

export type CheatFinding = { code: string; severity: 'low' | 'medium' | 'high'; score: number };

export function inspectScore(e: ScoreEvidence): CheatFinding[] {
  const findings: CheatFinding[] = [];
  if (e.timeMs < 250 && e.found > 3) findings.push({ code: 'IMPOSSIBLE_TIME', severity: 'high', score: 0.98 });
  if (e.finishedAt < e.startedAt) findings.push({ code: 'CLOCK_REWIND', severity: 'high', score: 1 });
  if (e.found > e.expected) findings.push({ code: 'FOUND_OVER_LIMIT', severity: 'high', score: 1 });
  if (e.found > 0 && e.inputEvents === 0) findings.push({ code: 'NO_INPUT_EVIDENCE', severity: 'medium', score: 0.85 });
  return findings;
}

export function verifyReplayHash(events: string[], expectedHash: string) {
  let hash = 2166136261;
  for (const char of events.join('|')) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return (hash >>> 0).toString(16) === expectedHash;
}
