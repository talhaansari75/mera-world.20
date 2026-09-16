import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
import { t as getPrisma } from "./prisma-6RpAAqVw.mjs";
import { t as requirePermission } from "./authorization.server-ZF4iea8M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community-Do1JicL6.js
var clean = (v, n) => String(v ?? "").trim().slice(0, n);
var submitCreatorForReview_createServerFn_handler = createServerRpc({
	id: "67149de935c30b8a832e9370dbbd95a9cdb67c895d0139455cc3801e197a2bc8",
	name: "submitCreatorForReview",
	filename: "src/lib/v26/creator/community.ts"
}, (opts) => submitCreatorForReview.__executeServer(opts));
var submitCreatorForReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ id: clean(d.id, 80) })).handler(submitCreatorForReview_createServerFn_handler, async ({ context, data }) => {
	return { ok: (await getPrisma().creatorPuzzle.updateMany({
		where: {
			id: data.id,
			userId: context.userId
		},
		data: { status: "pending_review" }
	})).count === 1 };
});
var listCreatorCommunity_createServerFn_handler = createServerRpc({
	id: "2c1eb34d1747c85c3d16be4a8636f912a529c75181983bae486088f7e804c7ae",
	name: "listCreatorCommunity",
	filename: "src/lib/v26/creator/community.ts"
}, (opts) => listCreatorCommunity.__executeServer(opts));
var listCreatorCommunity = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCreatorCommunity_createServerFn_handler, async () => {
	return (await getPrisma().creatorPuzzle.findMany({
		where: { status: "approved" },
		include: { reviews: { select: { rating: true } } },
		orderBy: { updatedAt: "desc" },
		take: 50
	})).map((p) => ({
		id: p.id,
		title: p.title,
		category: p.category,
		status: p.status,
		version: p.version,
		rating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
		review_count: p.reviews.length
	}));
});
var reviewCreatorPuzzle_createServerFn_handler = createServerRpc({
	id: "6f946c4b3878bb182fab248ddf22fb25f68bd588653acd9fa65d6b32bc5cafae",
	name: "reviewCreatorPuzzle",
	filename: "src/lib/v26/creator/community.ts"
}, (opts) => reviewCreatorPuzzle.__executeServer(opts));
var reviewCreatorPuzzle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	puzzleId: clean(d.puzzleId, 80),
	rating: Math.max(1, Math.min(5, Math.floor(Number(d.rating)))),
	body: clean(d.body, 500)
})).handler(reviewCreatorPuzzle_createServerFn_handler, async ({ context, data }) => {
	const db = getPrisma();
	if (await db.creatorPuzzle.findFirst({
		where: {
			id: data.puzzleId,
			userId: context.userId
		},
		select: { id: true }
	})) return {
		ok: false,
		error: "You cannot review your own puzzle"
	};
	await db.creatorReview.upsert({
		where: { puzzleId_userId: {
			puzzleId: data.puzzleId,
			userId: context.userId
		} },
		create: {
			puzzleId: data.puzzleId,
			userId: context.userId,
			rating: data.rating,
			body: data.body
		},
		update: {
			rating: data.rating,
			body: data.body
		}
	});
	return { ok: true };
});
var moderateCreatorPuzzle_createServerFn_handler = createServerRpc({
	id: "4821dc6e1cde3e66d023ae86f3ff84317a9d0a30a67a55d491f75ad19ecc0cf4",
	name: "moderateCreatorPuzzle",
	filename: "src/lib/v26/creator/community.ts"
}, (opts) => moderateCreatorPuzzle.__executeServer(opts));
var moderateCreatorPuzzle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	id: clean(d.id, 80),
	status: d.status
})).handler(moderateCreatorPuzzle_createServerFn_handler, async ({ context, data }) => {
	try {
		await requirePermission(context.userId, "creator.moderate");
	} catch {
		return {
			ok: false,
			error: "Admin access required"
		};
	}
	return { ok: (await getPrisma().creatorPuzzle.updateMany({
		where: { id: data.id },
		data: { status: data.status }
	})).count === 1 };
});
//#endregion
export { listCreatorCommunity_createServerFn_handler, moderateCreatorPuzzle_createServerFn_handler, reviewCreatorPuzzle_createServerFn_handler, submitCreatorForReview_createServerFn_handler };
