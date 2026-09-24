import fs from 'node:fs';
const root = new URL('..', import.meta.url).pathname;
const must = [
 'src/lib/v35/ai/creatorIdeas.ts',
 'src/components/v35/AIPuzzleLabScreen.tsx',
 'src/components/app/GameApp.tsx',
 'src/components/screens/MoreScreens.tsx',
 'src/lib/game/types.ts',
];
for (const f of must) if (!fs.existsSync(root + f)) throw new Error(`missing ${f}`);
const ai = fs.readFileSync(root+'src/lib/v35/ai/creatorIdeas.ts','utf8');
if (!ai.includes('process.env.XAI_API_KEY')) throw new Error('AI key must remain server-side');
if (!ai.includes('fallback') || !ai.includes('validWord')) throw new Error('validation/fallback missing');
const types=fs.readFileSync(root+'src/lib/game/types.ts','utf8'); if(!types.includes('aiPuzzleLab')) throw new Error('screen id missing');
const app=fs.readFileSync(root+'src/components/app/GameApp.tsx','utf8'); if(!app.includes('AIPuzzleLabScreen')||!app.includes('case "aiPuzzleLab"')) throw new Error('route missing');
const more=fs.readFileSync(root+'src/components/screens/MoreScreens.tsx','utf8'); if(!more.includes('AI Puzzle Lab')) throw new Error('menu missing');
console.log('V35 AI Puzzle Lab integration check: PASS');
