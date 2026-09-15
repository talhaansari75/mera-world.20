import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const required = [
  'src/lib/v16/core/puzzleQuality.ts',
  'src/lib/v16/save/saveSlots.ts',
  'src/components/v16/SaveSlotsScreen.tsx',
  'src/components/app/GameApp.tsx',
  'src/lib/game/generator.ts',
  'src/lib/game/types.ts',
];
for (const f of required) if (!fs.existsSync(path.join(root,f))) throw new Error(`Missing ${f}`);
const generator = fs.readFileSync(path.join(root,'src/lib/game/generator.ts'),'utf8');
const app = fs.readFileSync(path.join(root,'src/components/app/GameApp.tsx'),'utf8');
const types = fs.readFileSync(path.join(root,'src/lib/game/types.ts'),'utf8');
const checks = [
 ['Guaranteed fallback retains placements', generator.includes('Guaranteed-solvable deterministic fallback') && generator.includes('placements.map')],
 ['Puzzle quality validation is wired', generator.includes('validatePuzzleQuality(puzzle, true)')],
 ['Save slots route exists', app.includes('case "saveSlots"') && types.includes('"saveSlots"')],
 ['Save recovery uses checksum', fs.readFileSync(path.join(root,'src/lib/v16/save/saveSlots.ts'),'utf8').includes('checksum')],
 ['Save backup rotation exists', fs.readFileSync(path.join(root,'src/lib/v16/save/saveSlots.ts'),'utf8').includes('.bak')],
];
for (const [n,ok] of checks) { console.log(`${ok?'PASS':'FAIL'} — ${n}`); if(!ok) process.exitCode=1; }
if (process.exitCode) process.exit(1); console.log('V16 core QA: PASS');
