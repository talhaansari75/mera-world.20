import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getPrisma, getSql } from "@/lib/db";
import { createRoom, joinRoom, getRoom } from "@/lib/multiplayer/roomService";
import { botForCountry, botDisplayName } from "@/lib/multiplayer/bots";
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
    const sql = await getSql();
    const rows = await sql.query<{ room_id: string }>(
      "select r.room_id from multiplayer_rooms r where r.status = 'open' and exists (select 1 from multiplayer_members m where m.room_id = r.room_id and m.user_id <> $1 and m.last_seen_at >= now() - interval '2 minutes') order by r.updated_at desc limit 1",
      [context.userId],
    );
    if (rows[0]?.room_id) {
      try {
        const room = await joinRoom(context.userId, "Traveler", rows[0].room_id);
        return { ok: true as const, kind: "human" as const, room };
      } catch {}
    }
    const waitingRoomId = await createRoom(context.userId, "Traveler", "classic", 2);
    return { ok: true as const, kind: "waiting" as const, room: await getRoom(waitingRoomId) };
  });

export const fillMultiplayerBot = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { roomId: string; countryCode?: string }) => ({ roomId: clean(d.roomId, 80), countryCode: clean(d.countryCode || "PK", 2).toUpperCase() || "PK" }))
  .handler(async ({ context, data }) => {
    const db = getPrisma();
    const bot = botForCountry(data.countryCode, Date.now());
    return db.$transaction(async (tx: any) => {
      const room = await tx.multiplayerRoom.findUnique({ where: { roomId: data.roomId } });
      if (!room || room.status !== "open") return { ok: false as const, error: "room_unavailable" };
      const member = await tx.multiplayerMember.findUnique({ where: { roomId_userId: { roomId: data.roomId, userId: context.userId } } });
      if (!member) return { ok: false as const, error: "not_room_member" };
      const count = await tx.multiplayerMember.count({ where: { roomId: data.roomId } });
      if (count >= 2) return { ok: true as const, kind: "human" as const };
      const botId = "bot:" + crypto.randomUUID();
      await tx.multiplayerMember.create({ data: {
        roomId: data.roomId, userId: botId, displayName: botDisplayName(bot, Date.now()),
        role: "bot", countryCode: bot.countryCode, isBot: true, avatarId: bot.avatar,
        botProfileId: bot.id + "-" + Date.now().toString(36), botSkill: bot.skill, ready: true, lastSeenAt: new Date()
      } });
      await tx.multiplayerRoom.update({ where: { roomId: data.roomId }, data: { status: "playing" } });
      return { ok: true as const, kind: "bot" as const, displayName: botDisplayName(bot, Date.now()), countryCode: bot.countryCode };
    }, { isolationLevel: "Serializable" });
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
    const member = await db.multiplayerMember.findUnique({ where: { roomId_userId: { roomId: data.roomId, userId: context.userId } } });
    if (!member) return { ok: false as const, error: "not_room_member" };
    const state = room.stateJson && typeof room.stateJson === "object" ? room.stateJson as Record<string, unknown> : {};
    const messages = Array.isArray(state.messages) ? state.messages.slice(-49) : [];
    messages.push({ id: crypto.randomUUID(), userId: context.userId, message: data.message, createdAt: new Date().toISOString() });
    // @ts-ignore
    await db.multiplayerRoom.update({ where: { roomId: data.roomId }, data: { stateJson: { ...state, messages } } });
    return { ok: true as const };
  });

export const updateMultiplayerScore = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { roomId: string; score: number }) => ({
    roomId: clean(d.roomId, 80),
    score: Math.max(0, Math.min(999, Math.floor(Number(d.score) || 0))),
  }))
  .handler(async ({ context, data }) => {
    const db = getPrisma();
    // @ts-ignore
    const room = await db.multiplayerRoom.findUnique({ where: { roomId: data.roomId } });
    if (!room) return { ok: false as const, error: "room_not_found" };
    const state = room.stateJson && typeof room.stateJson === "object" ? room.stateJson as Record<string, unknown> : {};
    const scores = state.scores && typeof state.scores === "object" ? state.scores as Record<string, number> : {};
    scores[context.userId] = data.score;
    // @ts-ignore
    await db.multiplayerRoom.update({ where: { roomId: data.roomId }, data: { stateJson: { ...state, scores, updatedAt: new Date().toISOString() } } });
    return { ok: true as const, scores };
  });
