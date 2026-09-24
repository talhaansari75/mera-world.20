#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
const url = process.env.DATABASE_URL?.trim();
if (!url) throw new Error('DATABASE_URL is required');
if (process.env.ALLOW_EXISTING_DB_RESOLVE !== 'true') throw new Error('Set ALLOW_EXISTING_DB_RESOLVE=true only after backup, reconciliation, and verification.');
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const run = (args) => spawnSync(npx,args,{encoding:'utf8',stdio:'inherit'});
const diff = spawnSync(npx,['prisma','migrate','diff','--from-url',url,'--to-schema-datamodel','prisma/schema.prisma'],{encoding:'utf8'});
if(diff.status!==0) process.exit(diff.status??1);
if((diff.stdout||'').trim()) { console.error('[prisma-adopt-resolve] REFUSED — live schema is not identical to Prisma schema. Apply reviewed reconciliation first.'); console.error(diff.stdout); process.exit(1); }
if(process.env.BACKUP_VERIFIED !== 'true') throw new Error('Set BACKUP_VERIFIED=true only after an independently verified backup/restore check.');
const r=run(['prisma','migrate','resolve','--applied','20260915020000_prisma_fresh_baseline']);
process.exit(r.status??1);
