import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
const required = [
 'src/components/v38/CreatorPlaytestScreen.tsx',
 'src/lib/v38/playtest/playtest.ts',
 'V38_CREATOR_PLAYTEST.md'
];
for (const p of required) if (!fs.existsSync(root + '/' + p)) throw new Error(`Missing ${p}`);
const types = fs.readFileSync(root + '/src/lib/game/types.ts','utf8');
const app = fs.readFileSync(root + '/src/components/app/GameApp.tsx','utf8');
const more = fs.readFileSync(root + '/src/components/screens/MoreScreens.tsx','utf8');
for (const [name,text] of [['types',types],['app',app],['more',more]]) if (!text.includes('creatorPlaytest')) throw new Error(`creatorPlaytest not integrated in ${name}`);
console.log('V38 creator playtest integration checks: PASS');
