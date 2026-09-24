#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
const db=new PrismaClient(); const errors=[];
const currencies=new Set(['USD','EUR','GBP','PKR']);
const statuses={purchase:['pending','verified','failed','refunded'],room:['open','playing','closed'],member:['host','player']};
const bad=(name,n)=>{if(n)errors.push(`${name}: ${n} invalid records`)};
try{
 bad('purchase status',await db.purchaseReceipt.count({where:{NOT:{status:{in:{...statuses.purchase}}}}}));
 bad('purchase currency',await db.purchaseReceipt.count({where:{NOT:{currency:{in:['USD','EUR','GBP','PKR']}}}}));
 bad('room status',await db.multiplayerRoom.count({where:{NOT:{status:{in:statuses.room}}}}));
 bad('room maxPlayers',await db.multiplayerRoom.count({where:{OR:[{maxPlayers:{lt:2}},{maxPlayers:{gt:8}}]}}));
 bad('member role',await db.multiplayerMember.count({where:{NOT:{role:{in:statuses.member}}}}));
 bad('creator rating',await db.creatorReview.count({where:{OR:[{rating:{lt:1}},{rating:{gt:5}}]}}));
 bad('daily stars',await db.dailyResult.count({where:{OR:[{stars:{lt:0}},{stars:{gt:3}}]}}));
 bad('negative purchase amount',await db.purchaseReceipt.count({where:{amountMinor:{lt:0}}}));
 if(errors.length){console.error('[semantic-verify] FAIL\n'+errors.join('\n'));process.exit(1)}
 console.log('[semantic-verify] PASS');
}finally{await db.$disconnect()}
