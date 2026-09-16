import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
import { t as getPrisma } from "./prisma-6RpAAqVw.mjs";
import { t as requirePermission } from "./authorization.server-ZF4iea8M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-BPx6wNGm.js
async function requireAdmin(userId) {
	await requirePermission(userId, "admin.audit");
}
var getAdminSnapshot_createServerFn_handler = createServerRpc({
	id: "df8e182953a1453434fc96e92b9eb2990c822c06cd70838a29ccffcf929d5f91",
	name: "getAdminSnapshot",
	filename: "src/lib/v13/admin/server.ts"
}, (opts) => getAdminSnapshot.__executeServer(opts));
var getAdminSnapshot = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdminSnapshot_createServerFn_handler, async ({ context }) => {
	await requireAdmin(context.userId);
	const db = getPrisma();
	const [users, events, rooms, reports, purchases, entitlements] = await Promise.all([
		db.gameplayEvent.findMany({
			distinct: ["userId"],
			where: { userId: { not: null } },
			select: { userId: true }
		}),
		db.gameplayEvent.count({ where: { createdAt: { gt: /* @__PURE__ */ new Date(Date.now() - 864e5) } } }),
		db.multiplayerRoom.count({ where: { status: "open" } }),
		db.moderationReport.count({ where: { status: "open" } }),
		db.purchaseReceipt.count({ where: { status: "verified" } }),
		db.entitlement.count({ where: { active: true } })
	]);
	return {
		ok: true,
		usersSeen: users.length,
		events24h: events,
		openRooms: rooms,
		openReports: reports,
		verifiedPurchases: purchases,
		activeEntitlements: entitlements
	};
});
var writeAdminNote_createServerFn_handler = createServerRpc({
	id: "bbfde54225dc5379dc6f998dc9488ae59460377cdf96575a81edf78aadd14a8e",
	name: "writeAdminNote",
	filename: "src/lib/v13/admin/server.ts"
}, (opts) => writeAdminNote.__executeServer(opts));
var writeAdminNote = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	action: String(d.action ?? "").slice(0, 64),
	target: String(d.target ?? "").slice(0, 128),
	note: String(d.note ?? "").slice(0, 1e3)
})).handler(writeAdminNote_createServerFn_handler, async ({ context, data }) => {
	await requireAdmin(context.userId);
	await getPrisma().adminAuditNote.create({ data: {
		adminUserId: context.userId,
		action: data.action,
		target: data.target,
		note: data.note
	} });
	return { ok: true };
});
//#endregion
export { getAdminSnapshot_createServerFn_handler, writeAdminNote_createServerFn_handler };
