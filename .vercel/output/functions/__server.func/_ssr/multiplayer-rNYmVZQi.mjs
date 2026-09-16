import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
import { t as getPrisma } from "./prisma-6RpAAqVw.mjs";
import { Prisma } from "@prisma/client";
//#region node_modules/.nitro/vite/services/ssr/assets/multiplayer-rNYmVZQi.js
async function audit(userId, eventType, payload, ipHash) {
	await getPrisma().auditEvent.create({ data: {
		userId,
		eventType: eventType.slice(0, 80),
		payloadJson: payload ?? {},
		ipHash: ipHash?.slice(0, 128)
	} });
}
/**
* Database-backed distributed rate limiter. The counter mutation is atomic in
* PostgreSQL, so concurrent app instances cannot all observe the same stale
* count and exceed the configured limit.
*/
async function consumeRateLimit(subject, bucket, limit, windowSeconds) {
	const db = getPrisma();
	const safeLimit = Math.max(1, Math.floor(limit));
	const resetAt = new Date(Date.now() + Math.max(1, Math.floor(windowSeconds)) * 1e3);
	const row = (await db.$queryRaw`
    INSERT INTO rate_limit_buckets(subject,bucket,count,reset_at)
    VALUES (${subject},${bucket},1,${resetAt})
    ON CONFLICT (subject,bucket) DO UPDATE
      SET count = CASE
        WHEN rate_limit_buckets.reset_at <= now() THEN 1
        WHEN rate_limit_buckets.count < ${safeLimit} THEN rate_limit_buckets.count + 1
        ELSE rate_limit_buckets.count
      END,
      reset_at = CASE
        WHEN rate_limit_buckets.reset_at <= now() THEN ${resetAt}
        ELSE rate_limit_buckets.reset_at
      END
    RETURNING count, reset_at
  `)[0];
	const count = Number(row.count);
	return {
		allowed: count <= safeLimit,
		remaining: Math.max(0, safeLimit - count),
		resetAt: row.reset_at
	};
}
var roomId = () => crypto.randomUUID();
async function createRoom(userId, displayName, mode, maxPlayers = 4) {
	if (!(await consumeRateLimit(userId, "room_create", 10, 60)).allowed) throw new Error("rate_limited");
	const id = roomId();
	await getPrisma().$transaction(async (tx) => {
		await tx.multiplayerRoom.create({ data: {
			roomId: id,
			hostUserId: userId,
			mode: mode.slice(0, 40),
			maxPlayers: Math.max(2, Math.min(8, maxPlayers)),
			members: { create: {
				userId,
				displayName: displayName.slice(0, 40),
				role: "host"
			} }
		} });
	});
	await audit(userId, "room.created", {
		roomId: id,
		mode
	});
	return id;
}
async function joinRoom(userId, displayName, id) {
	const db = getPrisma();
	for (let attempt = 0; attempt < 3; attempt++) try {
		return await db.$transaction(async (tx) => {
			const room = await tx.multiplayerRoom.findUnique({
				where: { roomId: id },
				include: { _count: { select: { members: true } } }
			});
			if (!room || room.status !== "open") throw new Error("room_unavailable");
			if (room._count.members >= room.maxPlayers) throw new Error("room_full");
			await tx.multiplayerMember.upsert({
				where: { roomId_userId: {
					roomId: id,
					userId
				} },
				create: {
					roomId: id,
					userId,
					displayName: displayName.slice(0, 40)
				},
				update: { lastSeenAt: /* @__PURE__ */ new Date() }
			});
			return tx.multiplayerRoom.findUnique({
				where: { roomId: id },
				include: { members: { orderBy: { joinedAt: "asc" } } }
			}).then(formatRoom);
		}, {
			isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
			maxWait: 5e3,
			timeout: 1e4
		});
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034" && attempt < 2) continue;
		throw error;
	}
	throw new Error("room_join_conflict");
}
async function getRoom(id) {
	return formatRoom(await getPrisma().multiplayerRoom.findUnique({
		where: { roomId: id },
		include: { members: { orderBy: { joinedAt: "asc" } } }
	}));
}
function formatRoom(room) {
	if (!room) return null;
	return {
		roomId: room.roomId,
		hostUserId: room.hostUserId,
		mode: room.mode,
		state: room.stateJson,
		status: room.status,
		maxPlayers: room.maxPlayers,
		members: room.members.map((m) => ({
			userId: m.userId,
			displayName: m.displayName,
			role: m.role
		}))
	};
}
var GAME_MODES = /* @__PURE__ */ new Set([
	"classic",
	"timed",
	"survival",
	"blitz",
	"zen",
	"daily",
	"endless",
	"fog",
	"mirror",
	"category",
	"boss",
	"rush",
	"precision",
	"hardcore",
	"double_reward",
	"no_hints",
	"small_grid",
	"giant_grid",
	"reverse_only",
	"diagonal",
	"orthogonal",
	"chaos",
	"streak",
	"treasure",
	"nightmare",
	"focus",
	"speedrun",
	"marathon",
	"random_rules"
]);
var clean = (v, max) => String(v ?? "").trim().slice(0, max);
var createMultiplayerRoom_createServerFn_handler = createServerRpc({
	id: "cd09e5b6c0789d2b1cfcd03514df492467c7b0106c65aa45b71bfb259de1dae1",
	name: "createMultiplayerRoom",
	filename: "src/lib/server/multiplayer.ts"
}, (opts) => createMultiplayerRoom.__executeServer(opts));
var createMultiplayerRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	displayName: clean(d.displayName || "Traveler", 40) || "Traveler",
	mode: (() => {
		const m = clean(d.mode || "classic", 40);
		return GAME_MODES.has(m) ? m : "classic";
	})(),
	maxPlayers: Math.max(2, Math.min(8, Math.floor(Number(d.maxPlayers) || 4)))
})).handler(createMultiplayerRoom_createServerFn_handler, async ({ context, data }) => {
	try {
		return {
			ok: true,
			room: await getRoom(await createRoom(context.userId, data.displayName, data.mode, data.maxPlayers))
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "room_create_failed"
		};
	}
});
var joinMultiplayerRoom_createServerFn_handler = createServerRpc({
	id: "8e4309aecef59284eab42dbc5b72ae7a718dad8d24fd17bbe3811a78adf5749a",
	name: "joinMultiplayerRoom",
	filename: "src/lib/server/multiplayer.ts"
}, (opts) => joinMultiplayerRoom.__executeServer(opts));
var joinMultiplayerRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	roomId: clean(d.roomId, 80),
	displayName: clean(d.displayName || "Traveler", 40) || "Traveler"
})).handler(joinMultiplayerRoom_createServerFn_handler, async ({ context, data }) => {
	if (!data.roomId) return {
		ok: false,
		error: "room_id_required"
	};
	try {
		return {
			ok: true,
			room: await joinRoom(context.userId, data.displayName, data.roomId)
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : "room_join_failed"
		};
	}
});
var getMultiplayerRoom_createServerFn_handler = createServerRpc({
	id: "8791a086e1c78691cc5308a94779250d350215fe138b257f1849f5bcdbb4ac19",
	name: "getMultiplayerRoom",
	filename: "src/lib/server/multiplayer.ts"
}, (opts) => getMultiplayerRoom.__executeServer(opts));
var getMultiplayerRoom = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => ({ roomId: clean(d.roomId, 80) })).handler(getMultiplayerRoom_createServerFn_handler, async ({ data }) => {
	if (!data.roomId) return {
		ok: false,
		error: "room_id_required"
	};
	const room = await getRoom(data.roomId);
	return room ? {
		ok: true,
		room
	} : {
		ok: false,
		error: "room_not_found"
	};
});
//#endregion
export { createMultiplayerRoom_createServerFn_handler, getMultiplayerRoom_createServerFn_handler, joinMultiplayerRoom_createServerFn_handler };
