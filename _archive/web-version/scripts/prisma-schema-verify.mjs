#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
const url=process.env.DATABASE_URL?.trim(); if(!url) throw new Error('DATABASE_URL is required');
const npx=process.platform==='win32'?'npx.cmd':'npx';
const r=spawnSync(npx,['prisma','migrate','diff','--from-url',url,'--to-schema-datamodel','prisma/schema.prisma'],{encoding:'utf8'});
if(r.status!==0){console.error(r.stdout||r.stderr);process.exit(r.status??1)}
const diff=(r.stdout||'').trim();
if(diff){console.error('[prisma-verify] FAIL — live DB differs from Prisma schema:\n'+diff);process.exit(1)}
console.log('[prisma-verify] PASS — live PostgreSQL schema matches Prisma schema.');
