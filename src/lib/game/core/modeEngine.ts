import type { GameMode, Placement } from "../types.ts";

export type ModeCheck = { ok: boolean; reason?: string };

function sameCells(a: Array<[number, number]>, b: Array<[number, number]>) {
  if (a.length !== b.length) return false;
  return a.every(([r, c], i) => r === b[i]?.[0] && c === b[i]?.[1]);
}

function directionOf(cells: Array<[number, number]>) {
  if (cells.length < 2) return [0, 0] as const;
  return [Math.sign(cells[1]![0] - cells[0]![0]), Math.sign(cells[1]![1] - cells[0]![1])] as const;
}

export function placementForPath(cells: Array<[number, number]>, placements: Placement[]) {
  return placements.find((p) => sameCells(cells, p.cells) || sameCells(cells, [...p.cells].reverse()));
}

export function validateModePath(mode: GameMode, cells: Array<[number, number]>, placements: Placement[]): ModeCheck {
  const placement = placementForPath(cells, placements);
  if (!placement) return { ok: true };
  const [dr, dc] = directionOf(cells);
  if (mode === "diagonal" && (Math.abs(dr) !== 1 || Math.abs(dc) !== 1)) return { ok: false, reason: "Diagonal paths only" };
  if (mode === "orthogonal" && !(dr === 0 || dc === 0)) return { ok: false, reason: "Horizontal/vertical paths only" };
  if (mode === "reverse_only") {
    const forward = sameCells(cells, placement.cells);
    if (forward) return { ok: false, reason: "Reverse direction required" };
  }
  return { ok: true };
}

export function randomRuleFor(level: number): GameMode {
  const x = Math.abs(((level * 1103515245 + 12345) | 0));
  const roll = x % 5;
  return (["orthogonal", "diagonal", "reverse_only", "no_hints", "timed"] as GameMode[])[roll]!;
}

export function modeLabel(mode: GameMode) {
  return mode === "random_rules" ? "Random Rules" : mode.replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
