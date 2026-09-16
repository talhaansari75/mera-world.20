import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
import { t as getPrisma } from "./prisma-6RpAAqVw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboard-DoERalJ9.js
var BOARDS = /* @__PURE__ */ new Set([
	"stars",
	"daily",
	"words"
]);
var getLeaderboard_createServerFn_handler = createServerRpc({
	id: "da7c811256b020c57ac9eb1f7f3cc8354790bb23df3df0e1b611c40f89c82d3f",
	name: "getLeaderboard",
	filename: "src/lib/server/leaderboard.ts"
}, (opts) => getLeaderboard.__executeServer(opts));
var getLeaderboard = createServerFn({ method: "GET" }).validator((board) => BOARDS.has(board) ? board : "stars").handler(getLeaderboard_createServerFn_handler, async ({ data: board }) => getPrisma().leaderboardScore.findMany({
	where: { board },
	orderBy: [{ score: "desc" }, { createdAt: "asc" }],
	take: 25,
	select: {
		displayName: true,
		score: true,
		createdAt: true
	}
}).then((rows) => rows.map((r) => ({
	...r,
	createdAt: r.createdAt.toISOString()
}))));
var submitScore_createServerFn_handler = createServerRpc({
	id: "386132aadfcf0d2dd473368107b506023d01c0217383a58a7358f4f1a586b5d3",
	name: "submitScore",
	filename: "src/lib/server/leaderboard.ts"
}, (opts) => submitScore.__executeServer(opts));
var submitScore = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	sessionId: String(d.sessionId ?? "").slice(0, 64),
	board: BOARDS.has(d.board) ? d.board : "stars"
})).handler(submitScore_createServerFn_handler, async ({ context, data }) => {
	const s = await getPrisma().gameSessionV5.findUnique({ where: { id: data.sessionId } });
	if (!s || s.userId !== context.userId || s.status !== "completed") return {
		ok: false,
		error: "Only a completed verified gameplay session can enter the leaderboard."
	};
	return {
		ok: true,
		message: "Verified result already recorded by the server."
	};
});
var submitDaily_createServerFn_handler = createServerRpc({
	id: "e595fb0c1f64001fbf0c680adcac401918332ca64da5f83bfc9edc5a8b9ba42c",
	name: "submitDaily",
	filename: "src/lib/server/leaderboard.ts"
}, (opts) => submitDaily.__executeServer(opts));
var submitDaily = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ sessionId: String(d.sessionId ?? "").slice(0, 64) })).handler(submitDaily_createServerFn_handler, async ({ context, data }) => {
	const s = await getPrisma().gameSessionV5.findUnique({ where: { id: data.sessionId } });
	if (!s || s.userId !== context.userId || s.status !== "completed") return {
		ok: false,
		error: "Only a completed verified daily session can enter the leaderboard."
	};
	return {
		ok: true,
		message: "Verified daily result already recorded by the server."
	};
});
var getDailyBoard_createServerFn_handler = createServerRpc({
	id: "e201e4b1ab6c9d61fd78aacea19e6952286bf36c09959c57d9131b0180866b0b",
	name: "getDailyBoard",
	filename: "src/lib/server/leaderboard.ts"
}, (opts) => getDailyBoard.__executeServer(opts));
var getDailyBoard = createServerFn({ method: "GET" }).validator((day) => String(day ?? "").slice(0, 16)).handler(getDailyBoard_createServerFn_handler, async ({ data: day }) => getPrisma().dailyResult.findMany({
	where: { dayKey: day },
	orderBy: [{ score: "desc" }, { timeMs: "asc" }],
	take: 25,
	select: {
		displayName: true,
		score: true,
		timeMs: true,
		stars: true
	}
}));
//#endregion
export { getDailyBoard_createServerFn_handler, getLeaderboard_createServerFn_handler, submitDaily_createServerFn_handler, submitScore_createServerFn_handler };
