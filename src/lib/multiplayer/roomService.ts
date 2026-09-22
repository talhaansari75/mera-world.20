import { getPrisma } from "@/lib/db";
import { audit } from "@/lib/server/v3/audit";
import { consumeRateLimit } from "@/lib/server/v3/rateLimit";

const roomId = () => crypto.randomUUID();
const clean = (v: string, max: number) => v.trim().slice(0, max);

export async function createRoom(userId: string, displayName: string, mode: string, maxPlayers = 4) {
  const limited = await consumeRateLimit(userId, "room_create", 10, 60);
  if (!limited.allowed) throw new Error("rate_limited");

  const id = roomId();
  const db = getPrisma();
  await db.$transaction(async (tx: any) => {
    await tx.multiplayerRoom.create({
      data: {
        roomId: id,
        hostUserId: userId,
        mode: clean(mode || "classic", 40),
        maxPlayers: Math.max(2, Math.min(8, Math.floor(maxPlayers || 4))),
        status: "open",
        stateJson: {},
      },
    });
    await tx.multiplayerMember.create({
      data: {
        roomId: id,
        userId,
        displayName: clean(displayName || "Traveler", 40) || "Traveler",
        role: "host",
        lastSeenAt: new Date(),
      },
    });
  });

  await audit(userId, "room.created", { roomId: id, mode });
  return id;
}

export async function joinRoom(userId: string, displayName: string, id: string) {
  const db = getPrisma();
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await db.$transaction(async (tx) => {
        const room = await tx.multiplayerRoom.findUnique({ where: { roomId: id } });
        if (!room || room.status !== "open") throw new Error("room_unavailable");

        const members = await tx.multiplayerMember.count({ where: { roomId: id } });
        const existing = await tx.multiplayerMember.findUnique({ where: { roomId_userId: { roomId: id, userId } } });

        if (!existing && members >= room.maxPlayers) throw new Error("room_full");

        if (existing) {
          await tx.multiplayerMember.update({
            where: { roomId_userId: { roomId: id, userId } },
            data: { displayName: clean(displayName || "Traveler", 40) || "Traveler", lastSeenAt: new Date() },
          });
        } else {
          await tx.multiplayerMember.create({
            data: {
              roomId: id,
              userId,
              displayName: clean(displayName || "Traveler", 40) || "Traveler",
              role: "player",
              lastSeenAt: new Date(),
            },
          });
        }

        const nextCount = await tx.multiplayerMember.count({ where: { roomId: id } });
        if (nextCount >= 2) {
          await tx.multiplayerRoom.update({ where: { roomId: id }, data: { status: "playing" } });
        }
        return true;
      }, { isolationLevel: "Serializable" });
      return getRoom(id);
    } catch (error) {
      if ((error as { code?: string })?.code === "P2034" && attempt < 2) continue;
      throw error;
    }
  }
  throw new Error("room_join_conflict");
}

export async function getRoom(id: string) {
  const db = getPrisma();
  const room = await db.multiplayerRoom.findUnique({ where: { roomId: id } });
  if (!room) return null;
  const members = await db.multiplayerMember.findMany({ where: { roomId: id }, orderBy: { joinedAt: "asc" } });
  return {
    roomId: room.roomId,
    hostUserId: room.hostUserId,
    mode: room.mode,
    state: room.stateJson,
    status: room.status,
    maxPlayers: room.maxPlayers,
    members: members.map((m: any) => ({ userId: m.userId, displayName: m.displayName, role: m.role })),
  };
}
