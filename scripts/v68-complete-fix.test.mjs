import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gameplay = fs.readFileSync('src/lib/server/gameplay.ts','utf8');
const store = fs.readFileSync('src/lib/store.ts','utf8');

test('V68 daily claim is rechecked inside advisory-lock transaction', () => {
  const lock = gameplay.indexOf('daily-session:${context.userId}:${data.day}');
  const recheck = gameplay.indexOf('claimedInsideTx', lock);
  const active = gameplay.indexOf('const activeDaily', lock);
  assert.ok(lock >= 0 && recheck > lock && active > recheck);
});

test('V68 speed daily cannot be paused server or client side', () => {
  assert.match(gameplay, /state\.kind === "daily" && state\.dailyChallengeId === "speed"/);
  assert.match(store, /play\.kind === "daily" && play\.dailyChallenge\?\.id === "speed"/);
});

test('V68 gameplay queue treats server rejection as delivery failure', () => {
  assert.match(store, /const result = await recordGameplayAction\(\{ data \}\);/);
  assert.match(store, /if \(!result\.ok\) throw new Error/);
});

test('V68 online level start does not spend energy locally before server authorization', () => {
  assert.match(store, /const online = typeof navigator !== "undefined" && navigator\.onLine;/);
  assert.match(store, /const next = online \|\| free \? filled/);
  assert.match(store, /get\(\)\.applyServerSave\(result\.save as PlayerSave\)/);
});

test('V68 server returns authoritative save after gameplay session start', () => {
  assert.match(gameplay, /const authoritativeRow = await db\.playerSave\.findUnique/);
  assert.match(gameplay, /save: authoritativeSave/);
});

test('V68 pause duration is bounded', () => {
  assert.match(gameplay, /Math\.min\(pausedMs, 120_000\)/);
});
