import { i as ENERGY_REFILL_MS, n as DIRS_4, r as DIRS_8, s as MAX_LEVEL } from "./constants-Dk3tQPVz.mjs";
import { r as CATEGORY_IDS } from "./words-p0ihLMcj.mjs";
import { i as mulberry32, n as generatePuzzle, o as pickCategory, r as hashSeed } from "./generator-CBm_o8QT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rewardPersonalization-C2MPG8BL.js
var WORLDS = [
	{
		id: "meadow",
		name: "Green Meadows",
		from: 1,
		to: 333,
		blurb: "Where the first words awaken."
	},
	{
		id: "crystal",
		name: "Crystal Caves",
		from: 334,
		to: 666,
		blurb: "Echoes beneath the earth."
	},
	{
		id: "desert",
		name: "Ancient Desert",
		from: 667,
		to: 999,
		blurb: "The atlas buried in gold."
	},
	{
		id: "frozen",
		name: "Frozen Kingdom",
		from: 1e3,
		to: 1333,
		blurb: "Break the silence of the ice."
	},
	{
		id: "shadow",
		name: "Shadow Forest",
		from: 1334,
		to: 1666,
		blurb: "Where hidden words move."
	},
	{
		id: "sky",
		name: "Sky Islands",
		from: 1667,
		to: 2e3,
		blurb: "The final archive above the clouds."
	}
];
function worldOf(level) {
	return WORLDS.find((w) => level >= w.from && level <= w.to) ?? WORLDS[0];
}
function isBoss(level) {
	return level > 0 && WORLDS.some((w) => level === w.to);
}
function specFor(level) {
	const n = Math.max(1, Math.min(MAX_LEVEL, level));
	const tier = Math.floor((n - 1) / 250);
	const size = Math.min(20, 8 + Math.floor(n / 220) * 2);
	const wordCount = Math.min(24, 5 + Math.floor(n / 110));
	const minLen = Math.min(6, 3 + Math.floor(n / 700));
	const maxLen = Math.min(size, 6 + Math.floor(n / 140));
	const directions = tier === 0 ? DIRS_4.slice() : DIRS_8.slice();
	const reverseWeight = Math.min(.75, .12 + n / 3e3);
	const baseTime = Math.max(35, 12 + size * 2.2 + wordCount * 3.5);
	return {
		size,
		wordCount,
		directions,
		minLen,
		maxLen,
		reverseWeight,
		timeLimit: isBoss(n) ? Math.round(baseTime * .75) : void 0
	};
}
function modeMods(mode, spec) {
	const next = {
		...spec,
		directions: spec.directions.slice()
	};
	if (mode === "blitz") next.timeLimit = Math.max(35, Math.floor((spec.timeLimit ?? 75) * .55));
	else if (mode === "timed") next.timeLimit = spec.timeLimit ?? 20 * spec.size;
	else if (mode === "boss") {
		next.wordCount += 2;
		next.timeLimit = spec.timeLimit ?? 120;
	} else if (mode === "zen" || mode === "endless") next.timeLimit = void 0;
	else if (mode === "small_grid") {
		next.size = Math.max(8, spec.size - 2);
		next.wordCount = Math.max(5, spec.wordCount - 1);
		next.maxLen = Math.min(next.maxLen, next.size - 1);
	} else if (mode === "giant_grid") {
		next.size = Math.min(20, spec.size + 4);
		next.wordCount = Math.min(24, spec.wordCount + 3);
		next.maxLen = Math.min(next.size, next.maxLen + 2);
	} else if (mode === "diagonal") next.directions = DIRS_8.filter(([dr, dc]) => Math.abs(dr) === 1 && Math.abs(dc) === 1);
	else if (mode === "orthogonal") next.directions = DIRS_4.slice();
	else if (mode === "rush" || mode === "speedrun") next.timeLimit = Math.max(25, Math.floor((spec.timeLimit ?? 90) * .6));
	else if (mode === "nightmare" || mode === "chaos") {
		next.wordCount = Math.min(24, spec.wordCount + 3);
		next.timeLimit = Math.max(25, Math.floor((spec.timeLimit ?? 100) * .55));
	} else if (mode === "marathon") {
		next.wordCount = Math.min(24, spec.wordCount + 5);
		next.timeLimit = spec.timeLimit ? Math.floor(spec.timeLimit * 2) : void 0;
	} else if (mode === "focus") next.timeLimit = spec.timeLimit ? Math.floor(spec.timeLimit * 1.5) : void 0;
	else if (mode === "hardcore" || mode === "precision") next.timeLimit = spec.timeLimit ? Math.floor(spec.timeLimit * .8) : void 0;
	else if (mode === "random_rules") {
		const roll = Math.abs(levelHash(mode, spec.size, spec.wordCount)) % 4;
		if (roll === 0) next.directions = DIRS_4.slice();
		if (roll === 1) next.directions = DIRS_8.filter(([dr, dc]) => Math.abs(dr) === Math.abs(dc));
		if (roll === 2) next.timeLimit = Math.max(25, Math.floor((spec.timeLimit ?? 90) * .65));
		if (roll === 3) next.wordCount = Math.min(24, spec.wordCount + 4);
	}
	return next;
}
function puzzleForLevel(level, mode = "classic", language = "en") {
	const spec = modeMods(mode, specFor(level));
	const seed = hashSeed("mwsj", level, mode);
	const rng = mulberry32(seed);
	const category = CATEGORY_IDS[level % CATEGORY_IDS.length];
	const dirs = weightedDirs(spec, rng);
	const world = worldOf(level);
	return generatePuzzle({
		seed,
		size: spec.size,
		wordCount: spec.wordCount,
		minLen: spec.minLen,
		maxLen: spec.maxLen,
		dirs,
		category: pickCategory(rng, category),
		title: isBoss(level) ? `Boss ${level}` : `${world.name} ${level}`,
		language,
		script: [
			"ur",
			"sd",
			"ps"
		].includes(language) ? "urdu" : "latin"
	});
}
function puzzleForDaily(dayKey, language = "en", dailyChallengeId) {
	const seed = hashSeed("daily", dayKey);
	specFor(250);
	return generatePuzzle({
		seed,
		size: 12,
		wordCount: 10,
		minLen: 4,
		maxLen: 9,
		dirs: DIRS_8,
		category: pickCategory(mulberry32(seed)),
		title: `Daily ${dayKey}`,
		dailyChallengeId,
		language,
		script: [
			"ur",
			"sd",
			"ps"
		].includes(language) ? "urdu" : "latin"
	});
}
function puzzleEndless(round, seedBase, language = "en") {
	const seed = hashSeed("endless", seedBase, round);
	const size = 8 + round % 5 * 2;
	return generatePuzzle({
		seed,
		size: Math.min(16, size),
		wordCount: 5 + round % 8,
		minLen: 3,
		maxLen: Math.min(10, size - 1),
		dirs: round % 2 === 0 ? DIRS_4 : DIRS_8,
		category: pickCategory(mulberry32(seed)),
		title: `Endless ${round + 1}`,
		language,
		script: [
			"ur",
			"sd",
			"ps"
		].includes(language) ? "urdu" : "latin"
	});
}
function levelHash(a, b, c) {
	return hashSeed("mode", a, b, c);
}
function weightedDirs(spec, rng) {
	const dirs = spec.directions.slice();
	if (spec.reverseWeight <= 0) return dirs;
	return dirs;
}
function todayKey(d = /* @__PURE__ */ new Date()) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function targetTimeMs(level, wordCount, size) {
	return Math.max(6e4, Math.min(12e4, (8 + size * 1.6 + wordCount * 4) * 1e3));
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
function recommendFor(save) {
	const p = profileFor(save);
	if (!personalizationEnabled(save)) return {
		id: "steady",
		title: "Continue Journey",
		detail: "Personalization is off; the journey stays on its standard path.",
		priority: "now"
	};
	if (p.failures >= 3 && p.failures > p.completions * .25) return {
		id: "assist",
		title: "Gentle Assist",
		detail: "A slightly calmer board and optional help are ready.",
		priority: "now"
	};
	if (p.speed_preference >= 72 && p.skill_score >= 68) return {
		id: "speed",
		title: "60-Second Speed Run",
		detail: "Your recent pace fits a fast challenge.",
		priority: "now"
	};
	if (p.difficulty_preference >= 72 && p.skill_score >= 68) return {
		id: "mastery",
		title: "Mastery Challenge",
		detail: "Harder bonus objectives are ready.",
		priority: "next"
	};
	if (p.pet_affinity >= 68) return {
		id: "pets",
		title: "Pet Quest",
		detail: "Your equipped-pet play style has a useful next objective.",
		priority: "next"
	};
	if (p.collection_affinity >= 68) return {
		id: "collection",
		title: "Collection Hunt",
		detail: "A collectible-focused objective is available.",
		priority: "next"
	};
	if (p.challenge_affinity >= 68) return {
		id: "daily",
		title: "Today's Challenge",
		detail: "A short challenge matches your recent play style.",
		priority: "next"
	};
	return {
		id: "steady",
		title: `Continue Level ${save.unlockedLevel}`,
		detail: "The next puzzle is tuned to your recent pace.",
		priority: "now"
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
export { petXpFor as A, rewardCoins as B, personalizedRewardMultiplier as C, petProfile as D, petPower as E, puzzleForDaily as F, starsFor as G, specFor as H, puzzleForLevel as I, worldOf as J, targetTimeMs as K, recommendFor as L, playerLevel as M, profileFor as N, petUpgradeCost as O, puzzleEndless as P, xpForLevel as Q, recordLevelResult as R, personalizationEnabled as S, petEvolutionName as T, specialKindsAt as U, shortTermGoals as V, specialTilesForPuzzle as W, xpForClear as X, worldRestoration as Y, xpForClear$1 as Z, journeyWorldProgress as _, WORLDS as a, movingPositions as b, clipAtLocked as c, dailyChallengeRewardMultiplier as d, energyEta as f, journeyWorldForLevel as g, isJourneyBoss as h, SPIN_TABLE as i, petXpProgress as j, petXpEarned as k, dailyChallengeFor as l, isBoss as m, JOURNEY_WORLDS as n, applyIntelligenceEvent as o, intelligenceAdaptivePlan as p, todayKey as q, SHOP as r, chestClaimed as s, ADVANCED_MODE_CATALOG as t, dailyChallengeObjective as u, modeMods as v, petEffect as w, nextChallengePreview as x, modeRules as y, refillEnergy as z };
