import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Puzzle } from "@/lib/game/types";
import { cellsAlong, snapDir } from "@/lib/game/generator";
import { cn } from "@/lib/utils";
import { movingPositions, specialTilesForPuzzle } from "@/lib/game/specialTiles";

type Props = {
  puzzle: Puzzle;
  found: string[];
  revealed: Array<[number, number]>;
  fog?: boolean;
  mirror?: boolean;
  tileStyle: "carved" | "ink" | "neon";
  disabled?: boolean;
  onPath: (letters: string, cells: Array<[number, number]>) => "found" | "bonus" | "miss" | "repeat";
};

function key(r: number, c: number) { return `${r},${c}`; }
export function GridBoard({ puzzle, found, revealed, fog, mirror, tileStyle, disabled, onPath }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hot, setHot] = useState<Array<[number, number]>>([]);
  const [miss, setMiss] = useState<Array<[number, number]>>([]);
  const drag = useRef<{
    id: number;
    start: [number, number];
    cells: Array<[number, number]>;
    moved: boolean;
  } | null>(null);
  const tap = useRef<[number, number] | null>(null);
  const [keyboardCell, setKeyboardCell] = useState<[number, number]>([0, 0]);
  const [frozenUntil, setFrozenUntil] = useState(0);
  const [blast, setBlast] = useState<Array<[number, number]>>([]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const [r, c] = keyboardCell;
    let nr = r, nc = c;
    if (e.key === "ArrowUp") nr = Math.max(0, r - 1);
    else if (e.key === "ArrowDown") nr = Math.min(puzzle.size - 1, r + 1);
    else if (e.key === "ArrowLeft") nc = Math.max(0, c - 1);
    else if (e.key === "ArrowRight") nc = Math.min(puzzle.size - 1, c + 1);
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (tap.current) {
        const line = cellsAlong(tap.current[0], tap.current[1], r, c);
        tap.current = null;
        finish(line ?? [[r, c]]);
      } else {
        if (specialMap.get(key(r, c)) === "locked") {
          setMiss([[r, c]]);
          setTimeout(() => setMiss([]), 280);
          return;
        }
        tap.current = [r, c];
        setHot([[r, c]]);
      }
      return;
    } else return;
    e.preventDefault();
    setKeyboardCell([nr, nc]);
    setHot(tap.current ? [tap.current, [nr, nc]] : [[nr, nc]]);
  };

  const [mechanicTick, setMechanicTick] = useState(0);
  const specialTiles = useMemo(() => specialTilesForPuzzle(puzzle), [puzzle]);
  useEffect(() => {
    if (!specialTiles.some(t => t.kind === "moving")) return;
    const id = window.setInterval(() => setMechanicTick(v => v + 1), 1400);
    return () => window.clearInterval(id);
  }, [specialTiles]);
  const specialMap = useMemo(() => movingPositions(specialTiles, mechanicTick), [specialTiles, mechanicTick]);

  const foundSet = useMemo(() => {
    const s = new Set<string>();
    for (const p of puzzle.placements) {
      if (!found.includes(p.word)) continue;
      for (const [r, c] of p.cells) s.add(key(r, c));
    }
    return s;
  }, [puzzle, found]);

  const foundPaths = useMemo(
    () => puzzle.placements.filter((p) => found.includes(p.word)),
    [puzzle, found],
  );

  const revealedSet = useMemo(() => {
    const s = new Set<string>();
    for (const [r, c] of revealed) s.add(key(r, c));
    return s;
  }, [revealed]);

  const missSet = useMemo(() => new Set(miss.map(([r, c]) => key(r, c))), [miss]);
  const hotSet = useMemo(() => new Set(hot.map(([r, c]) => key(r, c))), [hot]);

  const cellAt = useCallback(
    (clientX: number, clientY: number): [number, number] | null => {
      const el = wrapRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const n = puzzle.size;
      let col = Math.floor(((clientX - rect.left) / rect.width) * n);
      let row = Math.floor(((clientY - rect.top) / rect.height) * n);
      if (mirror) col = n - 1 - col;
      if (row < 0 || col < 0 || row >= n || col >= n) return null;
      return [row, col];
    },
    [puzzle.size, mirror],
  );

  const lettersOf = (cells: Array<[number, number]>) =>
    cells.map(([r, c]) => puzzle.grid[r]![c]!).join("");

  const finish = (rawCells: Array<[number, number]>) => {
    if (Date.now() < frozenUntil) return;
    const cells = rawCells;
    if (cells.length < 2) {
      setHot([]);
      return;
    }
    const lockedIndex = cells.findIndex(([r, c]) => specialMap.get(key(r, c)) === "locked");
    const usable = lockedIndex >= 0 ? cells.slice(0, lockedIndex) : cells;
    if (usable.length < 2) {
      setMiss(cells.slice(0, Math.min(2, cells.length)));
      setTimeout(() => setMiss([]), 280);
      setHot([]);
      return;
    }
    const result = onPath(lettersOf(usable), usable);
    const kinds = new Set(usable.map(([r, c]) => specialMap.get(key(r, c))).filter(Boolean));
    if (result === "miss") {
      setMiss(usable);
      setTimeout(() => setMiss([]), 280);
    }
    if (kinds.has("bomb")) {
      const [cr, cc] = usable.find(([r, c]) => specialMap.get(key(r, c)) === "bomb")!;
      const cellsAround: Array<[number, number]> = [];
      for (let r = Math.max(0, cr - 1); r <= Math.min(puzzle.size - 1, cr + 1); r++) {
        for (let c = Math.max(0, cc - 1); c <= Math.min(puzzle.size - 1, cc + 1); c++) cellsAround.push([r, c]);
      }
      setBlast(cellsAround);
      setTimeout(() => setBlast([]), 420);
    }
    if (kinds.has("ice")) {
      const until = Date.now() + 900;
      setFrozenUntil(until);
      setTimeout(() => setFrozenUntil(v => v === until ? 0 : v), 920);
    }
    setHot([]);
  };

  const onDown = (e: React.PointerEvent) => {
    if (disabled || Date.now() < frozenUntil) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, start: cell, cells: [cell], moved: false };
    setHot([cell]);
    e.preventDefault();
  };

  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;
    if (cell[0] === d.start[0] && cell[1] === d.start[1]) {
      d.cells = [d.start];
      setHot(d.cells);
      return;
    }
    d.moved = true;
    const [sr, sc] = d.start;
    const [er, ec] = cell;
    const [dr, dc] = snapDir(er - sr, ec - sc);
    if (dr === 0 && dc === 0) return;
    const steps = Math.max(Math.abs(er - sr), Math.abs(ec - sc));
    const endR = sr + dr * steps;
    const endC = sc + dc * steps;
    const line = cellsAlong(sr, sc, endR, endC);
    if (!line) return;
    const clipped = line.filter(([r, c]) => r >= 0 && c >= 0 && r < puzzle.size && c < puzzle.size);
    const lockedIndex = clipped.findIndex(([r, c]) => specialMap.get(key(r, c)) === "locked");
    const playable = lockedIndex >= 0 ? clipped.slice(0, lockedIndex) : clipped;
    d.cells = playable;
    setHot(clipped);
  };

  const onUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.moved) {
      if (tap.current) {
        const line = cellsAlong(tap.current[0], tap.current[1], d.start[0], d.start[1]);
        tap.current = null;
        finish(line ?? [d.start]);
      } else {
        tap.current = d.start;
        setHot([d.start]);
      }
      return;
    }
    tap.current = null;
    finish(d.cells);
  };

  const onCancel = (e: React.PointerEvent) => {
    if (drag.current?.id === e.pointerId) {
      drag.current = null;
      setHot(tap.current ? [tap.current] : []);
    }
  };

  const n = puzzle.size;
  const font = n >= 16 ? "text-[11px] sm:text-sm" : n >= 12 ? "text-sm sm:text-base" : "text-base sm:text-lg";
  const pt = (r: number, c: number) => {
    const dc = mirror ? n - 1 - c : c;
    return `${dc + 0.5},${r + 0.5}`;
  };

  return (
    <div
      ref={wrapRef}
      className="grid-board relative aspect-square w-full max-w-[min(100%,72dvh)]"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onCancel}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="grid"
      aria-label="Word search grid. Use arrow keys to move and Enter to select cells."
      aria-activedescendant={`cell-${keyboardCell[0]}-${keyboardCell[1]}`}
    >
      <div
        className="grid h-full w-full gap-[3px] sm:gap-1"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {puzzle.grid.map((row, r) =>
          row.map((ch, cRaw) => {
            const c = mirror ? n - 1 - cRaw : cRaw;
            const letter = puzzle.grid[r]![c]!;
            const k = key(r, c);
            const isFound = foundSet.has(k);
            const isHot = hotSet.has(k);
            const isMiss = missSet.has(k);
            const isBlast = blast.some(([br, bc]) => br === r && bc === c);
            const isRev = revealedSet.has(k);
            const special = specialMap.get(k);
            const hide = Boolean(fog) && !isFound && !isHot && !isRev;
            return (
              <div
                key={`${r}-${cRaw}`}
                id={`cell-${r}-${c}`}
                role="gridcell"
                data-hot={isHot ? "1" : undefined}
                data-found={isFound ? "1" : undefined}
                data-miss={isMiss ? "1" : undefined}
                data-blast={isBlast ? "1" : undefined}
                data-frozen={Date.now() < frozenUntil ? "1" : undefined}
                data-rev={isRev && !isFound ? "1" : undefined}
                data-special={special}
                data-style={tileStyle}
                className={cn("letter-tile", font)}
                aria-label={hide ? "hidden letter" : `${letter}${special ? `, ${special} tile` : ""}`}
              >
                {hide ? "" : letter}
                {special && <span className="special-tile-mark" aria-hidden="true">{special === "ice" ? "❄" : special === "bomb" ? "✦" : special === "locked" ? "🔒" : "↝"}</span>}
              </div>
            );
          }),
        )}
      </div>
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${n} ${n}`}>
        {foundPaths.map((p) => (
          <polyline
            key={p.word}
            fill="none"
            stroke="color-mix(in oklab, var(--color-success) 72%, white)"
            strokeWidth="0.18"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
            points={p.cells.map(([r, c]) => pt(r, c)).join(" ")}
          />
        ))}
        {hot.length > 1 && (
          <polyline
            fill="none"
            stroke="color-mix(in oklab, var(--color-primary) 88%, white)"
            strokeWidth="0.22"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={hot.map(([r, c]) => pt(r, c)).join(" ")}
          />
        )}
      </svg>
    </div>
  );
}
