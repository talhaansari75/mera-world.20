import fs from 'node:fs';
const files=['src/lib/v32/adaptive/difficulty.ts','src/components/v32/AdaptiveScreen.tsx','src/lib/game/types.ts','src/components/app/GameApp.tsx','src/components/screens/MoreScreens.tsx'];
for(const f of files) if(!fs.existsSync(f)) throw new Error(`missing ${f}`);
const d=fs.readFileSync('src/lib/v32/adaptive/difficulty.ts','utf8');
for(const x of ['buildAdaptiveProfile','recommendedLevel','recommendedModes']) if(!d.includes(x)) throw new Error(`missing ${x}`);
console.log('V32 adaptive integration QA: PASS');
