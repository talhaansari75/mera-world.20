import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";\nimport { getPrisma } from "@/lib/db";
import { createRoom, joinRoom, getRoom } from "@/lib/multiplayer/roomService";
const GAME_MODES = new Set(["classic","timed","survival","blitz","zen","daily","endless","fog","mirror","category","boss","rush","precision","hardcore","double_reward","no_hints","small_grid","giant_grid","reverse_only","diagonal","orthogonal","chaos","streak","treasure","nightmare","focus","speedrun","marathon","random_rules"]);

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

export const createMultiplayerRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { displayName: string; mode?: string; maxPlayers?: number }) => ({
    displayName: clean(d.displayName || "Traveler", 40) || "Traveler",
    mode: (()=>{const m=clean(d.mode || "classic", 40);return GAME_MODES.has(m)?m:"classic"})(),
    maxPlayers: Math.max(2, Math.min(8, Math.floor(Number(d.maxPlayers) || 4))),
  }))
  .handler(async ({ context, data }) => {
    try {
      const id = await createRoom(context.userId, data.displayName, data.mode, data.maxPlayers);
      return { ok: true as const, room: await getRoom(id) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "room_create_failed" };
    }
  });

export const joinMultiplayerRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { roomId: string; displayName: string }) => ({
    roomId: clean(d.roomId, 80),
    displayName: clean(d.displayName || "Traveler", 40) || "Traveler",
  }))
  .handler(async ({ context, data }) => {
    if (!data.roomId) return { ok: false as const, error: "room_id_required" };
    try {
      return { ok: true as const, room: await joinRoom(context.userId, data.displayName, data.roomId) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "room_join_failed" };
    }
  });

export const getMultiplayerRoom = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { roomId: string }) => ({ roomId: clean(d.roomId, 80) }))
  .handler(async ({ data }) => {
    if (!data.roomId) return { ok: false as const, error: "room_id_required" };
    const room = await getRoom(data.roomId);
    return room ? { ok: true as const, room } : { ok: false as const, error: "room_not_found" };
  });

    
export const quickMatchMultiplayer = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const db = getPrisma();
    // @ts-ignore - Prisma model is generated from the project's multiplayer schema.
    const room = await db.multiplayerRoom.findFirst({
      where: {
        status: "open",
        members: { some: { userId: { not: context.userId }, lastSeenAt: { gte: new Date(Date.now() - 120000) } } },
      },
      orderBy: { updatedAt: "desc" },
      include: { members: true },
    });
    if (room) {
      try {
        const joined = await joinRoom(context.userId, "Traveler", room.roomId);
        return { ok: true as const, kind: "human" as const, room: joined };
      } catch {
        // Another player may have filled the room between lookup and join.
      }
    }

    // No human opponent is available. The UI uses an explicitly disclosed
    // practice opponent rather than pretending a bot is a real person.
    return { ok: true as const, kind: "bot" as const, room: null };
  });

export const heartbeatMultiplayerRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { roomId: string }) => ({ roomId: clean(d.roomId, 80) }))
  .handler(async ({ context, data }) => {
    const db = getPrisma();
    // @ts-ignore
    await db.multiplayerMember.updateMany({ where: { roomId: data.roomId, userId: context.userId }, data: { lastSeenAt: new Date() } });
    return { ok: true as const };
  });

export const sendMultiplayerRoomMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { roomId: string; message: string }) => ({
    roomId: clean(d.roomId, 80),
    message: clean(d.message, 160),
  }))
  .handler(async ({ context, data }) => {
    if (!data.message) return { ok: false as const, error: "message_required" };
    const db = getPrisma();
    // @ts-ignore
    const room = await db.multiplayerRoom.findUnique({ where: { roomId: data.roomId } });
    if (!room) return { ok: false as const, error: "room_not_found" };
    const state = room.stateJson && typeof room.stateJson === "object" ? room.stateJson as Record<string, unknown> : {};
    const messages = Array.isArray(state.messages) ? state.messages.slice(-49) : [];
    messages.push({ id: crypto.randomUUID(), userId: context.userId, message: data.message, createdAt: new Date().toISOString() });
    // @ts-ignore
    await db.multiplayerRoom.update({ where: { roomId: data.roomId }, data: { stateJson: { ...state, messages } } });
    return { ok: true as const };
  });
