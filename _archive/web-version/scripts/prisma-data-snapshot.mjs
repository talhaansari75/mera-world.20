#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { PrismaClient } from '@prisma/client';
const db=new PrismaClient(); const dir='artifacts/prisma-adoption'; await mkdir(dir,{recursive:true});
const specs=[
 ['user',['id','email','updatedAt']],['account',['id','userId','providerId','accountId']],['playerSave',['userId','version','revision','updatedAt']],
 ['purchaseReceipt',['id','userId','provider','externalId','productId','amountMinor','currency','status']],['rewardLedgerV5',['id','userId','idempotencyKey']],
 ['creatorPuzzle',['id','userId','version','updatedAt']],['creatorReview',['id','puzzleId','userId','rating']],['entitlement',['userId','productId','active']]
];
const result={createdAt:new Date().toISOString(),tables:{}};
try{for(const [model,fields] of specs){const rows=await db[model].findMany({select:Object.fromEntries(fields.map(f=>[f,true]))});rows.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));const digest=createHash('sha256').update(JSON.stringify(rows,(_,v)=>typeof v==='bigint'?`${v}n`:v)).digest('hex');result.tables[model]={count:rows.length,sha256:digest};}await writeFile(`${dir}/data-snapshot.json`,JSON.stringify(result,null,2));console.log('[prisma-data-snapshot] PASS — critical-table count/hash snapshot written.');}finally{await db.$disconnect()}
