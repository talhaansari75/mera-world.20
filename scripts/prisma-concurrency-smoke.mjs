#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
const db=new PrismaClient();
const stamp=`conc_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
const uid=`${stamp}_owner`, email=`${uid}@example.invalid`, errors=[];
const mustOne=async(label, promises)=>{const results=await Promise.allSettled(promises);const ok=results.filter(x=>x.status==='fulfilled').length;if(ok!==1)throw new Error(`${label}: expected exactly one winner, got ${ok}`);return results;};
async function duplicateSignup(){await mustOne('duplicate signup',Array.from({length:20},(_,i)=>db.user.create({data:{id:`${stamp}_signup_${i}`,name:'Race',email,emailVerified:false}})));}
async function duplicatePurchase(){const ext=`ext_${stamp}`;const results=await Promise.allSettled(Array.from({length:20},()=>db.purchaseReceipt.create({data:{userId:uid,provider:'test',externalId:ext,productId:'sku_same',amountMinor:100,currency:'USD',status:'verified',rawJson:{race:true}}})));if(results.filter(x=>x.status==='fulfilled').length!==1)throw new Error('duplicate purchase was not uniquely serialized');}
async function concurrentSave(){await db.playerSave.create({data:{userId:uid,saveJson:'{}',version:1,revision:1n}});const results=await Promise.allSettled(Array.from({length:20},(_,i)=>db.playerSave.updateMany({where:{userId:uid,revision:1n},data:{saveJson:JSON.stringify({winner:i}),revision:{increment:1n}}})));if(results.filter(x=>x.status==='fulfilled'&&x.value.count===1).length!==1)throw new Error('optimistic save race had more than one winner');}
async function leaderboardRace(){await Promise.all(Array.from({length:50},(_,i)=>db.leaderboardScore.create({data:{userId:uid,displayName:'Race',board:`${stamp}_board`,score:i}})));const n=await db.leaderboardScore.count({where:{userId:uid,board:`${stamp}_board`}});if(n!==50)throw new Error(`leaderboard race lost rows: ${n}`);}
async function idempotencyRace(){await mustOne('idempotency ownership',Array.from({length:20},()=>db.idempotencyKey.create({data:{userId:uid,key:`${stamp}:once`,operation:'test.once',responseJson:{},status:'pending',lockedAt:new Date()}})));}
async function sessionRace(){await mustOne('session token uniqueness',Array.from({length:20},(_,i)=>db.session.create({data:{id:`${stamp}_session_${i}`,token:`tok_${stamp}`,expiresAt:new Date(Date.now()+3600000),updatedAt:new Date(),userId:uid}})));}
async function entitlementRace(){await Promise.all(Array.from({length:20},()=>db.entitlement.upsert({where:{userId_productId:{userId:uid,productId:'sku_same'}},create:{userId:uid,productId:'sku_same',active:true,source:'purchase'},update:{active:true,source:'purchase'}})));const n=await db.entitlement.count({where:{userId:uid,productId:'sku_same'}});if(n!==1)throw new Error('entitlement race created duplicates');}
async function dailyRace(){await Promise.all(Array.from({length:20},(_,i)=>db.dailyResult.upsert({where:{userId_dayKey:{userId:uid,dayKey:'2099-01-01'}},create:{userId:uid,dayKey:'2099-01-01',score:i,timeMs:1000-i,stars:1,displayName:'Race'},update:{score:{increment:1}}})));const n=await db.dailyResult.count({where:{userId:uid,dayKey:'2099-01-01'}});if(n!==1)throw new Error('daily result race created duplicates');}
try{
 await db.user.create({data:{id:uid,name:'Race',email,emailVerified:false}});
 await duplicateSignup(); await duplicatePurchase(); await concurrentSave(); await leaderboardRace(); await idempotencyRace(); await sessionRace(); await entitlementRace(); await dailyRace();
 console.log('[concurrency] PASS — duplicate signup/purchase, save CAS, leaderboard, idempotency, session, entitlement and daily-result races verified.');
}catch(e){console.error('[concurrency] FAIL',e?.message||e);process.exitCode=1}
finally{await db.user.deleteMany({where:{id:uid}}).catch(()=>{});await db.user.deleteMany({where:{email}}).catch(()=>{});await db.$disconnect();}
