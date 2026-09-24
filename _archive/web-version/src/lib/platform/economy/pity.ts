export type PityState = { pulls: number; guaranteeAt: number };
export function rollWithPity(state: PityState, chance: number, rng: number): { hit: boolean; next: PityState } { const hit = state.pulls + 1 >= state.guaranteeAt || rng < chance; return { hit, next: hit ? { pulls: 0, guaranteeAt: state.guaranteeAt } : { ...state, pulls: state.pulls + 1 } }; }
