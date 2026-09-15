import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
const required = [
  'src/lib/v42_releaseArchive.ts',
  'src/components/v42/ReleaseArchiveScreen.tsx',
  'V42_RELEASE_ARCHIVE.md',
  'scripts/v42-release-archive-check.mjs'
];
for (const f of required) if (!fs.existsSync(root + f)) throw new Error(`Missing ${f}`);
const types=fs.readFileSync(root+'src/lib/game/types.ts','utf8');
const app=fs.readFileSync(root+'src/components/app/GameApp.tsx','utf8');
const more=fs.readFileSync(root+'src/components/screens/MoreScreens.tsx','utf8');
for (const [name,text,needle] of [['types',types,'"releaseArchive"'],['GameApp',app,'case "releaseArchive"'],['More',more,'label: "Release Archive"']]) if(!text.includes(needle)) throw new Error(`${name} integration missing`);
console.log('V42 release archive static integration check: PASS');
