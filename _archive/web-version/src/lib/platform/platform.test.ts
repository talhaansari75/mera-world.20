import test from 'node:test';
import assert from 'node:assert/strict';
import { FixedWindowRateLimiter } from './security/rateLimit.ts';
import { IdempotencyStore } from './api/idempotency.ts';
import { createRoom, joinRoom, startRoom } from './multiplayer/room.ts';
import { acceptScore, totals } from './multiplayer/score.ts';
import { lastWriteWins } from './sync/conflict.ts';

test('rate limiter rejects after configured budget', () => { const r = new FixedWindowRateLimiter(2, 1000); assert.equal(r.allow('a', 0), true); assert.equal(r.allow('a', 1), true); assert.equal(r.allow('a', 2), false); assert.equal(r.allow('a', 1001), true); });
test('idempotency returns same stored result', () => { const s = new IdempotencyStore<number>(); s.set('x', 42, 0); assert.equal(s.get('x', 10), 42); });
test('room lifecycle enforces host and capacity', () => { let r = createRoom('r','h',2); r = joinRoom(r,'p'); assert.throws(() => joinRoom(r,'x'), /room_full/); assert.equal(startRoom(r,'h').status,'playing'); });
test('score deduplicates nonces and totals', () => { const e = acceptScore([], {playerId:'a',points:5,at:1,nonce:'n'}); const d = acceptScore(e, {...e[0]!}); assert.equal(d.length,1); assert.deepEqual(totals(d), {a:5}); });
test('sync picks newer version', () => { const a={value:'a',version:1,updatedAt:1}; const b={value:'b',version:2,updatedAt:2}; assert.equal(lastWriteWins(a,b).value,'b'); });
