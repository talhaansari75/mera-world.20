import fs from 'node:fs';
import assert from 'node:assert/strict';
const root = new URL('../src/', import.meta.url).pathname;
for (const file of ['lib/platform/sync/offlineQueue.ts','lib/platform/sync/clock.ts','lib/platform/security/integrity.ts','lib/platform/network/request.ts','lib/platform/network/status.ts']) assert.ok(fs.existsSync(root + file), file);
const q = fs.readFileSync(root + 'lib/platform/sync/offlineQueue.ts','utf8');
assert.match(q, /localStorage/); assert.match(q, /nextAttemptAt/); assert.match(q, /navigator\.onLine/);
const r = fs.readFileSync(root + 'lib/platform/network/request.ts','utf8'); assert.match(r, /AbortController/); assert.match(r, /retries/);
const c = fs.readFileSync(root + 'lib/platform/sync/clock.ts','utf8'); assert.match(c, /estimateClockOffset/);
console.log('V17 core check: PASS');
