import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
import { t as getPrisma } from "./prisma-6RpAAqVw.mjs";
import { t as defaultSave } from "./persist-BhLfxACN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cloud-D_1GADAV.js
var loadCloudSave_createServerFn_handler = createServerRpc({
	id: "605d10bea64093ac377846d67f1811a2ce1286719d2ee61be6bb04960c9bd8b7",
	name: "loadCloudSave",
	filename: "src/lib/server/cloud.ts"
}, (opts) => loadCloudSave.__executeServer(opts));
var loadCloudSave = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(loadCloudSave_createServerFn_handler, async ({ context }) => {
	const row = await getPrisma().playerSave.findUnique({ where: { userId: context.userId } });
	if (!row) return {
		ok: true,
		save: null,
		version: 0,
		revision: 0,
		updatedAt: null
	};
	try {
		return {
			ok: true,
			save: JSON.parse(row.saveJson),
			version: row.version,
			revision: Number(row.revision),
			updatedAt: row.updatedAt.toISOString()
		};
	} catch {
		return {
			ok: false,
			error: "Corrupt cloud save"
		};
	}
});
var pushCloudSave_createServerFn_handler = createServerRpc({
	id: "5d21986f1c0a9295dd8f4b064e16a8fc28368c3eff1b4beaea29cffc1442ec44",
	name: "pushCloudSave",
	filename: "src/lib/server/cloud.ts"
}, (opts) => pushCloudSave.__executeServer(opts));
var pushCloudSave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	json: String(d.json ?? "").slice(0, 25e4),
	expectedRevision: Number.isFinite(d.expectedRevision) ? Math.max(0, Math.floor(Number(d.expectedRevision))) : void 0
})).handler(pushCloudSave_createServerFn_handler, async ({ context, data }) => {
	let incoming;
	try {
		const parsed = JSON.parse(data.json);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("save must be an object");
		incoming = parsed;
	} catch {
		return {
			ok: false,
			error: "Invalid save"
		};
	}
	const serverOwned = [
		"xp",
		"coins",
		"diamonds",
		"stars",
		"energy",
		"energyAt",
		"unlockedLevel",
		"results",
		"achievements",
		"stats",
		"claimedAchievements",
		"claimedMissions",
		"claimedSeasonTiers",
		"skillPoints",
		"skills",
		"storyChapter",
		"materials",
		"inventory",
		"ownedThemes",
		"ownedAvatars",
		"ownedPets",
		"petLevels",
		"equippedPet",
		"equipment",
		"equippedEquipment",
		"loginDays",
		"lastDaily",
		"dailyStreak",
		"lastSpin",
		"lastLoginReward",
		"behaviorProfile",
		"_serverVerified"
	];
	return getPrisma().$transaction(async (tx) => {
		const row = await tx.playerSave.findUnique({ where: { userId: context.userId } });
		if (!row) {
			if (data.expectedRevision && data.expectedRevision !== 0) return {
				ok: false,
				conflict: true,
				error: "Cloud save appeared while syncing"
			};
			const baseline = defaultSave();
			if (serverOwned.some((key) => {
				const value = incoming[key];
				if (value == null) return false;
				if (key === "_serverVerified") return value === true;
				const base = baseline[key];
				if (typeof value === "number" && typeof base === "number") return value !== base;
				if (key === "energyAt") return false;
				if (typeof value === "object") return JSON.stringify(value) !== JSON.stringify(base);
				return value !== base;
			})) return {
				ok: false,
				error: "Initial cloud sync cannot establish server-owned progress. Start from a fresh server save."
			};
			await tx.playerSave.create({ data: {
				userId: context.userId,
				saveJson: data.json,
				version: 1,
				revision: 1n
			} });
			return {
				ok: true,
				revision: 1
			};
		}
		const current = Number(row.revision);
		if (data.expectedRevision !== void 0 && data.expectedRevision !== current) return {
			ok: false,
			conflict: true,
			error: "Remote save changed. Pull it before pushing."
		};
		let existing = {};
		try {
			existing = JSON.parse(row.saveJson);
		} catch {
			return {
				ok: false,
				error: "Corrupt cloud save"
			};
		}
		const merged = { ...incoming };
		for (const key of serverOwned) if (key in existing) merged[key] = existing[key];
		const mergedJson = JSON.stringify(merged);
		if ((await tx.playerSave.updateMany({
			where: {
				userId: context.userId,
				revision: row.revision
			},
			data: {
				saveJson: mergedJson,
				version: { increment: 1 },
				revision: { increment: 1n }
			}
		})).count !== 1) return {
			ok: false,
			conflict: true,
			error: "Remote save changed. Pull it before pushing."
		};
		return {
			ok: true,
			revision: current + 1
		};
	});
});
//#endregion
export { loadCloudSave_createServerFn_handler, pushCloudSave_createServerFn_handler };
