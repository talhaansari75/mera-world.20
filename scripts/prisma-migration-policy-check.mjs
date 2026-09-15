#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root='prisma/migrations'; const dirs=readdirSync(root).filter(x=>statSync(join(root,x)).isDirectory());
if(dirs.some(x=>/baseline/i.test(x)&&x!=='20260915020000_prisma_fresh_baseline')) throw new Error('Unapproved baseline migration directory found.');
const sql=dirs.flatMap(d=>{const p=join(root,d,'migration.sql');return statSync(join(root,d)).isDirectory()?[p]:[]}).filter(p=>{try{return statSync(p).isFile()}catch{return false}}).map(p=>readFileSync(p,'utf8')).join('\n');
if(/CREATE TABLE IF NOT EXISTS|ALTER TABLE .* ADD COLUMN IF NOT EXISTS/i.test(sql)) throw new Error('Migration policy violation: executable Prisma migrations may not use IF NOT EXISTS reconciliation patterns.');
const fks=[...sql.matchAll(/CONSTRAINT\s+([A-Za-z0-9_]+)\s+FOREIGN KEY/gi)].map(m=>m[1]); const dup=fks.filter((x,i)=>fks.indexOf(x)!==i); if(dup.length) throw new Error('Duplicate FK definitions: '+[...new Set(dup)].join(', '));
console.log('[prisma-migration-policy] PASS — no IF-NOT-EXISTS adoption DDL and no duplicate FK names.');
