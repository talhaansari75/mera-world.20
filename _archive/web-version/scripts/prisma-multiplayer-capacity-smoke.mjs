#!/usr/bin/env node
import { Prisma, PrismaClient } from '@prisma/client';
const db=new PrismaClient(); const stamp=`cap_${Date.now()}`; const host=`${stamp}_host`; const roomId=`${stamp}_room`;
try{
 await db.user.create({data:{id:host,name:'Host',email:`${host}@example.invalid`,emailVerified:false}});
 await db.multiplayerRoom.create({data:{roomId,hostUserId:host,mode:'classic',maxPlayers:2,members:{create:{userId:host,displayName:'Host',role:'host'}}}});
 const users=[]; for(let i=0;i<8;i++){const id=`${stamp}_${i}`; users.push(id); await db.user.create({data:{id,name:`P${i}`,email:`${id}@example.invalid`,emailVerified:false}})}
 const joins=await Promise.allSettled(users.map(userId=>db.$transaction(async tx=>{
   const room=await tx.multiplayerRoom.findUnique({where:{roomId},include:{_count:{select:{members:true}}}}); if(!room)throw new Error('missing_room');
   if(room._count.members>=room.maxPlayers)throw new Error('room_full');
   await tx.multiplayerMember.create({data:{roomId,userId,displayName:userId,role:'player'}});
 },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable,maxWait:5000,timeout:10000})));
 const count=await db.multiplayerMember.count({where:{roomId}}); if(count>2)throw new Error(`capacity exceeded: ${count}`);
 await db.multiplayerMember.deleteMany({where:{roomId}}); await db.multiplayerRoom.delete({where:{roomId}}); await db.user.deleteMany({where:{id:{startsWith:stamp}}});
 console.log(`[multiplayer-capacity] PASS — final member count ${count} <= maxPlayers=2; rejected joins=${joins.filter(x=>x.status==='rejected').length}`);
}catch(e){console.error('[multiplayer-capacity] FAIL',e?.message||e);process.exitCode=1}finally{await db.$disconnect()}
