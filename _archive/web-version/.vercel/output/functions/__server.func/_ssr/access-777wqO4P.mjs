import { t as getPrisma } from "./prisma-u55HPJ6Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/access-777wqO4P.js
/**
* Server-side admin authorization.
*
* ADMIN_EMAIL is the bootstrap/admin identity configured by the deployer.
* It is intentionally read from the server environment so admin identity is
* never exposed as a client-side setting.
*
* Do not use GitHub repository ownership as app authorization.
*/
function configuredAdminEmail() {
	return process.env.ADMIN_EMAIL?.trim().toLowerCase() || null;
}
async function isAdminUser(userId) {
	if (!userId) return false;
	const adminEmail = configuredAdminEmail();
	if (!adminEmail) return false;
	try {
		const user = await getPrisma().user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				email: true
			}
		});
		return Boolean(user?.email && String(user.email).trim().toLowerCase() === adminEmail);
	} catch {
		return false;
	}
}
//#endregion
export { isAdminUser as t };
