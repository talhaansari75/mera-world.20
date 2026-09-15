import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const gameplay = readFileSync(join(root, 'src/lib/server/gameplay.ts'), 'utf8');
const store = readFileSync(join(root, 'src/lib/store.ts'), 'utf8');
const cloud = readFileSync(join(root, 'src/lib/server/cloud.ts'), 'utf8');
const migration = readFileSync(join(root, 'prisma/migrations/20260915060000_v63_integrity_hardening/migration.sql'), 'utf8');

test('V67 gameplay parser and boss transaction are structurally closed', () => {
  assert.doesNotMatch(gameplay, /await tx\.gameSessionV5\.create\(\{data:\{id,userId:context\.userId,levelId:data\.level,seed:`boss:[^`]*`[^)]*\}\);\n    return \{ok:true as const,sessionId:id,combat\};\n    \}, \{ isolationLevel:/);
  assert.match(gameplay, /return db\.\$transaction\(async tx => \{/);
  assert.match(gameplay, /boss-session:\$\{context\.userId\}:\$\{data\.level\}/);
});

test('V67 server intelligence is authoritative and updated on verified completion', () => {
  assert.match(gameplay, /import \{ observeCompletion \} from "@\/lib\/game\/behavior"/);
  assert.match(gameplay, /const behaviorized = observeCompletion\(save as any/);
  assert.match(cloud, /"behaviorProfile"/);
});

test('V67 client completion waits for ordered server actions and verified settlement', () => {
  assert.match(store, /const queued = serverActionQueues\.get\(play\.serverSessionId\);[\s\S]*?if \(queued\)[\s\S]*?await queued/);
  assert.match(store, /verifyGameplayCompletion\(\{ data:/);
  assert.match(store, /catch \{ flash\(set, "Secure result verification failed\. Please retry\."\); return; \}/);
});

test('V67 daily starts use a per-user/day transaction lock and active-session check', () => {
  assert.match(gameplay, /daily-session:\$\{context\.userId\}:\$\{data\.day\}/);
  assert.match(gameplay, /levelId:0,status:"open"/);
  assert.match(gameplay, /Today's daily challenge is already active\./);
});

test('V63 boss DB uniqueness remains part of the release', () => {
  assert.match(migration, /game_sessions_v5_one_open_boss_per_user_level/);
  assert.match(migration, /WHERE status = 'boss_open'/);
});
