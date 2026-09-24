import { r as createServerFn } from "./ssr.mjs";
import { r as getSql } from "./db-DcaG3iKu.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Cmpo3hKv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/consent-DMeC6OTF.js
var CURRENT_LEGAL_VERSION = "2026-09-16";
var getLegalConsent_createServerFn_handler = createServerRpc({
	id: "bcb3b19a5ce3f7092bc601d9b984b5fa0a76caca6f180c71090d11f5b8db9374",
	name: "getLegalConsent",
	filename: "src/lib/legal/consent.ts"
}, (opts) => getLegalConsent.__executeServer(opts));
var getLegalConsent = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getLegalConsent_createServerFn_handler, async ({ context }) => {
	return {
		accepted: (await (await getSql()).query(`select version
       from legal_consents
       where user_id = $1 and version = $2
       limit 1`, [context.userId, CURRENT_LEGAL_VERSION])).length > 0,
		version: CURRENT_LEGAL_VERSION
	};
});
var acceptLegalConsent_createServerFn_handler = createServerRpc({
	id: "1ae3331b7df850b3f79f6b320c0aa1febb8cfb6587b7ca7a38135e0b6f2be03d",
	name: "acceptLegalConsent",
	filename: "src/lib/legal/consent.ts"
}, (opts) => acceptLegalConsent.__executeServer(opts));
var acceptLegalConsent = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(acceptLegalConsent_createServerFn_handler, async ({ context }) => {
	await (await getSql()).query(`insert into legal_consents (user_id, version)
       values ($1, $2)
       on conflict (user_id, version) do nothing`, [context.userId, CURRENT_LEGAL_VERSION]);
	return {
		accepted: true,
		version: CURRENT_LEGAL_VERSION
	};
});
//#endregion
export { acceptLegalConsent_createServerFn_handler, getLegalConsent_createServerFn_handler };
