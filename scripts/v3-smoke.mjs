import assert from 'node:assert/strict';
import fs from 'node:fs';
for (const p of [
  'migrations/0003_v3_platform.sql',
  'src/lib/server/v3/idempotency.ts',
  'src/lib/server/v3/rateLimit.ts',
  'src/lib/server/v3/platformFns.ts',
  'src/lib/multiplayer/roomService.ts',
  'src/lib/analytics/serverTelemetry.ts',
  'src/lib/payments/providerBoundary.ts',
  'docs/V3_BUILD_STATUS.md',
]) assert.ok(fs.existsSync(p), `missing ${p}`);
console.log('V3 smoke: required platform files present');
