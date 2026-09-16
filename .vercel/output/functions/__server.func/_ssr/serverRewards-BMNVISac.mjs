import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
import { t as getPrisma } from "./prisma-6RpAAqVw.mjs";
import { a as periodKey, i as achievementProgress, n as MISSIONS, o as seasonKey, r as REWARDS, s as seasonPoints, t as ACHIEVEMENTS } from "./seasonRules-DJspMrVl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/serverRewards-BMNVISac.js
var id = (v) => String(v ?? "").trim().slice(0, 80);
var value = (s, m) => Number(s?.stats?.[m === "levels" ? "levelsCompleted" : m === "words" ? "wordsFound" : "coinsEarned"] ?? 0);
var read = (x) => x ? JSON.parse(x) : null;
async function atomicClaim(userId, key, mutate) {
	const db = getPrisma();
	for (let attempt = 0; attempt < 3; attempt++) try {
		return await db.$transaction(async (tx) => {
			const idem = await tx.idempotencyKey.findUnique({ where: { userId_key: {
				userId,
				key
			} } });
			if (idem) return {
				ok: true,
				reward: Number(idem.responseJson?.reward ?? 0)
			};
			const row = await tx.playerSave.findUnique({ where: { userId } });
			const s = read(row?.saveJson ?? null);
			if (!s || s._serverVerified !== true) return {
				ok: false,
				error: "Progress must come from a server-verified gameplay session"
			};
			const out = mutate(s);
			if (row) await tx.playerSave.update({
				where: { userId },
				data: {
					saveJson: JSON.stringify(out.save),
					revision: { increment: 1n }
				}
			});
			else await tx.playerSave.create({ data: {
				userId,
				saveJson: JSON.stringify(out.save),
				version: 1,
				revision: 1n
			} });
			await tx.idempotencyKey.create({ data: {
				userId,
				key,
				operation: "reward-claim",
				responseJson: { reward: out.reward },
				status: "completed"
			} });
			return {
				ok: true,
				reward: out.reward
			};
		}, { isolationLevel: "Serializable" });
	} catch (e) {
		if (e?.code !== "P2034" && e?.code !== "P2002") throw e;
	}
	return {
		ok: false,
		error: "Please retry the reward claim."
	};
}
var claimAchievementServer_createServerFn_handler = createServerRpc({
	id: "7ae21670f29b43c4b05cda9c5c6f331d95cf456f0895a4826a9327833e181260",
	name: "claimAchievementServer",
	filename: "src/lib/v26/progression/serverRewards.ts"
}, (opts) => claimAchievementServer.__executeServer(opts));
var claimAchievementServer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ id: id(d.id) })).handler(claimAchievementServer_createServerFn_handler, async ({ context, data }) => {
	const a = ACHIEVEMENTS.find((x) => x.id === data.id);
	if (!a) return {
		ok: false,
		error: "Unknown achievement"
	};
	return atomicClaim(context.userId, `achievement:${a.id}`, (s) => {
		const c = Array.isArray(s.claimedAchievements) ? s.claimedAchievements : [];
		if (c.includes(a.id)) return {
			reward: 0,
			save: s
		};
		if (!achievementProgress(a, s.stats).done) throw Object.assign(/* @__PURE__ */ new Error("Achievement is not unlocked"), { code: "CLAIM_LOCKED" });
		s.claimedAchievements = [...c, a.id];
		s.coins = Number(s.coins ?? 0) + a.reward;
		s.stats = {
			...s.stats,
			coinsEarned: Number(s.stats?.coinsEarned ?? 0) + a.reward
		};
		return {
			reward: a.reward,
			save: s
		};
	}).catch((e) => ({
		ok: false,
		error: e?.code === "CLAIM_LOCKED" ? "Achievement is not unlocked" : "Claim failed"
	}));
});
var claimMissionServer_createServerFn_handler = createServerRpc({
	id: "991382a8b9b94b821719d4689f497ab4ae6539243f9e3e2e9a844d4d39e9641c",
	name: "claimMissionServer",
	filename: "src/lib/v26/progression/serverRewards.ts"
}, (opts) => claimMissionServer.__executeServer(opts));
var claimMissionServer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ id: id(d.id) })).handler(claimMissionServer_createServerFn_handler, async ({ context, data }) => {
	const m = MISSIONS.find((x) => x.id === data.id);
	if (!m) return {
		ok: false,
		error: "Unknown mission"
	};
	const ck = `${m.id}:${periodKey(m.period)}`;
	return atomicClaim(context.userId, `mission:${ck}`, (s) => {
		const c = Array.isArray(s.claimedMissions) ? s.claimedMissions : [];
		if (c.includes(ck)) return {
			reward: 0,
			save: s
		};
		if (value(s, m.metric) < m.target) throw Object.assign(/* @__PURE__ */ new Error("Mission is not complete"), { code: "CLAIM_LOCKED" });
		s.claimedMissions = [...c, ck];
		s.coins = Number(s.coins ?? 0) + m.reward;
		s.stats = {
			...s.stats,
			coinsEarned: Number(s.stats?.coinsEarned ?? 0) + m.reward
		};
		return {
			reward: m.reward,
			save: s
		};
	}).catch((e) => ({
		ok: false,
		error: e?.code === "CLAIM_LOCKED" ? "Mission is not complete" : "Claim failed"
	}));
});
var claimSeasonTierServer_createServerFn_handler = createServerRpc({
	id: "686333f9fe67899be5e4be9c3f38c555f92744235274bc367fe0245589b6fc12",
	name: "claimSeasonTierServer",
	filename: "src/lib/v26/progression/serverRewards.ts"
}, (opts) => claimSeasonTierServer.__executeServer(opts));
var claimSeasonTierServer = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ level: Math.max(1, Math.min(10, Math.floor(Number(d.level)))) })).handler(claimSeasonTierServer_createServerFn_handler, async ({ context, data }) => {
	const reward = REWARDS[data.level - 1];
	const key = `${seasonKey()}:${data.level}`;
	return atomicClaim(context.userId, `season:${key}`, (s) => {
		const c = Array.isArray(s.claimedSeasonTiers) ? s.claimedSeasonTiers : [];
		if (c.includes(key)) return {
			reward: 0,
			save: s
		};
		if (seasonPoints(s) < data.level * 100) throw Object.assign(/* @__PURE__ */ new Error("Season tier is locked"), { code: "CLAIM_LOCKED" });
		s.claimedSeasonTiers = [...c, key];
		s.coins = Number(s.coins ?? 0) + reward;
		s.stats = {
			...s.stats,
			coinsEarned: Number(s.stats?.coinsEarned ?? 0) + reward
		};
		return {
			reward,
			save: s
		};
	}).catch((e) => ({
		ok: false,
		error: e?.code === "CLAIM_LOCKED" ? "Season tier is locked" : "Claim failed"
	}));
});
//#endregion
export { claimAchievementServer_createServerFn_handler, claimMissionServer_createServerFn_handler, claimSeasonTierServer_createServerFn_handler };
