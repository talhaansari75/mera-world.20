import { c as SAVE_KEY, f as hashSeed, i as ENERGY_REFILL_MS } from "./levels-DBG2bxfj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rewardPersonalization-BDFGfk_j.js
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
var clamp$1 = (n) => Math.max(0, Math.min(100, Math.round(n)));
var bump = (old, signal, weight = .12) => old + (signal - old) * weight;
function normalizeBehaviorProfile(raw) {
	const p = {
		...defaultBehaviorProfile(),
		...raw ?? {}
	};
	return {
		...p,
		skill_score: clamp$1(p.skill_score),
		difficulty_preference: clamp$1(p.difficulty_preference),
		speed_preference: clamp$1(p.speed_preference),
		pet_affinity: clamp$1(p.pet_affinity),
		collection_affinity: clamp$1(p.collection_affinity),
		challenge_affinity: clamp$1(p.challenge_affinity),
		hint_dependency: clamp$1(p.hint_dependency),
		session_length: Math.max(1, Math.round(p.session_length)),
		recent_engagement: clamp$1(p.recent_engagement),
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
		ownedThemes: ["parchment"],
		ownedAvatars: [
			"ink-1",
			"ink-2",
			"ink-3"
		],
		ownedPets: ["dog"],
		petLevels: { dog: 1 },
		petXp: { dog: 0 },
		equippedPet: "dog",
		equippedTheme: "parchment",
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
function xpForClear$1(opts) {
	return 18 + opts.size * 2 + opts.stars * 6 + (opts.boss ? 40 : 0);
}
function rewardCoins(opts) {
	let coins = 12 + opts.stars * 8 + opts.wordCount * 2;
	if (opts.combo >= 5) coins += Math.min(30, opts.combo * 2);
	if (opts.hints === 0) coins += 10;
	if (opts.mistakes === 0) coins += 5;
	if (opts.firstClear) coins += 10;
	if (opts.boss) coins += 40;
	if (opts.mode === "double_reward") coins *= 2;
	if (opts.mode === "treasure") coins += 20;
	if (opts.mode === "hardcore" || opts.mode === "nightmare") coins += 15;
	coins -= opts.hints * 3;
	coins -= opts.mistakes;
	return Math.max(6, coins);
}
function recordLevelResult(save, level, result) {
	const key = String(level);
	const previous = save.results[key];
	const shouldReplace = !previous || result.stars > previous.stars || result.stars === previous.stars && result.timeMs < previous.timeMs;
	return {
		...save,
		results: shouldReplace ? {
			...save.results,
			[key]: result
		} : save.results,
		unlockedLevel: Math.max(save.unlockedLevel, level + 1)
	};
}
function refillEnergy(save, now = Date.now()) {
	if (save.energy >= 20) return save;
	const elapsed = Math.max(0, now - save.energyAt);
	const gained = Math.floor(elapsed / ENERGY_REFILL_MS);
	if (gained <= 0) return save;
	const energy = Math.min(20, save.energy + gained);
	const energyAt = energy === 20 ? now : save.energyAt + gained * ENERGY_REFILL_MS;
	return {
		...save,
		energy,
		energyAt
	};
}
function energyEta(save, now = Date.now()) {
	if (save.energy >= 20) return 0;
	const next = save.energyAt + ENERGY_REFILL_MS;
	return Math.max(0, next - now);
}
function playerLevel(xp) {
	return Math.floor(Math.sqrt(xp / 80)) + 1;
}
function xpForLevel(level) {
	const l = Math.max(1, level);
	return 80 * (l - 1) * (l - 1);
}
function xpForClear(opts) {
	return 18 + opts.size * 2 + opts.stars * 6 + (opts.boss ? 40 : 0);
}
function starsFor(opts) {
	if (opts.hints === 0 && opts.mistakes === 0 && opts.timeMs <= opts.targetMs) return 3;
	if (opts.hints <= 1 && opts.mistakes <= 1) return 2;
	return 1;
}
var SHOP = [
	{
		id: "energy-1",
		name: "Spark of focus",
		kind: "energy",
		amount: 1,
		coins: 50,
		diamonds: 0
	},
	{
		id: "energy-5",
		name: "Lantern of hours",
		kind: "energy",
		amount: 5,
		coins: 200,
		diamonds: 0
	},
	{
		id: "energy-full",
		name: "Full well",
		kind: "energy",
		amount: 20,
		coins: 0,
		diamonds: 1
	},
	{
		id: "coins-pack",
		name: "Coin purse",
		kind: "coins",
		amount: 200,
		coins: 0,
		diamonds: 2
	},
	{
		id: "hint-pack",
		name: "Scribe's pack",
		kind: "item",
		amount: 1,
		coins: 80,
		diamonds: 0,
		item: "hint-pack"
	},
	{
		id: "theme-parchment",
		name: "Parchment theme",
		kind: "theme",
		amount: 1,
		coins: 180,
		diamonds: 0,
		theme: "parchment"
	},
	{
		id: "theme-ocean",
		name: "Tide theme",
		kind: "theme",
		amount: 1,
		coins: 220,
		diamonds: 0,
		theme: "ocean"
	},
	{
		id: "theme-forest",
		name: "Canopy theme",
		kind: "theme",
		amount: 1,
		coins: 220,
		diamonds: 0,
		theme: "forest"
	},
	{
		id: "theme-ember",
		name: "Ember theme",
		kind: "theme",
		amount: 1,
		coins: 260,
		diamonds: 0,
		theme: "ember"
	},
	{
		id: "theme-orchid",
		name: "Orchid theme",
		kind: "theme",
		amount: 1,
		coins: 260,
		diamonds: 0,
		theme: "orchid"
	},
	{
		id: "theme-arctic",
		name: "Arctic theme",
		kind: "theme",
		amount: 1,
		coins: 300,
		diamonds: 0,
		theme: "arctic"
	},
	{
		id: "theme-sakura",
		name: "Sakura theme",
		kind: "theme",
		amount: 1,
		coins: 300,
		diamonds: 0,
		theme: "sakura"
	}
];
var SPIN_TABLE = [
	{
		w: 28,
		coins: 15,
		diamonds: 0,
		energy: 0,
		label: "+15 coins"
	},
	{
		w: 22,
		coins: 40,
		diamonds: 0,
		energy: 0,
		label: "+40 coins"
	},
	{
		w: 16,
		coins: 0,
		diamonds: 0,
		energy: 1,
		label: "+1 energy"
	},
	{
		w: 12,
		coins: 80,
		diamonds: 0,
		energy: 0,
		label: "+80 coins"
	},
	{
		w: 10,
		coins: 0,
		diamonds: 1,
		energy: 0,
		label: "+1 diamond"
	},
	{
		w: 7,
		coins: 0,
		diamonds: 0,
		energy: 3,
		label: "+3 energy"
	},
	{
		w: 4,
		coins: 200,
		diamonds: 0,
		energy: 0,
		label: "+200 coins"
	},
	{
		w: 1,
		coins: 0,
		diamonds: 3,
		energy: 0,
		label: "Jackpot"
	}
];
var rule = (id, name, description, difficulty, opts = {}) => ({
	id,
	name,
	description,
	difficulty,
	free: false,
	timeMultiplier: 1,
	energyMultiplier: 1,
	rewardMultiplier: 1,
	...opts
});
var ADVANCED_MODE_CATALOG = [
	rule("classic", "Classic", "Balanced journey.", 1),
	rule("timed", "Time Attack", "Beat the clock.", 2, {
		timeMultiplier: .75,
		rewardMultiplier: 1.2
	}),
	rule("survival", "Survival", "Three mistakes end the run.", 3, {
		maxMistakes: 3,
		rewardMultiplier: 1.35
	}),
	rule("blitz", "Blitz", "A very short round.", 4, {
		timeMultiplier: .5,
		rewardMultiplier: 1.5
	}),
	rule("zen", "Zen", "No energy and no clock.", 0, {
		free: true,
		rewardMultiplier: .8
	}),
	rule("daily", "Daily", "One deterministic challenge each day.", 3, {
		free: true,
		timeMultiplier: .9
	}),
	rule("endless", "Endless", "Procedural rounds without a cap.", 4, {
		free: true,
		rewardMultiplier: 1.25
	}),
	rule("fog", "Fog", "Visibility is restricted.", 4, { rewardMultiplier: 1.35 }),
	rule("mirror", "Mirror", "Words are displayed backwards.", 3, { rewardMultiplier: 1.2 }),
	rule("category", "Category", "A themed vocabulary set.", 2),
	rule("boss", "Boss", "Dense board and strict timer.", 5, {
		timeMultiplier: .7,
		rewardMultiplier: 1.8,
		dense: true
	}),
	rule("rush", "Rush", "Every second matters.", 3, {
		timeMultiplier: .6,
		rewardMultiplier: 1.45
	}),
	rule("precision", "Precision", "A single mistake is costly.", 4, {
		maxMistakes: 1,
		rewardMultiplier: 1.6
	}),
	rule("hardcore", "Hardcore", "No mistakes allowed.", 5, {
		maxMistakes: 1,
		timeMultiplier: .8,
		rewardMultiplier: 2
	}),
	rule("double_reward", "Double Reward", "Higher stakes, higher payout.", 2, {
		energyMultiplier: 1.5,
		rewardMultiplier: 2
	}),
	rule("no_hints", "No Hints", "Hints are disabled.", 3, {
		noHints: true,
		rewardMultiplier: 1.5
	}),
	rule("small_grid", "Pocket Grid", "Compact board with dense words.", 3, { rewardMultiplier: 1.3 }),
	rule("giant_grid", "Giant Grid", "A huge board for experts.", 4, {
		timeMultiplier: 1.25,
		rewardMultiplier: 1.7,
		dense: true
	}),
	rule("reverse_only", "Reverse Only", "Find trails in reverse.", 3, {
		reverseOnly: true,
		rewardMultiplier: 1.3
	}),
	rule("diagonal", "Diagonal", "Only diagonal trails count.", 4, {
		diagonalOnly: true,
		rewardMultiplier: 1.55
	}),
	rule("orthogonal", "Crossroads", "Only horizontal and vertical trails.", 3, {
		orthogonalOnly: true,
		rewardMultiplier: 1.35
	}),
	rule("chaos", "Chaos", "Fast and unpredictable.", 5, {
		timeMultiplier: .7,
		rewardMultiplier: 1.9,
		dense: true
	}),
	rule("streak", "Streak", "Protect your combo.", 3, { rewardMultiplier: 1.6 }),
	rule("treasure", "Treasure Hunt", "Bonus rewards for clean clears.", 2, { rewardMultiplier: 1.75 }),
	rule("nightmare", "Nightmare", "Maximum pressure.", 5, {
		timeMultiplier: .55,
		maxMistakes: 1,
		rewardMultiplier: 2.25,
		dense: true
	}),
	rule("focus", "Focus", "A calm precision challenge.", 2, {
		timeMultiplier: 1.5,
		rewardMultiplier: 1.15
	}),
	rule("speedrun", "Speedrun", "Race for your best time.", 4, {
		timeMultiplier: .45,
		rewardMultiplier: 1.8
	}),
	rule("marathon", "Marathon", "Long-form endurance.", 3, {
		timeMultiplier: 2,
		rewardMultiplier: 1.4
	}),
	rule("random_rules", "Random Rules", "A different modifier each run.", 5, {
		timeMultiplier: .8,
		rewardMultiplier: 1.9
	})
];
var MODE_RULES = Object.fromEntries(ADVANCED_MODE_CATALOG.map((m) => [m.id, m]));
function modeRules(mode) {
	return MODE_RULES[mode] ?? MODE_RULES.classic;
}
var CHALLENGES = [
	{
		id: "speed",
		title: "Speed Day",
		description: "Clear the daily before the rush clock expires.",
		icon: "⚡",
		rewardMultiplier: 1.15
	},
	{
		id: "combo",
		title: "Combo Day",
		description: "Build a long word chain for bonus glory.",
		icon: "🔥",
		rewardMultiplier: 1.15
	},
	{
		id: "hidden",
		title: "Hidden Word Day",
		description: "Bonus words are tucked into the grid.",
		icon: "👻",
		rewardMultiplier: 1.1
	},
	{
		id: "ice",
		title: "Ice Day",
		description: "Frozen cells make every path more deliberate.",
		icon: "❄️",
		rewardMultiplier: 1.1
	},
	{
		id: "bomb",
		title: "Bomb Day",
		description: "Watch the blast zones while hunting words.",
		icon: "💣",
		rewardMultiplier: 1.1
	},
	{
		id: "perfect",
		title: "Perfect Day",
		description: "Finish with zero mistakes and zero hints for the best bonus.",
		icon: "⭐",
		rewardMultiplier: 1.2
	},
	{
		id: "treasure",
		title: "Treasure Day",
		description: "Find the bonus words to fill today's treasure meter.",
		icon: "💎",
		rewardMultiplier: 1.15
	}
];
function dailyChallengeFor(day) {
	return CHALLENGES[Math.abs(hashSeed("daily-challenge", day)) % CHALLENGES.length];
}
function dailyChallengeObjective(challenge, input) {
	if (!challenge) return {
		met: true,
		label: "Complete the puzzle"
	};
	switch (challenge.id) {
		case "speed": return {
			met: (input.elapsedMs ?? 0) <= 9e4,
			label: "Beat the 90-second rush"
		};
		case "combo": return {
			met: input.combo >= 5,
			label: "Reach a 5-word combo"
		};
		case "hidden": return {
			met: input.bonusWords >= 1,
			label: "Find at least 1 bonus word"
		};
		case "ice": return {
			met: input.specialHits?.has("ice") === true,
			label: "Trigger an ice cell"
		};
		case "bomb": return {
			met: input.specialHits?.has("bomb") === true,
			label: "Trigger a bomb cell"
		};
		case "perfect": return {
			met: input.perfect,
			label: "Zero mistakes and zero hints"
		};
		case "treasure": return {
			met: input.bonusWords >= 2,
			label: "Find 2 bonus words"
		};
	}
}
function dailyChallengeRewardMultiplier(challenge, input) {
	if (!challenge) return 1;
	let multiplier = challenge.rewardMultiplier;
	if (challenge.id === "perfect" && input.perfect) multiplier += .15;
	if (challenge.id === "combo" && input.combo >= 5) multiplier += .1;
	if (challenge.id === "treasure" && input.bonusWords >= 2) multiplier += .1;
	return Math.min(1.5, multiplier);
}
function key(r, c) {
	return `${r},${c}`;
}
function mulberry(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
/** Deterministic special tiles. Normal hazards avoid target words; Daily Ice/Bomb deliberately attach to a target cell. */
function specialTilesForPuzzle(puzzle) {
	const used = /* @__PURE__ */ new Set();
	for (const p of puzzle.placements) for (const [r, c] of p.cells) used.add(key(r, c));
	const candidates = [];
	for (let r = 0; r < puzzle.size; r++) for (let c = 0; c < puzzle.size; c++) if (!used.has(key(r, c))) candidates.push([r, c]);
	const rng = mulberry(hashSeed("special-v2", puzzle.seed));
	const out = [];
	const forced = puzzle.dailyChallengeId === "ice" ? "ice" : puzzle.dailyChallengeId === "bomb" ? "bomb" : null;
	if (forced && puzzle.placements[0]?.cells[0]) out.push({
		kind: forced,
		cell: puzzle.placements[0].cells[0]
	});
	const occupied = new Set(out.map((t) => key(...t.cell)));
	const cap = Math.min(Math.max(3, Math.floor(puzzle.size / 2)), candidates.length);
	for (const cell of candidates) {
		const roll = rng();
		let kind = null;
		if (roll < .018) kind = "bomb";
		else if (roll < .05) kind = "ice";
		else if (roll < .082) kind = "locked";
		else if (roll < .105) kind = "moving";
		if (kind && !occupied.has(key(...cell))) {
			out.push({
				kind,
				cell
			});
			occupied.add(key(...cell));
		}
		if (out.length >= cap) break;
	}
	return out;
}
function movingPositions(tiles, tick) {
	const moving = tiles.filter((t) => t.kind === "moving");
	const occupied = new Set(tiles.filter((t) => t.kind !== "moving").map((t) => key(...t.cell)));
	const result = /* @__PURE__ */ new Map();
	for (const t of tiles) if (t.kind !== "moving") result.set(key(...t.cell), t.kind);
	if (!moving.length) return result;
	const anchors = moving.map((t) => t.cell);
	for (let i = 0; i < moving.length; i++) {
		const [r, c] = anchors[(i + tick) % anchors.length];
		if (!occupied.has(key(r, c))) result.set(key(r, c), "moving");
	}
	return result;
}
function clipAtLocked(cells, specials) {
	const out = [];
	for (const cell of cells) {
		if (specials.get(key(...cell)) === "locked") break;
		out.push(cell);
	}
	return out;
}
function specialKindsAt(cells, specials) {
	const kinds = /* @__PURE__ */ new Set();
	for (const cell of cells) {
		const kind = specials.get(key(...cell));
		if (kind) kinds.add(kind);
	}
	return kinds;
}
var JOURNEY_WORLDS = [
	{
		id: "green-meadows",
		world: 1,
		name: "Green Meadows",
		subtitle: "Where the first words awaken",
		from: 1,
		to: 333,
		story: "Mira discovers a living trail of words. Restore the meadow's lost ink and follow it toward the first gate.",
		hero: "Mira the Archivist",
		boss: "The Ink Stag",
		bossTitle: "Guardian of the First Trail",
		chestCoins: 300,
		chestDiamonds: 2,
		theme: "meadow",
		mechanics: ["Combo", "Golden Words"]
	},
	{
		id: "crystal-caves",
		world: 2,
		name: "Crystal Caves",
		subtitle: "Echoes beneath the earth",
		from: 334,
		to: 666,
		story: "The trail descends into crystal halls where every echo hides a forgotten word. Light the cave beacons to continue.",
		hero: "Rowan the Ranger",
		boss: "The Crystal Wyrm",
		bossTitle: "Keeper of the Echo Vault",
		chestCoins: 550,
		chestDiamonds: 3,
		theme: "crystal",
		mechanics: ["Ice Tiles", "Locked Tiles"]
	},
	{
		id: "ancient-desert",
		world: 3,
		name: "Ancient Desert",
		subtitle: "The atlas buried in gold",
		from: 667,
		to: 999,
		story: "A buried atlas points across the dunes. Decode its ancient vocabulary before the sandstorm erases the trail.",
		hero: "Safa the Cartographer",
		boss: "The Sand Colossus",
		bossTitle: "Warden of the Lost Atlas",
		chestCoins: 800,
		chestDiamonds: 4,
		theme: "desert",
		mechanics: ["Bomb Tiles", "Timed Challenges"]
	},
	{
		id: "frozen-kingdom",
		world: 4,
		name: "Frozen Kingdom",
		subtitle: "Break the silence of the ice",
		from: 1e3,
		to: 1333,
		story: "A frozen kingdom has forgotten its own name. Melt the word seals and restore the royal archive.",
		hero: "Orin the Climber",
		boss: "The Frost Queen",
		bossTitle: "Sovereign of Silent Words",
		chestCoins: 1100,
		chestDiamonds: 5,
		theme: "arctic",
		mechanics: ["Ice Chains", "Moving Obstacles"]
	},
	{
		id: "shadow-forest",
		world: 5,
		name: "Shadow Forest",
		subtitle: "Where hidden words move",
		from: 1334,
		to: 1666,
		story: "The forest rearranges itself whenever a word is found. Track the moving trail and defeat the shadow that feeds on forgotten words.",
		hero: "Lyra the Stargazer",
		boss: "The Shadow Beast",
		bossTitle: "Devourer of Lost Words",
		chestCoins: 1500,
		chestDiamonds: 6,
		theme: "forest",
		mechanics: ["Moving Obstacles", "Hidden Words"]
	},
	{
		id: "sky-islands",
		world: 6,
		name: "Sky Islands",
		subtitle: "The final archive above the clouds",
		from: 1667,
		to: 2e3,
		story: "The final fragments float above the clouds. Rebuild the Sky Archive and confront the guardian of the complete word atlas.",
		hero: "Aero the Keeper",
		boss: "Atlas Prime",
		bossTitle: "Guardian of the Final Archive",
		chestCoins: 2200,
		chestDiamonds: 10,
		theme: "sky",
		mechanics: ["Mixed Hazards", "Boss Rules"]
	}
];
function journeyWorldForLevel(level) {
	return JOURNEY_WORLDS.find((w) => level >= w.from && level <= w.to) ?? JOURNEY_WORLDS[0];
}
function journeyWorldProgress(save, world) {
	const completed = Math.max(0, Math.min(world.to - world.from + 1, save.unlockedLevel - world.from));
	const total = world.to - world.from + 1;
	return Math.round(completed / total * 100);
}
function isJourneyBoss(level) {
	return JOURNEY_WORLDS.some((w) => level === w.to);
}
function chestKey(world) {
	return `journey-chest-${world}`;
}
function chestClaimed(save, world) {
	return save.inventory.includes(chestKey(world));
}
/** Pure, idempotent chest transition used by the store and progression simulations. */
function claimJourneyChest(save, world) {
	const target = JOURNEY_WORLDS.find((w) => w.world === world);
	if (!target || !save.results[String(target.to)] || chestClaimed(save, world)) return null;
	return {
		...save,
		coins: save.coins + target.chestCoins,
		diamonds: save.diamonds + target.chestDiamonds,
		inventory: [...save.inventory, chestKey(world)]
	};
}
var PET_PROFILES = [
	{
		id: "dog",
		name: "Lucky Dog",
		rarity: "common",
		ability: "energy_saver",
		basePower: 3,
		maxLevel: 20
	},
	{
		id: "cat",
		name: "Clever Cat",
		rarity: "common",
		ability: "extra_coins",
		basePower: 4,
		maxLevel: 20
	},
	{
		id: "eagle",
		name: "Sky Eagle",
		rarity: "rare",
		ability: "reveal",
		basePower: 5,
		maxLevel: 25
	},
	{
		id: "wolf",
		name: "Streak Wolf",
		rarity: "rare",
		ability: "combo_guard",
		basePower: 6,
		maxLevel: 25
	},
	{
		id: "fox",
		name: "Golden Fox",
		rarity: "epic",
		ability: "extra_xp",
		basePower: 8,
		maxLevel: 30
	},
	{
		id: "dragon",
		name: "Time Dragon",
		rarity: "legendary",
		ability: "time_boost",
		basePower: 10,
		maxLevel: 40
	}
];
function petProfile(id) {
	return PET_PROFILES.find((p) => p.id === id) ?? null;
}
function petPower(id, level) {
	const p = petProfile(id);
	if (!p) return 0;
	return p.basePower + Math.max(0, level - 1);
}
function petUpgradeCost(id, level) {
	const p = petProfile(id);
	if (!p) return Number.MAX_SAFE_INTEGER;
	const rarity = {
		common: 1,
		rare: 2,
		epic: 4,
		legendary: 8
	}[p.rarity];
	return Math.floor(60 * rarity * Math.pow(1.28, Math.max(0, level - 1)));
}
function petEffect(id, level) {
	const p = petProfile(id);
	if (!p) return {};
	const power = petPower(id, level);
	switch (p.ability) {
		case "energy_saver": return { energyReductionPercent: Math.min(25, power) };
		case "combo_guard": return { comboGuard: Math.min(3, Math.floor(power / 4)) };
		case "extra_coins": return { coinBonusPercent: Math.min(40, power * 2) };
		case "extra_xp": return { xpBonusPercent: Math.min(50, power * 2) };
		case "reveal": return { startingReveals: Math.min(3, Math.ceil(power / 5)) };
		case "time_boost": return { timeBonusPercent: Math.min(30, power * 2) };
		default: return {};
	}
}
var PET_EVOLUTION_THRESHOLDS = [
	0,
	100,
	250,
	500,
	900
];
function petXpEarned(input) {
	return 12 + (input.perfect ? 8 : 0) + (input.boss ? 20 : 0);
}
function petLevelFromXp(xp) {
	const safe = Math.max(0, Math.floor(xp));
	let level = 1;
	for (let i = 0; i < PET_EVOLUTION_THRESHOLDS.length; i++) if (safe >= PET_EVOLUTION_THRESHOLDS[i]) level = i + 1;
	return level;
}
function petXpProgress(xp) {
	const safe = Math.max(0, Math.floor(xp));
	const level = petLevelFromXp(safe);
	const current = PET_EVOLUTION_THRESHOLDS[level - 1] ?? 0;
	const next = PET_EVOLUTION_THRESHOLDS[level] ?? current;
	if (next === current) return {
		level,
		current,
		next: null,
		percent: 100
	};
	return {
		level,
		current,
		next,
		percent: Math.round((safe - current) / (next - current) * 100)
	};
}
function petEvolutionName(level) {
	return level >= 5 ? "Legendary" : level >= 4 ? "Radiant" : level >= 3 ? "Brave" : level >= 2 ? "Awakened" : "Companion";
}
/**
* Lightweight, deterministic pacing based on the player's recent completed levels.
* It changes pressure rather than secretly changing puzzle correctness.
*/
function adaptivePlan(save, level) {
	const recent = Object.entries(save.results).filter(([k]) => /^\d+$/.test(k)).map(([k, result]) => ({
		level: Number(k),
		result
	})).filter((x) => x.level < level).sort((a, b) => b.level - a.level).slice(0, 5);
	if (recent.length < 3) return {
		tier: "steady",
		timeMultiplier: 1,
		startingReveals: 0,
		bonusTarget: 0,
		surprise: false
	};
	const struggling = recent.filter(({ result }) => result.stars <= 1 || result.timeMs > 12e4).length;
	const expert = recent.filter(({ result }) => result.stars === 3 && result.perfect).length;
	if (struggling >= 3) return {
		tier: "assist",
		timeMultiplier: 1.12,
		startingReveals: 1,
		bonusTarget: 0,
		surprise: false
	};
	if (expert >= 4) return {
		tier: "expert",
		timeMultiplier: .92,
		startingReveals: 0,
		bonusTarget: 1,
		surprise: true
	};
	return {
		tier: "steady",
		timeMultiplier: 1,
		startingReveals: 0,
		bonusTarget: 0,
		surprise: false
	};
}
function shortTermGoals(input) {
	const goals = [
		{
			id: "level",
			label: `Clear Level ${input.level}`,
			done: input.found >= input.total
		},
		{
			id: "stars",
			label: "Aim for 3 stars",
			done: (input.stars ?? 0) >= 3
		},
		{
			id: "combo",
			label: "Build a x3 combo",
			done: input.combo >= 3
		}
	];
	if (input.daily) goals.push({
		id: "daily",
		label: "Finish today's challenge",
		done: input.found >= input.total
	});
	if (input.bonus > 0 || input.adaptiveTier === "expert") goals.push({
		id: "bonus",
		label: input.adaptiveTier === "expert" ? "Find 1 bonus word" : "Find a bonus word",
		done: input.bonus > 0
	});
	return goals.slice(0, 4);
}
function worldRestoration(save, world = journeyWorldForLevel(save.unlockedLevel)) {
	const total = world.to - world.from + 1;
	let completed = 0;
	for (let level = world.from; level <= world.to; level++) if (save.results[String(level)]) completed++;
	const percent = Math.round(completed / total * 100);
	return {
		completed,
		total,
		percent,
		stage: percent >= 100 ? "complete" : percent >= 80 ? "thriving" : percent >= 60 ? "expansion" : percent >= 40 ? "restoration" : percent >= 20 ? "discovery" : "untouched"
	};
}
function nextChallengePreview(level, puzzle) {
	const kinds = [...new Set(specialTilesForPuzzle(puzzle).map((tile) => tile.kind))];
	if (level > 0 && level % 25 === 0) return {
		label: "Boss Gate",
		detail: journeyWorldForLevel(level).boss,
		icon: "🐉"
	};
	if (kinds.includes("moving")) return {
		label: "Moving Obstacles",
		detail: "The grid shifts while you search",
		icon: "🌪️"
	};
	if (kinds.includes("bomb")) return {
		label: "Bomb Tiles",
		detail: "Watch the blast zone",
		icon: "💣"
	};
	if (kinds.includes("ice")) return {
		label: "Ice Tiles",
		detail: "Frozen cells briefly lock your input",
		icon: "❄️"
	};
	if (kinds.includes("locked")) return {
		label: "Locked Letters",
		detail: "Paths stop at locked cells",
		icon: "🔒"
	};
	if (level % 7 === 0) return {
		label: "Golden Word",
		detail: "Chain a combo for a bonus",
		icon: "✨"
	};
	return {
		label: "Fresh Puzzle",
		detail: "A new word set awaits",
		icon: "🧩"
	};
}
function petXpFor(pet, save) {
	return pet ? save.petXp?.[pet] ?? 0 : 0;
}
var clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
var blend = (old, signal, weight = .14) => old + (signal - old) * weight;
function defaultProfile() {
	return {
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
	};
}
function profileFrom(raw) {
	return {
		...defaultProfile(),
		...raw ?? {}
	};
}
function personalizationEnabled(save) {
	return save.settings.personalization !== false;
}
function profileFor(save) {
	return profileFrom(save.behaviorProfile);
}
function applyIntelligenceEvent(save, event) {
	if (!personalizationEnabled(save)) return save;
	const p = profileFor(save);
	const next = { ...p };
	if (event.type === "level_start") {
		next.recent_engagement = clamp(blend(p.recent_engagement, 65));
		next.updatedAt = Date.now();
	} else if (event.type === "word_found") {
		next.recent_engagement = clamp(blend(p.recent_engagement, 72));
		next.combo_best = Math.max(p.combo_best, event.combo);
		next.category_affinity = {
			...p.category_affinity,
			[event.category]: (p.category_affinity[event.category] ?? 0) + 1
		};
	} else if (event.type === "hint_used") {
		next.hints = p.hints + 1;
		next.hint_dependency = clamp(blend(p.hint_dependency, 100, .08));
	} else if (event.type === "level_complete") {
		const fastSignal = event.timeMs <= 75e3 ? 100 : event.timeMs >= 15e4 ? 0 : 50;
		const skillSignal = event.perfect ? 95 : event.stars >= 3 ? 80 : event.stars <= 1 ? 30 : 58;
		const categoryAffinity = {
			...p.category_affinity,
			[event.category]: (p.category_affinity[event.category] ?? 0) + 2
		};
		const rewardAffinity = {
			...p.reward_affinity,
			coins: (p.reward_affinity.coins ?? 0) + Math.max(1, event.rewardCoins)
		};
		const completions = p.completions + 1;
		next.skill_score = clamp(blend(p.skill_score, skillSignal));
		next.difficulty_preference = clamp(blend(p.difficulty_preference, event.stars >= 3 ? 82 : event.stars <= 1 ? 24 : 55));
		next.speed_preference = clamp(blend(p.speed_preference, fastSignal));
		next.challenge_affinity = clamp(blend(p.challenge_affinity, event.daily || event.mode !== "classic" ? 90 : 40));
		next.pet_affinity = clamp(blend(p.pet_affinity, event.pet ? 100 : 0));
		next.collection_affinity = clamp(blend(p.collection_affinity, event.rewardCoins >= 80 ? 80 : 45));
		next.hint_dependency = clamp(blend(p.hint_dependency, event.hints ? Math.min(100, event.hints * 30) : 0));
		next.recent_engagement = clamp(blend(p.recent_engagement, event.perfect ? 96 : 76));
		next.average_completion_ms = p.average_completion_ms ? Math.round(p.average_completion_ms + (event.timeMs - p.average_completion_ms) / completions) : event.timeMs;
		next.completions = completions;
		next.hints = p.hints + event.hints;
		next.combo_best = Math.max(p.combo_best, event.combo);
		next.session_levels = p.session_levels + 1;
		next.preferred_worlds = [event.world, ...p.preferred_worlds.filter((w) => w !== event.world)].slice(0, 6);
		next.preferred_categories = Object.entries(categoryAffinity).sort((a, b) => b[1] - a[1]).map(([k]) => k).slice(0, 6);
		next.category_affinity = categoryAffinity;
		next.reward_affinity = rewardAffinity;
		next.updatedAt = Date.now();
	} else if (event.type === "level_fail") {
		next.failures = p.failures + 1;
		next.skill_score = clamp(blend(p.skill_score, 25));
		next.recent_engagement = clamp(blend(p.recent_engagement, 30));
		next.last_close_level = event.level;
		next.updatedAt = Date.now();
	} else if (event.type === "session_end") {
		next.quits = p.quits + 1;
		next.last_close_level = event.level;
		next.recent_engagement = clamp(blend(p.recent_engagement, event.completedLevels > 0 ? 70 : 35));
		next.updatedAt = Date.now();
	}
	return {
		...save,
		behaviorProfile: {
			...profileFrom(next),
			...next
		}
	};
}
function intelligenceAdaptivePlan(save, level) {
	if (!personalizationEnabled(save)) return adaptivePlan(save, level);
	const p = profileFor(save);
	const recent = Object.entries(save.results).filter(([k]) => /^\d+$/.test(k) && Number(k) < level).sort((a, b) => Number(b[0]) - Number(a[0])).slice(0, 5).map(([, r]) => r);
	const struggling = recent.filter((r) => r.stars <= 1 || r.timeMs > 12e4).length;
	const expert = recent.filter((r) => r.stars === 3 && r.perfect).length;
	if (struggling >= 2 || p.hint_dependency >= 70 && p.recent_engagement < 50) return {
		tier: "assist",
		timeMultiplier: 1.12,
		startingReveals: 1,
		bonusTarget: 0,
		surprise: false
	};
	if ((expert >= 3 || p.skill_score >= 78) && p.difficulty_preference >= 65) return {
		tier: "expert",
		timeMultiplier: .94,
		startingReveals: 0,
		bonusTarget: 1,
		surprise: true
	};
	return {
		tier: "steady",
		timeMultiplier: 1,
		startingReveals: 0,
		bonusTarget: 0,
		surprise: false
	};
}
function personalizedRewardMultiplier(save, rewardKind) {
	if (!personalizationEnabled(save)) return 1;
	const p = profileFor(save);
	const score = rewardKind === "pet" ? p.pet_affinity : rewardKind === "collection" ? p.collection_affinity : rewardKind === "speed" ? p.speed_preference : rewardKind === "challenge" ? p.challenge_affinity : 50;
	return 1 + Math.min(.1, Math.max(0, (score - 60) / 400));
}
//#endregion
export { petEvolutionName as A, rewardCoins as B, modeRules as C, personalizationEnabled as D, observeCompletion as E, petXpFor as F, worldRestoration as G, specialKindsAt as H, petXpProgress as I, xpForClear$1 as J, writeSave as K, playerLevel as L, petProfile as M, petUpgradeCost as N, personalizedRewardMultiplier as O, petXpEarned as P, recordLevelResult as R, migrateSave as S, nextChallengePreview as T, specialTilesForPuzzle as U, shortTermGoals as V, starsFor as W, xpForLevel as Y, isJourneyBoss as _, applyIntelligenceEvent as a, loadSave as b, clipAtLocked as c, dailyChallengeRewardMultiplier as d, defaultSave as f, intelligenceAdaptivePlan as g, importSave as h, SPIN_TABLE as i, petPower as j, petEffect as k, dailyChallengeFor as l, exportSave as m, JOURNEY_WORLDS as n, chestClaimed as o, energyEta as p, xpForClear as q, SHOP as r, claimJourneyChest as s, ADVANCED_MODE_CATALOG as t, dailyChallengeObjective as u, journeyWorldForLevel as v, movingPositions as w, mergeSaves as x, journeyWorldProgress as y, refillEnergy as z };
