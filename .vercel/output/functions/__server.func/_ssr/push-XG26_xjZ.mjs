import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
import { t as getPrisma } from "./prisma-6RpAAqVw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/push-XG26_xjZ.js
var getPushConfig_createServerFn_handler = createServerRpc({
	id: "08b32a5b08cabef43341ce3a0393eab95860097817416874dd9ac873c8e912d8",
	name: "getPushConfig",
	filename: "src/lib/v30/push/push.ts"
}, (opts) => getPushConfig.__executeServer(opts));
var getPushConfig = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getPushConfig_createServerFn_handler, async () => ({
	ok: true,
	publicKey: null
}));
var savePushSubscription_createServerFn_handler = createServerRpc({
	id: "60a8743cc7963260bb7bfac40b759c7a41b2ad34317f722a0a7156f1020aa795",
	name: "savePushSubscription",
	filename: "src/lib/v30/push/push.ts"
}, (opts) => savePushSubscription.__executeServer(opts));
var savePushSubscription = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ subscription: d.subscription })).handler(savePushSubscription_createServerFn_handler, async ({ context, data }) => {
	const sub = data.subscription;
	if (!sub || typeof sub.endpoint !== "string" || sub.endpoint.length < 20 || sub.endpoint.length > 2048) return {
		ok: false,
		error: "Invalid push subscription"
	};
	await getPrisma().pushSubscription.upsert({
		where: { userId_endpoint: {
			userId: context.userId,
			endpoint: sub.endpoint
		} },
		create: {
			userId: context.userId,
			endpoint: sub.endpoint,
			subscriptionJson: JSON.stringify(sub).slice(0, 12e3)
		},
		update: { subscriptionJson: JSON.stringify(sub).slice(0, 12e3) }
	});
	return { ok: true };
});
var removePushSubscription_createServerFn_handler = createServerRpc({
	id: "c1d68e648bc087ed6bc39d33acec72f03d184b5f9a16e8ecbf0c757755d98d6f",
	name: "removePushSubscription",
	filename: "src/lib/v30/push/push.ts"
}, (opts) => removePushSubscription.__executeServer(opts));
var removePushSubscription = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ endpoint: String(d.endpoint ?? "").slice(0, 2048) })).handler(removePushSubscription_createServerFn_handler, async ({ context, data }) => {
	if (!data.endpoint) return {
		ok: false,
		error: "Missing endpoint"
	};
	await getPrisma().pushSubscription.deleteMany({ where: {
		userId: context.userId,
		endpoint: data.endpoint
	} });
	return { ok: true };
});
//#endregion
export { getPushConfig_createServerFn_handler, removePushSubscription_createServerFn_handler, savePushSubscription_createServerFn_handler };
