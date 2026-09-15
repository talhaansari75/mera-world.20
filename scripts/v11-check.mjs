import fs from 'node:fs';
const root = new URL('../', import.meta.url).pathname;
const required = [
 'src/components/v11/SystemsScreen.tsx',
 'src/lib/v10/services/platformHealth.ts',
 'src/lib/settings/ultimateSettings.ts',
 'src/components/app/GameApp.tsx'
];
for (const f of required) if (!fs.existsSync(root+f)) throw new Error('Missing '+f);
const types=fs.readFileSync(root+'src/lib/game/types.ts','utf8');
if(!types.includes('| "systems"')) throw new Error('systems ScreenId missing');
const app=fs.readFileSync(root+'src/components/app/GameApp.tsx','utf8');
if(!app.includes('<SystemsScreen />')) throw new Error('Systems route missing');
const more=fs.readFileSync(root+'src/components/screens/MoreScreens.tsx','utf8');
if(!more.includes('"systems" as const')) throw new Error('Systems menu entry missing');
const settings=fs.readFileSync(root+'src/lib/settings/ultimateSettings.ts','utf8');
if(!settings.includes('Array.from({ length: 485 }')) throw new Error('485-setting registry missing');
console.log('V11 integration check: PASS');
