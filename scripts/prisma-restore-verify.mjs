#!/usr/bin/env node
/** Verify a PostgreSQL backup by actually inspecting/restoring it when tooling is available. */
import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
const artifact=process.env.DATABASE_BACKUP_ARTIFACT?.trim(); const restoreDb=process.env.DATABASE_RESTORE_VERIFY_URL?.trim();
if(!artifact||!existsSync(artifact)) throw new Error('DATABASE_BACKUP_ARTIFACT must point to a real backup artifact.');
if(!restoreDb) throw new Error('DATABASE_RESTORE_VERIFY_URL is required; restore verification cannot be reduced to hashing.');
const kind=process.env.DATABASE_BACKUP_FORMAT||'custom';
if(kind==='custom'){
 const list=spawnSync('pg_restore',['--list',artifact],{encoding:'utf8'}); if(list.status!==0) throw new Error(`pg_restore --list failed: ${list.stderr}`);
}
const restoreCmd=process.env.DATABASE_RESTORE_COMMAND?.trim();
if(!restoreCmd) throw new Error('DATABASE_RESTORE_COMMAND is required for isolated restore verification.');
const r=spawnSync(restoreCmd,{shell:true,stdio:'inherit'}); if(r.status!==0) process.exit(r.status??1);
const verify=process.env.DATABASE_RESTORE_VERIFY_COMMAND?.trim(); if(!verify) throw new Error('DATABASE_RESTORE_VERIFY_COMMAND is required after restore.');
const v=spawnSync(verify,{shell:true,stdio:'inherit'}); if(v.status!==0) process.exit(v.status??1);
console.log(`[restore-verify] PASS — restore verified for ${artifact} (${statSync(artifact).size} bytes).`);
