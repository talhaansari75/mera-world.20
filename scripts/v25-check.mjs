import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const required=[
 'src/lib/v25/creator/cloud.ts','src/lib/v25/progression/season.ts','src/components/v25/SeasonProgressScreen.tsx','migrations/0007_v25_creator_cloud.sql',
 'src/components/v24/CreatorScreen.tsx','src/lib/v24/progression/mastery.ts'
];
for(const f of required) if(!fs.existsSync(path.join(root,f))) throw new Error(`missing ${f}`);
const cloud=fs.readFileSync(path.join(root,'src/lib/v25/creator/cloud.ts'),'utf8');
if(!cloud.includes('authMiddleware')||!cloud.includes('context.userId')) throw new Error('creator cloud auth invariant failed');
const types=fs.readFileSync(path.join(root,'src/lib/game/types.ts'),'utf8');
if(!types.includes('"seasonProgress"')) throw new Error('screen id missing');
const app=fs.readFileSync(path.join(root,'src/components/app/GameApp.tsx'),'utf8');
if(!app.includes('SeasonProgressScreen')||!app.includes('case "seasonProgress"')) throw new Error('route missing');
const sql=fs.readFileSync(path.join(root,'migrations/0007_v25_creator_cloud.sql'),'utf8');
if(!sql.includes('creator_puzzles')||!sql.includes('user_id')) throw new Error('migration invariant failed');
console.log('V25 check PASS: creator cloud auth, migration, seasonal progression, routing');
