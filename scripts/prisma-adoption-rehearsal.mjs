#!/usr/bin/env node
/**
 * Real V42/V43 adoption rehearsal.
 * - Never mutates LEGACY_DATABASE_URL.
 * - Clones the legacy DB into an explicitly isolated target.
 * - Generates the real Prisma reconciliation SQL.
 * - Applies that SQL to the clone.
 * - Verifies the clone is schema-equivalent to prisma/schema.prisma.
 * - Audits data before and after.
 */
import { Client } from 'pg';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
const legacy=process.env.LEGACY_DATABASE_URL?.trim(), target=process.env.DATABASE_URL?.trim();
if(!legacy||!target)throw new Error('LEGACY_DATABASE_URL and DATABASE_URL are required');
if(legacy===target)throw new Error('Refusing adoption rehearsal when source and target URLs are identical');
if(process.env.ADOPTION_TARGET_ISOLATED!=='true')throw new Error('ADOPTION_TARGET_ISOLATED=true is required; never point rehearsal at production.');
const out='artifacts/prisma-adoption';mkdirSync(out,{recursive:true});
const run=(args,env={})=>spawnSync(process.platform==='win32'?'npx.cmd':'npx',['prisma',...args],{encoding:'utf8',env:{...process.env,...env}});
const sql=async(url,text)=>{const c=new Client({connectionString:url});await c.connect();try{return await c.query(text)}finally{await c.end()}};
const q=async(url,text)=>{const c=new Client({connectionString:url});await c.connect();try{return await c.query(text)}finally{await c.end()}};
const admin=new URL(target);const targetDb=admin.pathname.replace(/^\//,'');admin.pathname='/postgres';
const tempDb=`adopt_${randomUUID().replaceAll('-','')}`;const clone=new URL(target);clone.pathname=`/${tempDb}`;
try{
 const srcTables=(await q(legacy,`select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE' order by 1`)).rows.map(x=>x.table_name);
 if(!srcTables.includes('user'))throw new Error('legacy DB does not look like a V42/V43 PostgreSQL database: missing user table');
 const dump=`${out}/legacy-rehearsal.dump`;
 const d=spawnSync('pg_dump',['--format=custom','--no-owner','--no-acl',legacy,'-f',dump],{encoding:'utf8'});if(d.status!==0)throw new Error(`pg_dump legacy failed: ${d.stderr}`);
 await sql(admin.toString(),`DROP DATABASE IF EXISTS "${tempDb}" WITH (FORCE)`);await sql(admin.toString(),`CREATE DATABASE "${tempDb}"`);
 const r=spawnSync('pg_restore',['--no-owner','--no-acl','--exit-on-error','-d',clone.toString(),dump],{encoding:'utf8'});if(r.status!==0)throw new Error(`legacy clone restore failed: ${r.stderr}`);
 const counts=await q(clone.toString(),`select (select count(*) from "user") users,(select count(*) from "session") sessions,(select count(*) from "account") accounts`);
 writeFileSync(`${out}/legacy-inventory.json`,JSON.stringify({generatedAt:new Date().toISOString(),tables:srcTables,counts:counts.rows[0]},null,2));
 const diff=run(['migrate','diff','--from-url',clone.toString(),'--to-schema-datamodel','prisma/schema.prisma','--script']);if(diff.status!==0)throw new Error(diff.stderr||diff.stdout);
 const patch=diff.stdout||'';writeFileSync(`${out}/schema-diff.sql`,patch);
 const destructive=/\b(DROP\s+(TABLE|COLUMN|TYPE|INDEX)|TRUNCATE\b|DELETE\s+FROM)\b/i.test(patch);
 if(destructive&&process.env.ADOPTION_ALLOW_DESTRUCTIVE!=='true')throw new Error('Generated adoption SQL contains destructive statements; rehearsal refused. Review schema-diff.sql and explicitly approve with ADOPTION_ALLOW_DESTRUCTIVE=true.');
 if(patch.trim()){
   await sql(clone.toString(),patch);
 }
 const post=run(['migrate','diff','--from-url',clone.toString(),'--to-schema-datamodel','prisma/schema.prisma','--script']);if(post.status!==0)throw new Error(post.stderr||post.stdout);
 const remaining=(post.stdout||'').trim();writeFileSync(`${out}/post-adoption-schema-diff.sql`,remaining);
 if(remaining)throw new Error('Adoption patch applied but schema is still different; inspect post-adoption-schema-diff.sql');
 const after=await q(clone.toString(),`select (select count(*) from "user") users,(select count(*) from "session") sessions,(select count(*) from "account") accounts`);
 writeFileSync(`${out}/rehearsal-result.json`,JSON.stringify({passed:true,destructive,countsBefore:counts.rows[0],countsAfter:after.rows[0]},null,2));
 console.log('[adoption-rehearsal] PASS — real legacy clone was reconciled to Prisma schema and re-diffed to empty; source DB was never mutated.');
}finally{await sql(admin.toString(),`DROP DATABASE IF EXISTS "${tempDb}" WITH (FORCE)`).catch(()=>{});}
