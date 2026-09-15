export type MatchState = { id: string; revision: number; players: string[]; startedAt: number; status: 'waiting' | 'live' | 'finished' };
export type MatchAction = { playerId: string; seq: number; type: string; payload: unknown };

export function acceptAction(state: MatchState, action: MatchAction, lastSeq: Map<string, number>) {
  if (!state.players.includes(action.playerId)) return { ok: false as const, reason: 'NOT_IN_MATCH' };
  const previous = lastSeq.get(action.playerId) ?? 0;
  if (action.seq <= previous) return { ok: false as const, reason: 'REPLAYED_ACTION' };
  lastSeq.set(action.playerId, action.seq);
  return { ok: true as const, state: { ...state, revision: state.revision + 1 } };
}
