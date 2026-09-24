#!/usr/bin/env node
/** Operational recovery for stuck idempotency leases. Never auto-steals a lease. */
import { PrismaClient } from '@prisma/client';
const db=new PrismaClient();
try{
 const age=Number(process.env.IDEMPOTENCY_STALE_MINUTES||60); if(!Number.isFinite(age)||age<5) throw new Error('IDEMPOTENCY_STALE_MINUTES must be >= 5');
 const stale=await db.idempotencyKey.findMany({where:{status:'pending',lockedAt:{lt:new Date(Date.now()-age*60000)}},select:{userId:true,key:true,operation:true,lockedAt:true},take:100});
 console.log(JSON.stringify({staleCount:stale.length,stale},null,2));
 if(stale.length && process.env.IDEMPOTENCY_RECOVERY_APPROVED!=='true') throw new Error('Stale leases found. Review the list and set IDEMPOTENCY_RECOVERY_APPROVED=true only in an explicit operational recovery window. No automatic lease stealing is performed.');
 if(stale.length && process.env.IDEMPOTENCY_RECOVERY_KEY){
   const target=stale.find(x=>`${x.userId}:${x.key}`===process.env.IDEMPOTENCY_RECOVERY_KEY); if(!target) throw new Error('Requested recovery key is not in the stale set');
   await db.idempotencyKey.update({where:{userId_key:{userId:target.userId,key:target.key}},data:{lockedAt:null}});
   console.log(`[idempotency-recovery] PASS — explicitly unlocked ${process.env.IDEMPOTENCY_RECOVERY_KEY}`);
 } else console.log('[idempotency-recovery] PASS — inventory only; no lease changed.');
} finally { await db.$disconnect(); }
