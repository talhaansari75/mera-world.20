import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const store = fs.readFileSync(path.join(root, 'src/lib/store.ts'), 'utf8');
const gameplay = fs.readFileSync(path.join(root, 'src/lib/server/gameplay.ts'), 'utf8');

test('queue is isolated per gameplay session and cannot remain poisoned', () => {
  assert.match(store, /const serverActionQueues = new Map<string, Promise<unknown>>\(\);/);
  assert.match(store, /const previous = serverActionQueues\.get\(data\.sessionId\) \?\? Promise\.resolve\(\);/);
  assert.match(store, /previous\.catch\(\(\) => undefined\)\.then\(run\)/);
  assert.match(store, /return \{ ok: false as const, error: last instanceof Error \? last\.message/);
});

test('queue cleanup handles both resolution and rejection without unhandled finally', () => {
  assert.match(store, /void next\.then\(\(\) => \{/);
  assert.match(store, /\}, \(\) => \{/);
  assert.doesNotMatch(store, /void next\.finally\(/);
});

test('gameplay action IDs are strict UUIDs and are not silently truncated', () => {
  assert.match(gameplay, /actionId:String\(d\.actionId\?\?""\)\.trim\(\),/);
  assert.match(gameplay, /\^\[0-9a-f\]\{8\}-\[0-9a-f\]\{4\}-\[1-5\]/i);
  assert.match(gameplay, /Invalid gameplay action identity/);
});

test('bonus/found coordinates have explicit integer bounds validation before grid access', () => {
  assert.match(gameplay, /Number\.isInteger\(r\) \|\| !Number\.isInteger\(c\)/);
  assert.match(gameplay, /r >= rows \|\| c >= cols/);
  const guard = gameplay.indexOf('const rows = state.grid.length');
  const gridRead = gameplay.indexOf('const letters = data.cells.map', guard);
  assert.ok(guard >= 0 && gridRead > guard, 'bounds guard must precede bonus grid reads');
});

test('completion waits only on the current session queue', () => {
  assert.match(store, /const queued = serverActionQueues\.get\(play\.serverSessionId\);/);
  assert.doesNotMatch(store, /await serverActionQueue;/);
});

test('pending server-start cleanup consumes rejections safely', () => {
  assert.match(store, /startPromise\.then\(\(\) => undefined, \(\) => undefined\)\.finally/);
});
