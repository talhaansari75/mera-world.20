#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
const db=new PrismaClient(); const errors=[];
try{
 const saves=await db.playerSave.findMany({select:{userId:true,saveJson:true},take:100000});
 for(const r of saves){if(r.saveJson===null||typeof r.saveJson!=='object')errors.push(`player_saves ${r.userId}: save_json must be JSON object/array`)}
 const puzzles=await db.creatorPuzzle.findMany({select:{id:true,wordsJson:true},take:100000});
 for(const r of puzzles){if(!Array.isArray(r.wordsJson)||r.wordsJson.length<3)errors.push(`creator_puzzles ${r.id}: words_json must be array with >=3 items`)}
 const rooms=await db.multiplayerRoom.findMany({select:{roomId:true,stateJson:true},take:100000});
 for(const r of rooms){if(r.stateJson===null||typeof r.stateJson!=='object')errors.push(`multiplayer_rooms ${r.roomId}: state_json must be JSON`)}
 if(errors.length){console.error('[json-verify] FAIL\n'+errors.slice(0,100).join('\n'));process.exit(1)}
 console.log('[json-verify] PASS');
}finally{await db.$disconnect()}
