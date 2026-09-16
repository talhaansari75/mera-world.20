import { t as getPrisma } from "./prisma-6RpAAqVw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/authorization.server-ZF4iea8M.js
/** Server-only admin boundary. Never expose ADMIN_USER_IDS to the browser. */
function isAdminUser(userId) {
	return (process.env.ADMIN_USER_IDS ?? "").split(",").map((x) => x.trim()).filter(Boolean).includes(userId);
}
/** Central server-side authorization policy. Env admins are bootstrap-only; persistent RBAC is authoritative otherwise. */
async function hasPermission(userId, permission) {
	if (!userId || !permission) return false;
	if (isAdminUser(userId)) return true;
	const row = await getPrisma().userRole.findFirst({
		where: {
			userId,
			role: { permissions: { some: { permission: { name: permission } } } }
		},
		select: { userId: true }
	});
	return Boolean(row);
}
async function requirePermission(userId, permission) {
	if (!await hasPermission(userId, permission)) throw new Error(`Forbidden: ${permission}`);
}
//#endregion
export { requirePermission as t };
