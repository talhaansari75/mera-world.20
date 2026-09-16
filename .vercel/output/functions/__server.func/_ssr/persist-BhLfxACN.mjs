import { l as SAVE_KEY } from "./constants-Dk3tQPVz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/persist-BhLfxACN.js
var defaultBehaviorProfile = () => ({
	skill_score: 50,
	difficulty_preference: 50,
	speed_preference: 50,
	pet_affinity: 50,
	collection_affinity: 50,
	challenge_affinity: 50,
	hint_dependency: 0,
	session_length: 1,
	recent_engagement: 50,
	preferred_worlds: [],
	preferred_categories: [],
	average_completion_ms: 0,
	completions: 0,
	failures: 0,
	quits: 0,
	hints: 0,
	combo_best: 0,
	session_levels: 0,
	last_close_level: 0,
	reward_affinity: {},
	category_affinity: {},
	updatedAt: 0
});
var clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
var bump = (old, signal, weight = .12) => old + (signal - old) * weight;
function normalizeBehaviorProfile(raw) {
	const p = {
		...defaultBehaviorProfile(),
		...raw ?? {}
	};
	return {
		...p,
		skill_score: clamp(p.skill_score),
		difficulty_preference: clamp(p.difficulty_preference),
		speed_preference: clamp(p.speed_preference),
		pet_affinity: clamp(p.pet_affinity),
		collection_affinity: clamp(p.collection_affinity),
		challenge_affinity: clamp(p.challenge_affinity),
		hint_dependency: clamp(p.hint_dependency),
		session_length: Math.max(1, Math.round(p.session_length)),
		recent_engagement: clamp(p.recent_engagement),
		average_completion_ms: Math.max(0, p.average_completion_ms || 0),
		completions: Math.max(0, Math.floor(p.completions || 0)),
		failures: Math.max(0, Math.floor(p.failures || 0)),
		quits: Math.max(0, Math.floor(p.quits || 0)),
		hints: Math.max(0, Math.floor(p.hints || 0)),
		combo_best: Math.max(0, Math.floor(p.combo_best || 0)),
		session_levels: Math.max(0, Math.floor(p.session_levels || 0)),
		last_close_level: Math.max(0, Math.floor(p.last_close_level || 0)),
		preferred_worlds: Array.from(new Set((p.preferred_worlds ?? []).filter(Number.isInteger).map(Number))).slice(0, 6),
		preferred_categories: Array.from(new Set((p.preferred_categories ?? []).filter(Boolean).map(String))).slice(0, 6),
		reward_affinity: { ...p.reward_affinity ?? {} },
		category_affinity: { ...p.category_affinity ?? {} },
		updatedAt: Math.max(0, Number(p.updatedAt) || 0)
	};
}
function observeCompletion(save, input) {
	const p = normalizeBehaviorProfile(save.behaviorProfile);
	const fast = input.timeMs <= 75e3 ? 100 : input.timeMs >= 15e4 ? 0 : 50;
	const challenge = input.daily || input.mode !== "classic" ? 100 : 40;
	const petSignal = input.pet ? 100 : 0;
	const skillSignal = input.perfect ? 90 : input.stars >= 3 ? 78 : input.stars <= 1 ? 30 : 58;
	const cat = String(input.category || "general");
	const categoryAffinity = {
		...p.category_affinity,
		[cat]: (p.category_affinity[cat] ?? 0) + 1
	};
	const rewards = {
		...p.reward_affinity,
		coins: (p.reward_affinity.coins ?? 0) + Math.max(1, input.rewardCoins)
	};
	const recent = p.completions + 1;
	const avg = p.average_completion_ms ? Math.round(p.average_completion_ms + (input.timeMs - p.average_completion_ms) / recent) : input.timeMs;
	const worlds = [input.world, ...p.preferred_worlds.filter((w) => w !== input.world)].slice(0, 6);
	const categories = Object.entries(categoryAffinity).sort((a, b) => b[1] - a[1]).map(([k]) => k).slice(0, 6);
	return {
		...save,
		behaviorProfile: normalizeBehaviorProfile({
			...p,
			skill_score: bump(p.skill_score, skillSignal),
			difficulty_preference: bump(p.difficulty_preference, input.stars >= 3 ? 80 : input.stars <= 1 ? 25 : 55),
			speed_preference: bump(p.speed_preference, fast),
			pet_affinity: bump(p.pet_affinity, petSignal),
			collection_affinity: bump(p.collection_affinity, input.rewardCoins >= 80 ? 75 : 45),
			challenge_affinity: bump(p.challenge_affinity, challenge),
			hint_dependency: bump(p.hint_dependency, input.hints > 0 ? Math.min(100, input.hints * 30) : 0),
			session_length: Math.max(1, p.session_levels + 1),
			recent_engagement: bump(p.recent_engagement, input.perfect ? 95 : 70),
			preferred_worlds: worlds,
			preferred_categories: categories,
			average_completion_ms: avg,
			completions: recent,
			hints: p.hints + input.hints,
			combo_best: Math.max(p.combo_best, input.combo),
			session_levels: p.session_levels + 1,
			reward_affinity: rewards,
			category_affinity: categoryAffinity,
			updatedAt: Date.now()
		})
	};
}
function defaultSettings() {
	return {
		sfx: true,
		music: true,
		masterVol: .8,
		sfxVol: .7,
		musicVol: .45,
		haptics: true,
		reducedMotion: false,
		highContrast: false,
		largeText: false,
		colorBlind: false,
		showTimer: true,
		showDirections: true,
		confirmExit: true,
		autoHint: false,
		snapSelect: true,
		gridLines: true,
		tileStyle: "carved",
		shake: true,
		particles: true,
		parentalLock: false,
		analytics: false,
		personalization: true,
		cloudSync: true,
		rtlForce: false,
		screenReader: false,
		dyslexiaFriendly: false,
		focusMode: false,
		notificationReminders: false,
		notificationTime: "19:00"
	};
}
function defaultStats() {
	return {
		gamesPlayed: 0,
		gamesWon: 0,
		wordsFound: 0,
		hintsUsed: 0,
		playTimeMs: 0,
		bestStreak: 0,
		currentStreak: 0,
		perfectClears: 0,
		coinsEarned: 0,
		dailyCompleted: 0,
		bossesDefeated: 0,
		levelsCompleted: 0
	};
}
function defaultSave() {
	return {
		version: 2,
		playerName: "Traveler",
		avatarId: "ink-1",
		classId: "explorer",
		xp: 0,
		coins: 120,
		diamonds: 5,
		stars: 0,
		energy: 20,
		energyAt: Date.now(),
		unlockedLevel: 1,
		results: {},
		settings: defaultSettings(),
		ownedThemes: ["midnight"],
		ownedAvatars: [
			"ink-1",
			"ink-2",
			"ink-3"
		],
		ownedPets: ["dog"],
		petLevels: { dog: 1 },
		petXp: { dog: 0 },
		equippedPet: "dog",
		equippedTheme: "midnight",
		achievements: [],
		stats: defaultStats(),
		lastDaily: null,
		dailyStreak: 0,
		behaviorProfile: defaultBehaviorProfile(),
		lastSpin: null,
		lastLoginReward: null,
		skillPoints: 0,
		skills: {
			speed: 0,
			vision: 0,
			luck: 0
		},
		language: "en",
		storyChapter: 0,
		inventory: ["starter-pack"],
		loginDays: 1,
		baseBuildings: {
			camp: 1,
			workshop: 1,
			forge: 1,
			library: 1,
			treasury: 1
		},
		materials: {
			wood: 40,
			stone: 30,
			crystal: 10,
			iron: 5,
			gold: 0
		},
		equipment: [],
		equippedEquipment: {},
		claimedAchievements: [],
		claimedMissions: [],
		claimedSeasonTiers: []
	};
}
function isLang(v) {
	return typeof v === "string" && [
		"en",
		"ur",
		"ur-Latn",
		"hi",
		"ar",
		"bn",
		"pa",
		"sd",
		"ps",
		"tr",
		"es",
		"fr",
		"de",
		"zh",
		"ja"
	].includes(v);
}
function migrateSave(raw) {
	const base = defaultSave();
	if (!raw || typeof raw !== "object") return base;
	const s = raw;
	const merged = {
		...base,
		...s,
		version: 2,
		settings: {
			...base.settings,
			...s.settings ?? {}
		},
		stats: {
			...base.stats,
			...s.stats ?? {}
		},
		skills: {
			...base.skills,
			...s.skills ?? {}
		},
		results: s.results && typeof s.results === "object" ? s.results : {},
		ownedThemes: Array.isArray(s.ownedThemes) ? s.ownedThemes : base.ownedThemes,
		ownedAvatars: Array.isArray(s.ownedAvatars) ? s.ownedAvatars : base.ownedAvatars,
		ownedPets: Array.isArray(s.ownedPets) ? s.ownedPets : base.ownedPets,
		petLevels: s.petLevels && typeof s.petLevels === "object" ? s.petLevels : base.petLevels,
		petXp: s.petXp && typeof s.petXp === "object" ? s.petXp : base.petXp,
		achievements: Array.isArray(s.achievements) ? s.achievements : [],
		inventory: Array.isArray(s.inventory) ? s.inventory : base.inventory,
		language: isLang(s.language) ? s.language : "en",
		baseBuildings: s.baseBuildings && typeof s.baseBuildings === "object" ? {
			...base.baseBuildings,
			...s.baseBuildings
		} : base.baseBuildings,
		materials: s.materials && typeof s.materials === "object" ? {
			...base.materials,
			...s.materials
		} : base.materials,
		equipment: Array.isArray(s.equipment) ? s.equipment : base.equipment,
		equippedEquipment: s.equippedEquipment && typeof s.equippedEquipment === "object" ? s.equippedEquipment : base.equippedEquipment,
		claimedAchievements: Array.isArray(s.claimedAchievements) ? s.claimedAchievements : [],
		claimedMissions: Array.isArray(s.claimedMissions) ? s.claimedMissions : [],
		claimedSeasonTiers: Array.isArray(s.claimedSeasonTiers) ? s.claimedSeasonTiers : [],
		dailyStreak: Number.isFinite(s.dailyStreak) ? Math.max(0, Math.floor(s.dailyStreak)) : base.dailyStreak,
		behaviorProfile: normalizeBehaviorProfile(s.behaviorProfile)
	};
	if (!Number.isFinite(merged.coins)) merged.coins = base.coins;
	if (!Number.isFinite(merged.energy)) merged.energy = base.energy;
	if (merged.unlockedLevel < 1) merged.unlockedLevel = 1;
	return merged;
}
function loadSave() {
	if (typeof localStorage === "undefined") return defaultSave();
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return defaultSave();
		return migrateSave(JSON.parse(raw));
	} catch {
		try {
			const bak = localStorage.getItem(SAVE_KEY + ".bak");
			if (bak) return migrateSave(JSON.parse(bak));
		} catch {}
		return defaultSave();
	}
}
function writeSave(save) {
	if (typeof localStorage === "undefined") return;
	try {
		const prev = localStorage.getItem(SAVE_KEY);
		if (prev) localStorage.setItem(SAVE_KEY + ".bak", prev);
		localStorage.setItem(SAVE_KEY, JSON.stringify(save));
	} catch {}
}
function exportSave(save) {
	return JSON.stringify({
		...save,
		exportedAt: Date.now()
	}, null, 2);
}
function importSave(text) {
	return migrateSave(JSON.parse(text));
}
function mergeSaves(a, b) {
	const results = { ...a.results };
	for (const [k, v] of Object.entries(b.results)) {
		const cur = results[k];
		if (!cur || v.stars > cur.stars || v.stars === cur.stars && v.timeMs < cur.timeMs) results[k] = v;
	}
	return {
		...a,
		playerName: a.playerName || b.playerName,
		xp: Math.max(a.xp, b.xp),
		coins: Math.max(a.coins, b.coins),
		diamonds: Math.max(a.diamonds, b.diamonds),
		stars: Math.max(a.stars, b.stars),
		energy: Math.max(a.energy, b.energy),
		unlockedLevel: Math.max(a.unlockedLevel, b.unlockedLevel),
		results,
		ownedThemes: [.../* @__PURE__ */ new Set([...a.ownedThemes, ...b.ownedThemes])],
		ownedAvatars: [.../* @__PURE__ */ new Set([...a.ownedAvatars, ...b.ownedAvatars])],
		ownedPets: [.../* @__PURE__ */ new Set([...a.ownedPets, ...b.ownedPets])],
		achievements: [.../* @__PURE__ */ new Set([...a.achievements, ...b.achievements])],
		inventory: [.../* @__PURE__ */ new Set([...a.inventory, ...b.inventory])],
		storyChapter: Math.max(a.storyChapter, b.storyChapter),
		loginDays: Math.max(a.loginDays, b.loginDays),
		dailyStreak: Math.max(a.dailyStreak, b.dailyStreak),
		stats: {
			gamesPlayed: Math.max(a.stats.gamesPlayed, b.stats.gamesPlayed),
			gamesWon: Math.max(a.stats.gamesWon, b.stats.gamesWon),
			wordsFound: Math.max(a.stats.wordsFound, b.stats.wordsFound),
			hintsUsed: Math.max(a.stats.hintsUsed, b.stats.hintsUsed),
			playTimeMs: Math.max(a.stats.playTimeMs, b.stats.playTimeMs),
			bestStreak: Math.max(a.stats.bestStreak, b.stats.bestStreak),
			currentStreak: Math.max(a.stats.currentStreak, b.stats.currentStreak),
			perfectClears: Math.max(a.stats.perfectClears, b.stats.perfectClears),
			coinsEarned: Math.max(a.stats.coinsEarned, b.stats.coinsEarned),
			dailyCompleted: Math.max(a.stats.dailyCompleted, b.stats.dailyCompleted),
			bossesDefeated: Math.max(a.stats.bossesDefeated, b.stats.bossesDefeated),
			levelsCompleted: Math.max(a.stats.levelsCompleted ?? 0, b.stats.levelsCompleted ?? 0)
		},
		petLevels: {
			...a.petLevels,
			...b.petLevels
		},
		lastDaily: laterDate(a.lastDaily, b.lastDaily),
		lastSpin: laterDate(a.lastSpin, b.lastSpin),
		lastLoginReward: laterDate(a.lastLoginReward, b.lastLoginReward),
		claimedAchievements: [.../* @__PURE__ */ new Set([...a.claimedAchievements, ...b.claimedAchievements])],
		claimedMissions: [.../* @__PURE__ */ new Set([...a.claimedMissions, ...b.claimedMissions])]
	};
}
function laterDate(a, b) {
	if (!a) return b;
	if (!b) return a;
	return a > b ? a : b;
}
//#endregion
export { mergeSaves as a, writeSave as c, loadSave as i, exportSave as n, migrateSave as o, importSave as r, observeCompletion as s, defaultSave as t };
