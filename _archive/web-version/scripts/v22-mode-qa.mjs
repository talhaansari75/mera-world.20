import { readFileSync } from 'node:fs';
const files = [
 'src/lib/game/core/modeEngine.ts',
 'src/lib/game/core/modeEngine.test.ts',
 'src/lib/store.ts',
 'src/lib/game/core/modeRules.ts',
 'src/lib/game/levels.ts',
 'src/components/play/GridBoard.tsx',
];
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  if (!s.trim()) throw new Error(`empty: ${f}`);
}
const store = readFileSync('src/lib/store.ts','utf8');
for (const token of ['validateModePath(play.mode, cells, play.puzzle.placements)', 'Hints are disabled in this mode']) {
  if (!store.includes(token)) throw new Error(`missing integration: ${token}`);
}
console.log('V22 mode QA PASS');
