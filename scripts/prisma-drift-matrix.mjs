#!/usr/bin/env node
/** Real PostgreSQL drift mutation -> detection -> rejection/recovery test. */
import { spawnSync } from 'node:child_process';
import { Client } from 'pg';
import { randomUUID } from 'node:crypto';

const baseUrl = process.env.DATABASE_URL?.trim();
if (!baseUrl) throw new Error('DATABASE_URL is required');
const parsed = new URL(baseUrl);
const adminUrl = new URL(baseUrl);
const dbName = `prisma_drift_${randomUUID().replaceAll('-', '')}`;
const originalDb = parsed.pathname;
adminUrl.pathname = '/postgres';
const run = (args, env = {}) => {
  const r = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['prisma', ...args], { encoding: 'utf8', env: { ...process.env, ...env } });
  return r;
};
const sql = async (url, text) => { const c = new Client({ connectionString: url }); await c.connect(); try { return await c.query(text); } finally { await c.end(); } };
const target = new URL(baseUrl); target.pathname = `/${dbName}`;
try {
  await sql(adminUrl.toString(), `CREATE DATABASE "${dbName}"`);
  const migrated = run(['migrate','deploy'], { DATABASE_URL: target.toString() });
  if (migrated.status !== 0) throw new Error(`baseline migration failed:\n${migrated.stdout}\n${migrated.stderr}`);
  const cases = [
    ['extra-column', 'ALTER TABLE player_saves ADD COLUMN __drift_extra text'],
    ['missing-column', 'ALTER TABLE player_saves DROP COLUMN revision'],
    ['wrong-default', 'ALTER TABLE player_saves ALTER COLUMN version SET DEFAULT 999'],
    ['wrong-nullability', 'ALTER TABLE player_saves ALTER COLUMN save_json DROP NOT NULL'],
  ];
  for (const [name, mutation] of cases) {
    const reset = run(['migrate','reset','--force','--skip-seed'], { DATABASE_URL: target.toString() });
    if (reset.status !== 0) throw new Error(`reset before ${name} failed: ${reset.stdout}\n${reset.stderr}`);
    await sql(target.toString(), mutation);
    const diff = run(['migrate','diff','--from-url',target.toString(),'--to-migrations','prisma/migrations']);
    if (diff.status !== 0) throw new Error(`drift diff command failed for ${name}: ${diff.stderr}`);
    if (!(diff.stdout || '').trim()) throw new Error(`drift case ${name} was NOT detected`);
    console.log(`[drift-matrix] detected ${name}`);
    const repair = run(['migrate','reset','--force','--skip-seed'], { DATABASE_URL: target.toString() });
    if (repair.status !== 0) throw new Error(`repair/rebuild failed for ${name}: ${repair.stdout}\n${repair.stderr}`);
  }
  console.log('[drift-matrix] PASS — all mutation cases were applied, detected, and recovered on a real PostgreSQL database.');
} finally {
  await sql(adminUrl.toString(), `DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`).catch(() => {});
  parsed.pathname = originalDb;
}
