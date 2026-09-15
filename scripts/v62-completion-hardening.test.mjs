import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const gameplay = fs.readFileSync(new URL('../src/lib/server/gameplay.ts', import.meta.url), 'utf8');
const shared = fs.readFileSync(new URL('./grok-pwa-shared.mjs', import.meta.url), 'utf8');

test('V62 gameplay source has no escaped-template syntax corruption', () => {
  assert.doesNotMatch(gameplay, /\\`/);
});

test('V62 daily result is create-only and protected by the composite primary key', () => {
  assert.doesNotMatch(gameplay, /dailyResult\.upsert/);
  assert.match(gameplay, /dailyResult\.create\(\{data:\{userId:context\.userId,dayKey:state\.day/);
});

test('V62 boss reward key is permanent per user and World Gate', () => {
  assert.match(gameplay, /boss-reward:\$\{context\.userId\}:\$\{data\.level\}/);
  assert.match(gameplay, /boss-reward:\$\{context\.userId\}:\$\{row\.levelId\}/);
});

test('V62 share-head injector keeps document title and app chrome separated', () => {
  assert.match(shared, /const pwaAppName = resolveOgTitle/);
  assert.match(shared, /const documentTitle = titleFromDocument\(html\)/);
});
