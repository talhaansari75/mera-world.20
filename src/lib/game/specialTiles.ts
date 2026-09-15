import { hashSeed } from "./rng.ts";
import type { Puzzle } from "./types.ts";

export type SpecialTileKind = "ice" | "locked" | "bomb" | "moving";
export type Cell = [number, number];

export type SpecialTile = { kind: SpecialTileKind; cell: Cell };

function key(r: number, c: number) { return `${r},${c}`; }

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic special tiles. Normal hazards avoid target words; Daily Ice/Bomb deliberately attach to a target cell. */
export function specialTilesForPuzzle(puzzle: Puzzle): SpecialTile[] {
  const used = new Set<string>();
  for (const p of puzzle.placements) for (const [r, c] of p.cells) used.add(key(r, c));
  const candidates: Cell[] = [];
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) if (!used.has(key(r, c))) candidates.push([r, c]);
  }
  const rng = mulberry(hashSeed("special-v2", puzzle.seed));
  const out: SpecialTile[] = [];
  const forced = puzzle.dailyChallengeId === "ice" ? "ice" : puzzle.dailyChallengeId === "bomb" ? "bomb" : null;
  // Daily Ice/Bomb challenges deliberately put the hazard on a real target-word
  // cell, so completing the daily actually interacts with the mechanic. Normal
  // puzzles keep specials off target words to preserve readability.
  if (forced && puzzle.placements[0]?.cells[0]) {
    out.push({ kind: forced, cell: puzzle.placements[0].cells[0]! });
  }
  const occupied = new Set(out.map((t) => key(...t.cell)));
  const cap = Math.min(Math.max(3, Math.floor(puzzle.size / 2)), candidates.length);
  for (const cell of candidates) {
    const roll = rng();
    let kind: SpecialTileKind | null = null;
    if (roll < 0.018) kind = "bomb";
    else if (roll < 0.050) kind = "ice";
    else if (roll < 0.082) kind = "locked";
    else if (roll < 0.105) kind = "moving";
    if (kind && !occupied.has(key(...cell))) { out.push({ kind, cell }); occupied.add(key(...cell)); }
    if (out.length >= cap) break;
  }
  return out;
}

export function movingPositions(tiles: SpecialTile[], tick: number): Map<string, SpecialTileKind> {
  const moving = tiles.filter(t => t.kind === "moving");
  const occupied = new Set(tiles.filter(t => t.kind !== "moving").map(t => key(...t.cell)));
  const result = new Map<string, SpecialTileKind>();
  for (const t of tiles) if (t.kind !== "moving") result.set(key(...t.cell), t.kind);
  if (!moving.length) return result;
  const anchors = moving.map(t => t.cell);
  for (let i = 0; i < moving.length; i++) {
    const [r, c] = anchors[(i + tick) % anchors.length]!;
    if (!occupied.has(key(r, c))) result.set(key(r, c), "moving");
  }
  return result;
}

export function clipAtLocked(cells: Cell[], specials: Map<string, SpecialTileKind>): Cell[] {
  const out: Cell[] = [];
  for (const cell of cells) {
    if (specials.get(key(...cell)) === "locked") break;
    out.push(cell);
  }
  return out;
}

export function specialKindsAt(cells: Cell[], specials: Map<string, SpecialTileKind>): Set<SpecialTileKind> {
  const kinds = new Set<SpecialTileKind>();
  for (const cell of cells) {
    const kind = specials.get(key(...cell));
    if (kind) kinds.add(kind);
  }
  return kinds;
}
