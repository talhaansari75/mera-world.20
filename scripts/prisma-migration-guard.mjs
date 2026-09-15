#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
const url=process.env.DATABASE_URL?.trim(); if(!url) throw new Error('DATABASE_URL is required');
const npx=process.platform==='win32'?'npx.cmd':'npx';
const status=spawnSync(npx,['prisma','migrate','status'],{encoding:'utf8'});
const text=(status.stdout||'')+'\n'+(status.stderr||'');
const prisma=new PrismaClient();
try{
  let hasUser=false;
  try { hasUser=(await prisma.user.count())>0; } catch { hasUser=false; }
  const baselinePending=/20260915020000_prisma_fresh_baseline[^\n]*not yet applied|following migration.*20260915020000_prisma_fresh_baseline/i.test(text);
  if(baselinePending && hasUser) throw new Error('REFUSED: existing database contains users while fresh Prisma baseline is pending. Run db:adopt:plan, reconcile/verify, then db:adopt:resolve.');
  if(status.status!==0 && !/Database schema is up to date|following migration/i.test(text)) { console.error(text); process.exit(status.status??1); }
  console.log(`[prisma-migration-guard] PASS — ${hasUser?'existing':'fresh/empty'} database is eligible for migrate deploy.`);
} finally { await prisma.$disconnect(); }
