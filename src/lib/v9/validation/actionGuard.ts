export type ActionGuardConfig = { maxString: number; maxCells: number; maxFutureMs: number };
export const DEFAULT_ACTION_GUARD: ActionGuardConfig = { maxString: 64, maxCells: 64, maxFutureMs: 10_000 };
export function validatePathInput(letters: string, cells: Array<[number, number]>, now = Date.now(), config = DEFAULT_ACTION_GUARD) {
  if (typeof letters !== 'string' || letters.length < 1 || letters.length > config.maxString) return false;
  if (!Array.isArray(cells) || cells.length > config.maxCells) return false;
  return cells.every((c) => Array.isArray(c) && c.length === 2 && Number.isInteger(c[0]) && Number.isInteger(c[1]) && Math.abs(c[0]) < 100 && Math.abs(c[1]) < 100 && now + config.maxFutureMs >= now);
}
