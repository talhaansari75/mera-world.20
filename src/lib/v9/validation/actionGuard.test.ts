import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePathInput } from './actionGuard.ts';

test('path guard accepts bounded input', () => assert.equal(validatePathInput('WORD', [[0,0],[0,1]]), true));
test('path guard rejects oversized input', () => assert.equal(validatePathInput('x'.repeat(65), []), false));
