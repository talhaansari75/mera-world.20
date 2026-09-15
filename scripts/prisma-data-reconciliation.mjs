#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
const db=new PrismaClient();
const models=['user','session','account','verification','playerSave','leaderboardScore','dailyResult','idempotencyKey','rateLimitBucket','auditEvent','gameplayEvent','multiplayerRoom','multiplayerMember','moderationReport','purchaseReceipt','gameSessionV5','rewardLedgerV5','analyticsEventV5','multiplayerRoomV5','paymentEventV5','auditEventV5','moderationCaseV5','entitlement','adminAuditNote','creatorPuzzle','creatorReview','pushSubscription','creatorProfile','role','permission','rolePermission','userRole'];
const label=process.env.PRISMA_RECONCILIATION_LABEL||'current'; const out=`artifacts/prisma-adoption/full-data-reconciliation-${label}.json`; await mkdir('artifacts/prisma-adoption',{recursive:true});
const result={generatedAt:new Date().toISOString(),tables:{}};
for(const model of models){const delegate=db[model];if(!delegate)throw new Error(`Missing Prisma delegate: ${model}`);const rows=await delegate.findMany();const canonical=rows.map(r=>JSON.stringify(r,(_,v)=>typeof v==='bigint'?`${v}n`:v)).sort();result.tables[model]={count:rows.length,sha256:createHash('sha256').update(canonical.join('\n')).digest('hex')};}
await writeFile(out,JSON.stringify(result,null,2));
const baseline=process.env.PRISMA_RECONCILIATION_BASELINE;
if(baseline){const before=JSON.parse(await readFile(baseline,'utf8'));const changed=[];for(const [name,b] of Object.entries(before.tables)){const a=result.tables[name];if(!a||a.count!==b.count||a.sha256!==b.sha256)changed.push(`${name}: before ${b.count}/${b.sha256} after ${a?.count}/${a?.sha256}`)}if(changed.length){console.error('[reconcile] FAIL — data changed during migration:\n'+changed.join('\n'));process.exitCode=1}else console.log('[reconcile] PASS — full table count/hash reconciliation is identical.');}
else console.log(`[reconcile] PASS — ${out}`);
await db.$disconnect();
