export type ScoreEvent = { playerId: string; points: number; at: number; nonce: string };
export function acceptScore(events: readonly ScoreEvent[], event: ScoreEvent): ScoreEvent[] { if (!event.playerId || event.points < 0 || event.points > 10000 || !event.nonce) throw new Error('invalid_score'); if (events.some(e => e.nonce === event.nonce)) return events.slice(); return [...events, event]; }
export function totals(events: readonly ScoreEvent[]): Record<string, number> { return events.reduce((a,e) => ({ ...a, [e.playerId]: (a[e.playerId] ?? 0) + e.points }), {}); }
