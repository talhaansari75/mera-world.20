#!/usr/bin/env node
/** Backup gate: command must produce a concrete artifact which is then inspected. */
import { spawnSync } from 'node:child_process';
import { statSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const cmd=process.env.DATABASE_BACKUP_COMMAND?.trim();
const artifact=process.env.DATABASE_BACKUP_ARTIFACT?.trim();
if(!cmd||!artifact) throw new Error('DATABASE_BACKUP_COMMAND and DATABASE_BACKUP_ARTIFACT are required.');
const started=Date.now();
const r=spawnSync(cmd,{shell:true,stdio:'inherit'});
if(r.status!==0) process.exit(r.status??1);
if(!existsSync(artifact)) throw new Error(`Backup artifact not found: ${artifact}`);
const st=statSync(artifact); if(!st.isFile()||st.size<1024) throw new Error('Backup artifact is missing or suspiciously small.');
const sha256=createHash('sha256').update(readFileSync(artifact)).digest('hex');
const manifest={artifact,bytes:st.size,sha256,createdAt:new Date(st.mtimeMs).toISOString(),commandStartedAt:new Date(started).toISOString(),verifiedByArtifactCheck:true};
writeFileSync(`${artifact}.manifest.json`,JSON.stringify(manifest,null,2));
if(process.env.DATABASE_BACKUP_VERIFY_COMMAND){const v=spawnSync(process.env.DATABASE_BACKUP_VERIFY_COMMAND,{shell:true,stdio:'inherit'});if(v.status!==0)process.exit(v.status??1);}
console.log(`[prisma-backup] PASS — artifact ${artifact} (${st.size} bytes, sha256 ${sha256})`);
