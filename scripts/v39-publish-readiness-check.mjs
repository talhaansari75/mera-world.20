import fs from 'node:fs';
const root = new URL('../', import.meta.url).pathname;
const files = [
  'src/lib/v39/publish/readiness.ts',
  'src/components/v39/PublishReadinessScreen.tsx',
  'src/lib/game/types.ts',
  'src/components/app/GameApp.tsx',
  'src/components/screens/MoreScreens.tsx',
  'src/lib/v36_puzzleAudit.ts',
  'V39_PUBLISH_READINESS.md',
];
for (const f of files) if (!fs.existsSync(root + f)) throw new Error(`missing ${f}`);
const screen = fs.readFileSync(root + 'src/components/v39/PublishReadinessScreen.tsx','utf8');
if (!screen.includes('Ready for publish') || !screen.includes('Creator Playtest')) throw new Error('readiness UI incomplete');
const types = fs.readFileSync(root + 'src/lib/game/types.ts','utf8');
if (!types.includes('"publishReadiness"')) throw new Error('route type missing');
const app = fs.readFileSync(root + 'src/components/app/GameApp.tsx','utf8');
if (!app.includes('case "publishReadiness"')) throw new Error('route missing');
const menu = fs.readFileSync(root + 'src/components/screens/MoreScreens.tsx','utf8');
if (!menu.includes('id: "publishReadiness"')) throw new Error('menu missing');
console.log('V39 publish readiness checks: PASS');
