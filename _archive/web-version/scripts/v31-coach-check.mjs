import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
const checks = [
 ['coach module', 'src/lib/v31/personalization/coach.ts'],
 ['coach screen', 'src/components/v31/CoachScreen.tsx'],
 ['screen id', 'src/lib/game/types.ts'],
 ['menu route', 'src/components/screens/MoreScreens.tsx'],
 ['app route', 'src/components/app/GameApp.tsx'],
];
for (const [name,file] of checks) if (!fs.existsSync(root+file)) throw new Error(`missing ${name}`);
const types=fs.readFileSync(root+'src/lib/game/types.ts','utf8');
const more=fs.readFileSync(root+'src/components/screens/MoreScreens.tsx','utf8');
const app=fs.readFileSync(root+'src/components/app/GameApp.tsx','utf8');
if(!types.includes('"coach"')) throw new Error('coach ScreenId missing');
if(!more.includes('id: "coach"')) throw new Error('coach menu missing');
if(!app.includes('case "coach"')) throw new Error('coach route missing');
console.log('V31 coach integration QA: PASS');
