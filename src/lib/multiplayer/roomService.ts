
import { getPrisma } from "@/lib/db";
import { audit } from "@/lib/server/v3/audit";
import { consumeRateLimit } from "@/lib/server/v3/rateLimit";
const roomId=()=>crypto.randomUUID();

export async function createRoom(userId:string,displayName:string,mode:string,maxPlayers=4){
  const limited=await consumeRateLimit(userId,"room_create",10,60);
  if(!limited.allowed)throw new Error("rate_limited");
  const id=roomId();
  await getPrisma().$transaction(async tx=>{
    await tx.multiplayerRoom.create({data:{roomId:id,hostUserId:userId,mode:mode.slice(0,40),maxPlayers:Math.max(2,Math.min(8,maxPlayers)),members:{create:{userId,displayName:displayName.slice(0,40),role:"host"}}}});
  });
  await audit(userId,"room.created",{roomId:id,mode});
  return id;
}

export async function joinRoom(userId:string,displayName:string,id:string){
  const db=getPrisma();
  for(let attempt=0;attempt<3;attempt++){
    try{
      return await db.$transaction(async tx=>{
        const room=await tx.multiplayerRoom.findUnique({where:{roomId:id},include:{_count:{select:{members:true}}}});
        if(!room||room.status!=="open")throw new Error("room_unavailable");
        if(room._count.members>=room.maxPlayers)throw new Error("room_full");
        await tx.multiplayerMember.upsert({where:{roomId_userId:{roomId:id,userId}},create:{roomId:id,userId,displayName:displayName.slice(0,40)},update:{lastSeenAt:new Date()}});
        return tx.multiplayerRoom.findUnique({where:{roomId:id},include:{members:{orderBy:{joinedAt:"asc"}}}}).then(formatRoom);
      },{isolationLevel:"Serializable",maxWait:5000,timeout:10000});
    }catch(error){
      if ((error as { code?: string })?.code === "P2034" && attempt < 2) continue;
      throw error;
    }
  }
  throw new Error("room_join_conflict");
}
export async function getRoom(id:string){return formatRoom(await getPrisma().multiplayerRoom.findUnique({where:{roomId:id},include:{members:{orderBy:{joinedAt:"asc"}}}}))}
type RoomWithMembers = { roomId:string; hostUserId:string; mode:string; stateJson:unknown; status:string; maxPlayers:number; members:Array<{ userId:string; displayName:string; role:string; }>; };
function formatRoom(room: RoomWithMembers | null){
  if(!room)return null;
  return {roomId:room.roomId,hostUserId:room.hostUserId,mode:room.mode,state:room.stateJson,status:room.status,maxPlayers:room.maxPlayers,members:room.members.map(m=>({userId:m.userId,displayName:m.displayName,role:m.role}))};
}
