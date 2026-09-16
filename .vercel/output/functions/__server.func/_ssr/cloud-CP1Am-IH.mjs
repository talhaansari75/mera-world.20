import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
import { t as getPrisma } from "./prisma-6RpAAqVw.mjs";
import { l as validatePuzzleQuality, n as generatePuzzle } from "./generator-CBm_o8QT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cloud-CP1Am-IH.js
var clean = (v, max) => String(v ?? "").trim().slice(0, max);
var words = (v) => Array.isArray(v) ? [...new Set(v.map((x) => String(x).toUpperCase().replace(/[^A-Z]/g, "").slice(0, 14)).filter((x) => x.length >= 3))].slice(0, 12) : [];
var publishCreatorPuzzle_createServerFn_handler = createServerRpc({
	id: "2fcbaf9992b048b4a9641146bb0a1ab015eaacaa981e3cef2df4f6ea6d6c62e2",
	name: "publishCreatorPuzzle",
	filename: "src/lib/v25/creator/cloud.ts"
}, (opts) => publishCreatorPuzzle.__executeServer(opts));
var publishCreatorPuzzle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	id: clean(d.id, 80),
	title: clean(d.title, 48) || "Untitled Journey",
	category: clean(d.category, 32) || "creator",
	words: words(d.words)
})).handler(publishCreatorPuzzle_createServerFn_handler, async ({ context, data }) => {
	if (!data.id || data.words.length < 3) return {
		ok: false,
		error: "At least 3 valid words are required."
	};
	const puzzle = generatePuzzle({
		seed: 7001 + data.words.length,
		size: 12,
		wordCount: data.words.length,
		minLen: 3,
		maxLen: 14,
		dirs: [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, -1],
			[0, 1],
			[1, -1],
			[1, 0],
			[1, 1]
		],
		category: data.category,
		title: data.title
	});
	const quality = validatePuzzleQuality(puzzle, true);
	if (!quality.valid) return {
		ok: false,
		error: `Puzzle quality check failed: ${quality.errors.slice(0, 4).join(", ")}`
	};
	const db = getPrisma();
	const existing = await db.creatorPuzzle.findUnique({ where: { id: data.id } });
	if (existing && existing.userId !== context.userId) return {
		ok: false,
		error: "Puzzle belongs to another creator."
	};
	const row = await db.creatorPuzzle.upsert({
		where: { id: data.id },
		create: {
			id: data.id,
			userId: context.userId,
			title: data.title,
			category: data.category,
			wordsJson: data.words,
			status: "pending_review",
			version: 1
		},
		update: {
			title: data.title,
			category: data.category,
			wordsJson: data.words,
			status: "pending_review",
			version: { increment: 1 }
		}
	});
	return {
		ok: true,
		id: row.id,
		status: row.status,
		message: "Submitted for moderation review."
	};
});
var listMyCreatorPuzzles_createServerFn_handler = createServerRpc({
	id: "adf009bd7fca1657bec39f10ee8e2477aab4c64658c15d7a46bbabd378f0526f",
	name: "listMyCreatorPuzzles",
	filename: "src/lib/v25/creator/cloud.ts"
}, (opts) => listMyCreatorPuzzles.__executeServer(opts));
var listMyCreatorPuzzles = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listMyCreatorPuzzles_createServerFn_handler, async ({ context }) => {
	return {
		ok: true,
		puzzles: (await getPrisma().creatorPuzzle.findMany({
			where: { userId: context.userId },
			orderBy: { updatedAt: "desc" },
			take: 50
		})).map((r) => ({
			...r,
			words: r.wordsJson,
			wordsJson: void 0
		}))
	};
});
//#endregion
export { listMyCreatorPuzzles_createServerFn_handler, publishCreatorPuzzle_createServerFn_handler };
