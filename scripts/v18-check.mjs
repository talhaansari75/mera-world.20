import fs from 'node:fs';import path from 'node:path';
const root=process.cwd();const must=[
'src/lib/v18/offlineMutationQueue.ts','src/lib/v18/leaderboardRetry.ts','src/lib/v18/install.ts','src/lib/store.ts','src/components/play/PlayScreen.tsx','src/components/screens/CloudSyncScreen.tsx'];
for(const f of must)if(!fs.existsSync(path.join(root,f)))throw new Error(`Missing ${f}`);
const store=fs.readFileSync(path.join(root,'src/lib/store.ts'),'utf8');if(!store.includes('installV18Offline'))throw new Error('V18 offline bridge not installed');
const play=fs.readFileSync(path.join(root,'src/components/play/PlayScreen.tsx'),'utf8');for(const x of ['queueLeaderboard("score"','queueLeaderboard("daily"'])if(!play.includes(x))throw new Error(`Missing retry hook ${x}`);
const q=fs.readFileSync(path.join(root,'src/lib/v18/offlineMutationQueue.ts'),'utf8');if(!q.includes('save:changed')&& !fs.readFileSync(path.join(root,'src/lib/v18/install.ts'),'utf8').includes('save:changed'))throw new Error('Save event bridge missing');
console.log('V18 static integration check: PASS');
