#!/usr/bin/env node
/** Generate a reviewed Prisma migration for an existing database's additive drift. */
import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const url=process.env.DATABASE_URL?.trim(); if(!url) throw new Error("DATABASE_URL is required");
if(process.env.ALLOW_GENERATE_ADOPTION!=="true") throw new Error("Set ALLOW_GENERATE_ADOPTION=true after backup and schema review.");
const npx=process.platform==="win32"?"npx.cmd":"npx";
const r=spawnSync(npx,["prisma","migrate","diff","--from-url",url,"--to-schema-datamodel","prisma/schema.prisma","--script"],{encoding:"utf8"});
if(r.status!==0){console.error(r.stdout||r.stderr);process.exit(r.status||1)}
const sql=(r.stdout||"").trim();
if(!sql){console.log("[prisma-adoption] No schema changes detected.");process.exit(0)}
if(/DROP TABLE|DROP COLUMN|DROP INDEX|DROP CONSTRAINT|ALTER COLUMN .* TYPE|RENAME COLUMN/i.test(sql)) throw new Error("Destructive drift detected. Create a separately reviewed migration; automatic adoption refuses it.");
const stamp=new Date().toISOString().replace(/[-:TZ.]/g,"").slice(0,14); const dir=`prisma/migrations/${stamp}_adoption`;
mkdirSync(dir,{recursive:true}); writeFileSync(`${dir}/migration.sql`,sql+"\n");
console.log(`[prisma-adoption] Generated ${dir}/migration.sql. Review it, commit it, then run prisma migrate deploy.`);
