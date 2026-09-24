import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const gameplay = fs.readFileSync(new URL('../src/lib/server/gameplay.ts', import.meta.url), 'utf8');
const store = fs.readFileSync(new URL('../src/lib/store.ts', import.meta.url), 'utf8');
const migration = fs.readFileSync(new URL('../prisma/migrations/20260915060000_v63_integrity_hardening/migration.sql', import.meta.url), 'utf8');
test('V63 integrity hardening', () => {
  assert.match(gameplay, /FOR UPDATE/);
  assert.match(gameplay, /level-clear:\$\{context\.userId\}:\$\{state\.level\}/);
  assert.match(gameplay, /petEffect\(/);
  assert.match(gameplay, /dailyStreak/);
  assert.match(gameplay, /pg_advisory_xact_lock/);
  assert.match(store, /serverActionQueue/);
  assert.doesNotMatch(store, /void recordGameplayAction\(\{data:/);
  assert.match(migration, /CREATE UNIQUE INDEX IF NOT EXISTS/);
  assert.match(migration, /status = 'boss_open'/);
});
