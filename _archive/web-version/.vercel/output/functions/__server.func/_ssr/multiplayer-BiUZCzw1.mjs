import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-DcaG3iKu.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Cmpo3hKv.mjs";
import { t as getPrisma } from "./prisma-u55HPJ6Y.mjs";
import { t as consumeRateLimit } from "./rateLimit-BmPnMSIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/multiplayer-BiUZCzw1.js
async function audit(userId, eventType, payload, ipHash) {
	await getPrisma().auditEvent.create({ data: {
		userId,
		eventType: eventType.slice(0, 80),
		payloadJson: payload ?? {},
		ipHash: ipHash?.slice(0, 128)
	} });
}
var roomId = () => crypto.randomUUID();
var clean$1 = (v, max) => v.trim().slice(0, max);
async function createRoom(userId, displayName, mode, maxPlayers = 4) {
	if (!(await consumeRateLimit(userId, "room_create", 10, 60)).allowed) throw new Error("rate_limited");
	const id = roomId();
	await getPrisma().$transaction(async (tx) => {
		await tx.multiplayerRoom.create({ data: {
			roomId: id,
			hostUserId: userId,
			mode: clean$1(mode || "classic", 40),
			maxPlayers: Math.max(2, Math.min(8, Math.floor(maxPlayers || 4))),
			status: "open",
			stateJson: {}
		} });
		await tx.multiplayerMember.create({ data: {
			roomId: id,
			userId,
			displayName: clean$1(displayName || "Traveler", 40) || "Traveler",
			role: "host",
			lastSeenAt: /* @__PURE__ */ new Date()
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
			const room = await tx.multiplayerRoom.findUnique({ where: { roomId: id } });
			if (!room || room.status !== "open") throw new Error("room_unavailable");
			const members = await tx.multiplayerMember.count({ where: { roomId: id } });
			const existing = await tx.multiplayerMember.findUnique({ where: { roomId_userId: {
				roomId: id,
				userId
			} } });
			if (!existing && members >= room.maxPlayers) throw new Error("room_full");
			if (existing) await tx.multiplayerMember.update({
				where: { roomId_userId: {
					roomId: id,
					userId
				} },
				data: {
					displayName: clean$1(displayName || "Traveler", 40) || "Traveler",
					lastSeenAt: /* @__PURE__ */ new Date()
				}
			});
			else await tx.multiplayerMember.create({ data: {
				roomId: id,
				userId,
				displayName: clean$1(displayName || "Traveler", 40) || "Traveler",
				role: "player",
				lastSeenAt: /* @__PURE__ */ new Date()
			} });
			if (await tx.multiplayerMember.count({ where: { roomId: id } }) >= 2) await tx.multiplayerRoom.update({
				where: { roomId: id },
				data: { status: "playing" }
			});
			return true;
		}, { isolationLevel: "Serializable" });
	} catch (error) {
		if (error?.code === "P2034" && attempt < 2) continue;
		throw error;
	}
	throw new Error("room_join_conflict");
}
async function getRoom(id) {
	const db = getPrisma();
	const room = await db.multiplayerRoom.findUnique({ where: { roomId: id } });
	if (!room) return null;
	const members = await db.multiplayerMember.findMany({
		where: { roomId: id },
		orderBy: { joinedAt: "asc" }
	});
	return {
		roomId: room.roomId,
		hostUserId: room.hostUserId,
		mode: room.mode,
		state: room.stateJson,
		status: room.status,
		maxPlayers: room.maxPlayers,
		members: members.map((m) => ({
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
var quickMatchMultiplayer_createServerFn_handler = createServerRpc({
	id: "1ab126d4b4f21473c6c71fd3895cd56a2fdba4037512e843f3171f2fe9368e5f",
	name: "quickMatchMultiplayer",
	filename: "src/lib/server/multiplayer.ts"
}, (opts) => quickMatchMultiplayer.__executeServer(opts));
var quickMatchMultiplayer = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(quickMatchMultiplayer_createServerFn_handler, async ({ context }) => {
	const rows = await (await getSql()).query("select r.room_id from multiplayer_rooms r where r.status = 'open' and exists (select 1 from multiplayer_members m where m.room_id = r.room_id and m.user_id <> $1 and m.last_seen_at >= now() - interval '2 minutes') order by r.updated_at desc limit 1", [context.userId]);
	if (rows[0]?.room_id) try {
		return {
			ok: true,
			kind: "human",
			room: await joinRoom(context.userId, "Traveler", rows[0].room_id)
		};
	} catch {}
	return {
		ok: true,
		kind: "waiting",
		room: await getRoom(await createRoom(context.userId, "Traveler", "classic", 2))
	};
});
var heartbeatMultiplayerRoom_createServerFn_handler = createServerRpc({
	id: "30cdc3d6b014f834542fab2be41d2bffa59815656727d060a199154c71b90160",
	name: "heartbeatMultiplayerRoom",
	filename: "src/lib/server/multiplayer.ts"
}, (opts) => heartbeatMultiplayerRoom.__executeServer(opts));
var heartbeatMultiplayerRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ roomId: clean(d.roomId, 80) })).handler(heartbeatMultiplayerRoom_createServerFn_handler, async ({ context, data }) => {
	await getPrisma().multiplayerMember.updateMany({
		where: {
			roomId: data.roomId,
			userId: context.userId
		},
		data: { lastSeenAt: /* @__PURE__ */ new Date() }
	});
	return { ok: true };
});
var sendMultiplayerRoomMessage_createServerFn_handler = createServerRpc({
	id: "b5d203d1dccdc4511217037afc7647adf01f68b90d2db32bc4980d97dda4806a",
	name: "sendMultiplayerRoomMessage",
	filename: "src/lib/server/multiplayer.ts"
}, (opts) => sendMultiplayerRoomMessage.__executeServer(opts));
var sendMultiplayerRoomMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	roomId: clean(d.roomId, 80),
	message: clean(d.message, 160)
})).handler(sendMultiplayerRoomMessage_createServerFn_handler, async ({ context, data }) => {
	if (!data.message) return {
		ok: false,
		error: "message_required"
	};
	const db = getPrisma();
	const room = await db.multiplayerRoom.findUnique({ where: { roomId: data.roomId } });
	if (!room) return {
		ok: false,
		error: "room_not_found"
	};
	if (!await db.multiplayerMember.findUnique({ where: { roomId_userId: {
		roomId: data.roomId,
		userId: context.userId
	} } })) return {
		ok: false,
		error: "not_room_member"
	};
	const state = room.stateJson && typeof room.stateJson === "object" ? room.stateJson : {};
	const messages = Array.isArray(state.messages) ? state.messages.slice(-49) : [];
	messages.push({
		id: crypto.randomUUID(),
		userId: context.userId,
		message: data.message,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	await db.multiplayerRoom.update({
		where: { roomId: data.roomId },
		data: { stateJson: {
			...state,
			messages
		} }
	});
	return { ok: true };
});
var updateMultiplayerScore_createServerFn_handler = createServerRpc({
	id: "f3c5e9aaa127ec514f1ea5493526ed3212b2b4455e17ab5e3b442432b55c459c",
	name: "updateMultiplayerScore",
	filename: "src/lib/server/multiplayer.ts"
}, (opts) => updateMultiplayerScore.__executeServer(opts));
var updateMultiplayerScore = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	roomId: clean(d.roomId, 80),
	score: Math.max(0, Math.min(999, Math.floor(Number(d.score) || 0)))
})).handler(updateMultiplayerScore_createServerFn_handler, async ({ context, data }) => {
	const db = getPrisma();
	const room = await db.multiplayerRoom.findUnique({ where: { roomId: data.roomId } });
	if (!room) return {
		ok: false,
		error: "room_not_found"
	};
	const state = room.stateJson && typeof room.stateJson === "object" ? room.stateJson : {};
	const scores = state.scores && typeof state.scores === "object" ? state.scores : {};
	scores[context.userId] = data.score;
	await db.multiplayerRoom.update({
		where: { roomId: data.roomId },
		data: { stateJson: {
			...state,
			scores,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		} }
	});
	return {
		ok: true,
		scores
	};
});
//#endregion
export { createMultiplayerRoom_createServerFn_handler, getMultiplayerRoom_createServerFn_handler, heartbeatMultiplayerRoom_createServerFn_handler, joinMultiplayerRoom_createServerFn_handler, quickMatchMultiplayer_createServerFn_handler, sendMultiplayerRoomMessage_createServerFn_handler, updateMultiplayerScore_createServerFn_handler };
