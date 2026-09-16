import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
import { t as getPrisma } from "./prisma-6RpAAqVw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-CNHDVoAy.js
var getMyEntitlements_createServerFn_handler = createServerRpc({
	id: "a529758e2663cf4082de79d1fe57edd20a44ee9b3cd6924baf895bc007150042",
	name: "getMyEntitlements",
	filename: "src/lib/v13/payments/server.ts"
}, (opts) => getMyEntitlements.__executeServer(opts));
var getMyEntitlements = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyEntitlements_createServerFn_handler, async ({ context }) => getPrisma().entitlement.findMany({
	where: {
		userId: context.userId,
		OR: [{ expiresAt: null }, { expiresAt: { gt: /* @__PURE__ */ new Date() } }]
	},
	orderBy: { updatedAt: "desc" },
	select: {
		productId: true,
		active: true,
		source: true,
		updatedAt: true,
		expiresAt: true
	}
}).then((rows) => rows.map((r) => ({
	...r,
	updatedAt: r.updatedAt.toISOString(),
	expiresAt: r.expiresAt?.toISOString() ?? null
}))));
var recordVerifiedPurchase_createServerFn_handler = createServerRpc({
	id: "d38b308059b70858a9ce92cfceeaa8a429c738b32064fb7cdc0b6429e186b301",
	name: "recordVerifiedPurchase",
	filename: "src/lib/v13/payments/server.ts"
}, (opts) => recordVerifiedPurchase.__executeServer(opts));
var recordVerifiedPurchase = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	provider: String(d.provider ?? "").slice(0, 32),
	externalId: String(d.externalId ?? "").slice(0, 128)
})).handler(recordVerifiedPurchase_createServerFn_handler, async () => ({
	ok: false,
	error: "Manual purchase grants are disabled. Use the signed payment webhook."
}));
//#endregion
export { getMyEntitlements_createServerFn_handler, recordVerifiedPurchase_createServerFn_handler };
