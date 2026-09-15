import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
function files(dir){ return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]); }
const routes=files('src/server/v5/routes').filter(x=>x.endsWith('.ts'));
const stubs=routes.filter(x=>/status\s*:\s*501|status:501/.test(readFileSync(x,'utf8')));
if(stubs.length) { console.error('501 legacy stubs remain:',stubs); process.exit(1); }
const leaderboard=readFileSync('src/lib/server/leaderboard.ts','utf8');
if(!leaderboard.includes('completed verified gameplay session')) throw new Error('Leaderboard verification guard missing');
const creator=readFileSync('src/lib/v25/creator/cloud.ts','utf8');
if(!creator.includes('pending_review')) throw new Error('Creator moderation guard missing');
const gameplay=readFileSync('src/lib/server/gameplay.ts','utf8');
for (const needle of ['startGameplaySession','recordGameplayAction','gameSessionV5','Serializable','rewardLedgerV5']) if(!gameplay.includes(needle)) throw new Error(`Gameplay hardening missing: ${needle}`);
const rewards=readFileSync('src/lib/v26/progression/serverRewards.ts','utf8');
if(!rewards.includes('Serializable') || !rewards.includes('idempotencyKey')) throw new Error('Atomic reward claim guard missing');
const payments=readFileSync('src/routes/api/payments/webhook.ts','utf8');
if(!payments.includes('HmacPaymentProvider')) throw new Error('Signed payment webhook missing');
const auth=readFileSync('src/lib/auth/server.ts','utf8');
if(!auth.includes('BETTER_AUTH_SECRET is required in production')) throw new Error('Production auth secret fail-closed guard missing');
console.log(`Security hardening checks passed (${routes.length} legacy routes checked).`);
