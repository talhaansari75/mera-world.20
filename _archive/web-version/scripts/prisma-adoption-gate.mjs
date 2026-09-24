#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
const rehearsal=['artifacts/prisma-adoption/schema-diff.sql','artifacts/prisma-adoption/post-adoption-schema-diff.sql','artifacts/prisma-adoption/rehearsal-result.json'];
if(process.env.REHEARSAL_MODE==='true'){
 for(const p of rehearsal)if(!existsSync(p))throw new Error(`Missing adoption rehearsal artifact: ${p}`);
 const result=JSON.parse(readFileSync(rehearsal[2],'utf8'));if(result.passed!==true)throw new Error('Adoption rehearsal did not report passed=true');
 const remaining=readFileSync(rehearsal[1],'utf8').trim();if(remaining)throw new Error('Post-adoption schema diff is not empty');
 console.log('[adoption-gate] PASS — isolated legacy clone was reconciled and verified. No production approval granted.');process.exit(0);
}
const required=['artifacts/prisma-adoption/schema-diff.sql','artifacts/prisma-adoption/full-data-reconciliation.json'];
for(const p of required)if(!existsSync(p))throw new Error(`Missing adoption artifact: ${p}`);
const diff=readFileSync(required[0],'utf8').trim();
if(diff&&process.env.ALLOW_RECONCILIATION_PLAN!=='true')throw new Error('Schema differs. Review schema-diff.sql and rerun with ALLOW_RECONCILIATION_PLAN=true only after approval.');
if(process.env.BACKUP_RESTORE_VERIFIED!=='true')throw new Error('BACKUP_RESTORE_VERIFIED=true is required.');
if(process.env.DATA_RECONCILIATION_APPROVED!=='true')throw new Error('DATA_RECONCILIATION_APPROVED=true is required.');
console.log('[adoption-gate] PASS — explicit production adoption approvals are present.');
