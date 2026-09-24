import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
const must = ['src/lib/v37/preview/playablePreview.ts','src/components/v37/PlayablePreviewScreen.tsx','src/components/app/GameApp.tsx','src/components/screens/MoreScreens.tsx','src/lib/game/types.ts'];
for (const f of must) if (!fs.existsSync(root+f)) throw new Error(`missing ${f}`);
const svc=fs.readFileSync(root+'src/lib/v37/preview/playablePreview.ts','utf8');
for (const x of ['generatePuzzle','validatePuzzle','validatePuzzleQuality']) if(!svc.includes(x)) throw new Error(`missing ${x}`);
const app=fs.readFileSync(root+'src/components/app/GameApp.tsx','utf8'); if(!app.includes('PlayablePreviewScreen')||!app.includes('case "playablePreview"')) throw new Error('route missing');
const more=fs.readFileSync(root+'src/components/screens/MoreScreens.tsx','utf8'); if(!more.includes('Playable Preview Studio')) throw new Error('menu missing');
console.log('V37 playable preview integration check: PASS');
