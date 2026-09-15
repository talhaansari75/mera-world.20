import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const levels = fs.readFileSync(new URL('../src/lib/game/levels.ts', import.meta.url), 'utf8');
const gameplay = fs.readFileSync(new URL('../src/lib/server/gameplay.ts', import.meta.url), 'utf8');
const specials = fs.readFileSync(new URL('../src/lib/game/specialTiles.ts', import.meta.url), 'utf8');
const daily = fs.readFileSync(new URL('../src/lib/game/dailyChallenges.ts', import.meta.url), 'utf8');

test('V59 boss classification is narrative World Gate only', () => {
  assert.match(levels, /return level > 0 && WORLDS\.some\(\(w\) => level === w\.to\)/);
  assert.doesNotMatch(levels, /level % 25 === 0/);
  assert.match(gameplay, /const boss=state\.kind==="level" && isBoss\(state\.level\)/);
});

test('V59 daily rewards have a server-side one-claim gate', () => {
  assert.match(gameplay, /dailyResult\.findUnique\(\{ where: \{ userId_dayKey/);
  assert.match(gameplay, /Today's daily challenge has already been claimed/);
  assert.match(gameplay, /const alreadyClaimed = await tx\.dailyResult\.findUnique/);
});

test('V59 Ice/Bomb dailies attach a real hazard to a target word', () => {
  assert.match(specials, /puzzle\.placements\[0\]\?\.cells\[0\]/);
  assert.match(gameplay, /specialKindsAt\(data\.cells, specialMap\)/);
  assert.match(daily, /case "ice": return \{ met: input\.specialHits\?\.has\("ice"\)/);
  assert.match(daily, /case "bomb": return \{ met: input\.specialHits\?\.has\("bomb"\)/);
});
