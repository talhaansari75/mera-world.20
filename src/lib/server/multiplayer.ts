import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
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
