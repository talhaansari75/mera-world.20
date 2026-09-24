#!/usr/bin/env node
/**
 * Safe V42/V43 -> Prisma adoption planner/resolver.
 * This command NEVER runs the fresh baseline DDL against an existing DB.
 * It generates a reviewed reconciliation plan; resolve is a separate explicit step.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
const url = process.env.DATABASE_URL?.trim();
if (!url) throw new Error('DATABASE_URL is required');
if (!/^postgres(?:ql)?:\/\//.test(url)) throw new Error('DATABASE_URL must be PostgreSQL');
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const out = 'artifacts/prisma-adoption';
await mkdir(out, { recursive:true });
const run = (args, opts={}) => spawnSync(npx, args, { encoding:'utf8', ...opts });
const diff = run(['prisma','migrate','diff','--from-url',url,'--to-schema-datamodel','prisma/schema.prisma','--script']);
if (diff.status !== 0) { console.error(diff.stdout || diff.stderr); process.exit(diff.status ?? 1); }
await writeFile(`${out}/schema-diff.sql`, diff.stdout || '');
const audit = run(['node','scripts/prisma-adoption-audit.mjs'], { stdio:'inherit' });
if (audit.status !== 0) process.exit(audit.status ?? 1);
if (!(diff.stdout || '').trim()) {
  console.log('[prisma-adopt] EXACT MATCH — existing schema already matches Prisma. Run db:adopt:resolve after verified backup.');
} else {
  console.log('[prisma-adopt] PLAN READY — review artifacts/prisma-adoption/schema-diff.sql and data-audit.json. Nothing was applied.');
}
