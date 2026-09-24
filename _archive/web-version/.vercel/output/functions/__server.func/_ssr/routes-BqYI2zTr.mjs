import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, b as Navigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Cmpo3hKv.mjs";
import { i as signOut, r as signIn, t as authClient } from "./client-COJc7NkC.mjs";
import { C as targetTimeMs, S as specFor, T as worldOf, _ as puzzleEndless, a as HINT_COST, d as cellsAlong, f as hashSeed, g as mulberry32, l as WORLDS, m as isWord, n as CATEGORIES, o as MAX_LEVEL, p as isBoss, r as CATEGORY_IDS, s as PLAY_KEY, t as ALL_WORDS, u as categoryOf, v as puzzleForDaily, w as todayKey, x as snapDir, y as puzzleForLevel } from "./levels-DBG2bxfj.mjs";
import { A as petEvolutionName, B as rewardCoins, C as modeRules, D as personalizationEnabled, E as observeCompletion, F as petXpFor, G as worldRestoration, I as petXpProgress, K as writeSave, L as playerLevel, M as petProfile, N as petUpgradeCost, O as personalizedRewardMultiplier, P as petXpEarned, R as recordLevelResult, T as nextChallengePreview, U as specialTilesForPuzzle, V as shortTermGoals, W as starsFor, Y as xpForLevel, _ as isJourneyBoss, a as applyIntelligenceEvent, b as loadSave, d as dailyChallengeRewardMultiplier, f as defaultSave, g as intelligenceAdaptivePlan, h as importSave, i as SPIN_TABLE, k as petEffect, l as dailyChallengeFor, m as exportSave, n as JOURNEY_WORLDS, o as chestClaimed, p as energyEta, q as xpForClear, r as SHOP, s as claimJourneyChest, t as ADVANCED_MODE_CATALOG, u as dailyChallengeObjective, v as journeyWorldForLevel, w as movingPositions, x as mergeSaves, y as journeyWorldProgress, z as refillEnergy } from "./rewardPersonalization-BDFGfk_j.mjs";
import { a as GROK_PROVIDERS, i as hasGateSessionMarker } from "./verify.server-CdYricdb.mjs";
import { $ as ChevronLeft, A as Mail, B as Gamepad2, C as PawPrint, D as MessageCircle, E as Mic, F as HardDrive, H as Flag, I as Hammer, J as CreditCard, K as Earth, L as Gift, M as Lightbulb, N as Languages, O as Map$1, P as House, Q as ChevronRight, R as Gem, S as PenTool, T as PackageCheck, U as FileCheck2, V as Flame, W as Eye, X as Clock3, Y as Coins, Z as ClipboardCheck, _ as ShieldCheck, a as Wallet, at as BrainCircuit, b as Route, c as Trophy, ct as Bell, d as Swords, dt as Activity, et as Check, f as Star, ft as Accessibility, h as ShoppingBag, i as WandSparkles, it as CalendarDays, j as Lock, k as MapPin, m as Smartphone, n as Wrench, nt as ChartLine, o as Users, ot as Bot, p as Sparkles, q as Crown, r as Wifi, rt as CalendarRange, s as User, st as BookOpen, t as Zap, tt as ChartColumn, u as Target, ut as Archive, v as ScrollText, w as Pause, x as RefreshCw, y as Scale, z as Gauge } from "../_libs/lucide-react.mjs";
import { r as showH5Interstitial } from "./router-B2-7B2IN.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BqYI2zTr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CoachScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "Coach Screen"
		})
	});
}
function AdaptiveScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "Adaptive Screen"
		})
	});
}
function JourneyPlannerScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "JourneyPlannerScreen"
		})
	});
}
var ACHIEVEMENTS = [
	{
		id: "a1",
		title: "First Word",
		description: "Find 1 word.",
		metric: "words",
		target: 1,
		reward: 25
	},
	{
		id: "a2",
		title: "Word Hunter",
		description: "Find 100 words.",
		metric: "words",
		target: 100,
		reward: 150
	},
	{
		id: "a3",
		title: "Level Runner",
		description: "Complete 50 levels.",
		metric: "levels",
		target: 50,
		reward: 300
	},
	{
		id: "a4",
		title: "Century",
		description: "Complete 100 levels.",
		metric: "levels",
		target: 100,
		reward: 600
	},
	{
		id: "a5",
		title: "Guardian Slayer",
		description: "Defeat 5 bosses.",
		metric: "bosses",
		target: 5,
		reward: 750
	},
	{
		id: "a6",
		title: "Coin Collector",
		description: "Earn 5000 coins.",
		metric: "coins",
		target: 5e3,
		reward: 1e3
	},
	{
		id: "a7",
		title: "Streak Master",
		description: "Reach a 30-day streak.",
		metric: "streak",
		target: 30,
		reward: 1500
	},
	{
		id: "a8",
		title: "First Clear",
		description: "Complete 1 level.",
		metric: "levels",
		target: 1,
		reward: 40
	},
	{
		id: "a9",
		title: "Ten Trails",
		description: "Complete 10 levels.",
		metric: "levels",
		target: 10,
		reward: 120
	},
	{
		id: "a10",
		title: "Wordsmith",
		description: "Find 25 words.",
		metric: "words",
		target: 25,
		reward: 80
	},
	{
		id: "a11",
		title: "Lexicon",
		description: "Find 500 words.",
		metric: "words",
		target: 500,
		reward: 400
	},
	{
		id: "a12",
		title: "Atlas Keeper",
		description: "Complete 250 levels.",
		metric: "levels",
		target: 250,
		reward: 1200
	}
];
function achievementProgress(a, stats) {
	const k = a.metric === "levels" ? "levelsCompleted" : a.metric === "words" ? "wordsFound" : a.metric === "coins" ? "coinsEarned" : a.metric === "bosses" ? "bossesDefeated" : "bestStreak";
	const v = Number(stats[k] ?? 0);
	return {
		value: Math.min(v, a.target),
		done: v >= a.target
	};
}
function unlockedAchievements(save) {
	return ACHIEVEMENTS.filter((a) => achievementProgress(a, save.stats).done).map((a) => a.id);
}
var PETS = [
	{
		id: "dog",
		name: "Inkhound",
		role: "Hints",
		blurb: "Noses the first letter once per puzzle.",
		coins: 0,
		diamonds: 0,
		perk: "hint"
	},
	{
		id: "cat",
		name: "Margin Cat",
		role: "Speed",
		blurb: "Trims a few seconds off the clock.",
		coins: 240,
		diamonds: 0,
		perk: "speed"
	},
	{
		id: "eagle",
		name: "Ridge Eagle",
		role: "Vision",
		blurb: "Reveals a distant cell at the start.",
		coins: 280,
		diamonds: 0,
		perk: "vision"
	},
	{
		id: "dragon",
		name: "Ember Drake",
		role: "Fire",
		blurb: "Bonus coins on perfect clears.",
		coins: 0,
		diamonds: 4,
		perk: "coins"
	},
	{
		id: "unicorn",
		name: "Luckhorn",
		role: "Luck",
		blurb: "Richer lucky-spin table.",
		coins: 360,
		diamonds: 0,
		perk: "luck"
	},
	{
		id: "wolf",
		name: "Pack Wolf",
		role: "Streak",
		blurb: "Streaks last through one miss.",
		coins: 300,
		diamonds: 0,
		perk: "streak"
	},
	{
		id: "fox",
		name: "Cipher Fox",
		role: "Smart",
		blurb: "Cheaper letter hints.",
		coins: 320,
		diamonds: 0,
		perk: "cheap"
	},
	{
		id: "turtle",
		name: "Quiet Turtle",
		role: "Zen",
		blurb: "Extra time in timed modes.",
		coins: 200,
		diamonds: 0,
		perk: "time"
	},
	{
		id: "owl",
		name: "Night Owl",
		role: "Night",
		blurb: "Fog mode is a little clearer.",
		coins: 260,
		diamonds: 0,
		perk: "fog"
	},
	{
		id: "dolphin",
		name: "Tide Dolphin",
		role: "Flow",
		blurb: "Energy refills a touch faster.",
		coins: 0,
		diamonds: 3,
		perk: "energy"
	}
];
/** Procedural Web Audio SFX. Unlocks on first gesture. */
var ctx = null;
var master = null;
var sfx = null;
var music = null;
var musicTimer = null;
var vol = {
	master: .8,
	sfx: .7,
	music: .45,
	sfxOn: true,
	musicOn: true
};
function curve(v) {
	return v * v;
}
function applyVolumes(next) {
	Object.assign(vol, next);
	if (master) master.gain.setTargetAtTime(curve(vol.master), ctx.currentTime, .03);
	if (sfx) sfx.gain.setTargetAtTime(vol.sfxOn ? curve(vol.sfx) : 0, ctx.currentTime, .03);
	if (music) music.gain.setTargetAtTime(vol.musicOn ? curve(vol.music) : 0, ctx.currentTime, .05);
}
function unlockAudio() {
	if (typeof window === "undefined") return;
	const AC = window.AudioContext || window.webkitAudioContext;
	if (!AC) return;
	if (!ctx) {
		ctx = new AC({ latencyHint: "interactive" });
		master = ctx.createGain();
		sfx = ctx.createGain();
		music = ctx.createGain();
		sfx.connect(master);
		music.connect(master);
		master.connect(ctx.destination);
		applyVolumes({});
	}
	if (ctx.state === "suspended") ctx.resume();
}
function beep(freq, dur, type, gain = .08, slide = 0) {
	if (!ctx || !sfx || !vol.sfxOn) return;
	const t = ctx.currentTime;
	const o = ctx.createOscillator();
	const g = ctx.createGain();
	o.type = type;
	o.frequency.setValueAtTime(freq, t);
	if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
	g.gain.setValueAtTime(gain, t);
	g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
	o.connect(g);
	g.connect(sfx);
	o.start(t);
	o.stop(t + dur + .02);
}
var sfxPlay = {
	tap: () => beep(620, .05, "triangle", .04),
	select: () => beep(480, .07, "sine", .05),
	found: (combo = 1) => {
		const base = combo >= 5 ? 660 : combo >= 3 ? 587 : 523;
		beep(base, .09, "triangle", .07);
		setTimeout(() => beep(base * 1.5, .12, "triangle", .06), 70);
	},
	miss: () => beep(180, .16, "sawtooth", .04, -80),
	win: () => {
		[
			523,
			659,
			784,
			1046
		].forEach((f, i) => setTimeout(() => beep(f, .16, "triangle", .07), i * 90));
	},
	coin: () => beep(980, .1, "square", .035, 200),
	hint: () => beep(440, .14, "sine", .05, 120),
	spin: () => beep(360, .08, "square", .04)
};
function startMusic(worldIndex = 0) {
	if (!ctx || !music || !vol.musicOn) return;
	stopMusic();
	const notes = [
		[
			196,
			247,
			294,
			330,
			392,
			330,
			294,
			247
		],
		[
			220,
			277,
			330,
			370,
			440,
			370,
			330,
			277
		],
		[
			146,
			185,
			220,
			277,
			330,
			277,
			220,
			185
		],
		[
			174,
			220,
			261,
			329,
			392,
			329,
			261,
			220
		],
		[
			196,
			233,
			293,
			349,
			440,
			349,
			293,
			233
		],
		[
			247,
			294,
			370,
			440,
			554,
			440,
			370,
			294
		]
	][Math.max(0, Math.min(5, worldIndex))];
	let i = 0;
	const step = () => {
		if (!ctx || !music || !vol.musicOn) return;
		const t = ctx.currentTime;
		const o = ctx.createOscillator();
		const g = ctx.createGain();
		o.type = "sine";
		o.frequency.value = notes[i % notes.length];
		g.gain.setValueAtTime(1e-4, t);
		g.gain.exponentialRampToValueAtTime(.035, t + .04);
		g.gain.exponentialRampToValueAtTime(1e-4, t + .7);
		o.connect(g);
		g.connect(music);
		o.start(t);
		o.stop(t + .75);
		i++;
		musicTimer = window.setTimeout(step, 780);
	};
	step();
}
function stopMusic() {
	if (musicTimer != null) {
		clearTimeout(musicTimer);
		musicTimer = null;
	}
}
function sameCells(a, b) {
	if (a.length !== b.length) return false;
	return a.every(([r, c], i) => r === b[i]?.[0] && c === b[i]?.[1]);
}
function directionOf(cells) {
	if (cells.length < 2) return [0, 0];
	return [Math.sign(cells[1][0] - cells[0][0]), Math.sign(cells[1][1] - cells[0][1])];
}
function placementForPath(cells, placements) {
	return placements.find((p) => sameCells(cells, p.cells) || sameCells(cells, [...p.cells].reverse()));
}
function validateModePath(mode, cells, placements) {
	const placement = placementForPath(cells, placements);
	if (!placement) return { ok: true };
	const [dr, dc] = directionOf(cells);
	if (mode === "diagonal" && (Math.abs(dr) !== 1 || Math.abs(dc) !== 1)) return {
		ok: false,
		reason: "Diagonal paths only"
	};
	if (mode === "orthogonal" && !(dr === 0 || dc === 0)) return {
		ok: false,
		reason: "Horizontal/vertical paths only"
	};
	if (mode === "reverse_only") {
		if (sameCells(cells, placement.cells)) return {
			ok: false,
			reason: "Reverse direction required"
		};
	}
	return { ok: true };
}
var DIALOGUES = {
	ch1_intro: {
		id: "ch1_intro",
		speaker: "Mira the Archivist",
		text: "The meadow is waking. Every hidden word is part of an ancient map.",
		choices: [{
			id: "help",
			text: "I'll help you find the map.",
			next: "ch1_help",
			affinity: 2
		}, {
			id: "ask",
			text: "What happened here?",
			next: "ch1_help",
			affinity: 1
		}]
	},
	ch1_help: {
		id: "ch1_help",
		speaker: "Mira the Archivist",
		text: "Then begin with the first trail. Bring me your discoveries.",
		choices: [{
			id: "accept",
			text: "Quest accepted.",
			next: "end",
			reward: 50
		}]
	},
	ch2_intro: {
		id: "ch2_intro",
		speaker: "Rowan the Ranger",
		text: "The cedar forest changes when the wrong words are spoken.",
		choices: [{
			id: "careful",
			text: "I'll tread carefully.",
			next: "end",
			affinity: 2,
			reward: 60
		}, {
			id: "brave",
			text: "Let the forest test me.",
			next: "end",
			affinity: 1,
			reward: 40
		}]
	},
	ch3_intro: {
		id: "ch3_intro",
		speaker: "Orin the Climber",
		text: "The mountain keeps its oath to those who solve its inscriptions.",
		choices: [{
			id: "climb",
			text: "Show me the path.",
			next: "end",
			affinity: 2,
			reward: 80
		}]
	},
	ch4_intro: {
		id: "ch4_intro",
		speaker: "Safa the Cartographer",
		text: "The dunes erased my route. Your word trail can restore it.",
		choices: [{
			id: "map",
			text: "I'll restore the route.",
			next: "end",
			affinity: 2,
			reward: 100
		}]
	},
	ch5_intro: {
		id: "ch5_intro",
		speaker: "Lyra the Stargazer",
		text: "Look beyond the grid. The stars are spelling something.",
		choices: [{
			id: "stars",
			text: "I'll follow the stars.",
			next: "end",
			affinity: 2,
			reward: 120
		}]
	},
	ch6_intro: {
		id: "ch6_intro",
		speaker: "Aero the Keeper",
		text: "The Sky Archives are full of doors that open only to knowledge.",
		choices: [{
			id: "learn",
			text: "Knowledge is my key.",
			next: "end",
			affinity: 2,
			reward: 150
		}]
	},
	ch7_intro: {
		id: "ch7_intro",
		speaker: "Nyx the Warden",
		text: "The abyss feeds on forgotten words. Do not let it win.",
		choices: [{
			id: "stand",
			text: "I will stand against it.",
			next: "end",
			affinity: 3,
			reward: 200
		}]
	},
	ch8_intro: {
		id: "ch8_intro",
		speaker: "Atlas Prime",
		text: "You reached the final atlas. Now discover why this journey began.",
		choices: [{
			id: "final",
			text: "Reveal the truth.",
			next: "end",
			affinity: 5,
			reward: 500
		}]
	}
};
function dialogueForChapter(chapter) {
	return DIALOGUES[`ch${chapter}_intro`] ?? DIALOGUES.ch1_intro;
}
var MATERIALS = [
	{
		id: "wood",
		name: "Wood",
		baseValue: 2
	},
	{
		id: "stone",
		name: "Stone",
		baseValue: 3
	},
	{
		id: "crystal",
		name: "Crystal",
		baseValue: 8
	},
	{
		id: "iron",
		name: "Iron",
		baseValue: 10
	},
	{
		id: "gold",
		name: "Gold",
		baseValue: 20
	}
];
var BUILDINGS = {
	camp: {
		name: "Journey Camp",
		maxLevel: 10,
		baseCost: 100,
		effect: "Increases base energy capacity."
	},
	workshop: {
		name: "Workshop",
		maxLevel: 10,
		baseCost: 140,
		effect: "Improves crafting efficiency."
	},
	forge: {
		name: "Forge",
		maxLevel: 10,
		baseCost: 180,
		effect: "Unlocks stronger equipment."
	},
	library: {
		name: "Word Library",
		maxLevel: 10,
		baseCost: 160,
		effect: "Improves word discovery rewards."
	},
	treasury: {
		name: "Treasury",
		maxLevel: 10,
		baseCost: 220,
		effect: "Improves bonus coin rewards."
	}
};
function buildingUpgradeCost(id, level) {
	const b = BUILDINGS[id];
	if (level >= b.maxLevel) return null;
	return Math.floor(b.baseCost * Math.pow(1.35, level));
}
function materialValue(id, amount) {
	return (MATERIALS.find((x) => x.id === id)?.baseValue ?? 0) * Math.max(0, amount);
}
function craftEquipment(slot, level, materials) {
	const total = Object.entries(materials).reduce((sum, [id, amount]) => sum + materialValue(id, Number(amount)), 0);
	if (total < 30 + level * 15) return null;
	const rarity = total >= 500 ? "legendary" : total >= 250 ? "epic" : total >= 120 ? "rare" : "common";
	const multiplier = {
		common: 1,
		rare: 1.35,
		epic: 1.8,
		legendary: 2.5
	}[rarity];
	return {
		id: `crafted-${slot}-${Date.now()}`,
		name: `${rarity[0].toUpperCase() + rarity.slice(1)} ${slot}`,
		slot,
		level,
		power: Math.floor((10 + level * 7) * multiplier),
		rarity
	};
}
var MISSIONS = [
	{
		id: "d1",
		period: "daily",
		title: "Daily Explorer",
		description: "Complete 3 levels.",
		metric: "levels",
		target: 3,
		reward: 75
	},
	{
		id: "d2",
		period: "daily",
		title: "Daily Wordsmith",
		description: "Find 20 words.",
		metric: "words",
		target: 20,
		reward: 100
	},
	{
		id: "w1",
		period: "weekly",
		title: "Weekly Journey",
		description: "Complete 15 levels.",
		metric: "levels",
		target: 15,
		reward: 400
	},
	{
		id: "w2",
		period: "weekly",
		title: "Weekly Fortune",
		description: "Earn 1000 coins.",
		metric: "coins",
		target: 1e3,
		reward: 500
	},
	{
		id: "m1",
		period: "monthly",
		title: "Monthly Champion",
		description: "Complete 75 levels.",
		metric: "levels",
		target: 75,
		reward: 1500
	}
];
function periodKey(p, now = /* @__PURE__ */ new Date()) {
	if (p === "daily") return now.toISOString().slice(0, 10);
	if (p === "monthly") return now.toISOString().slice(0, 7);
	const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
	const day = (d.getUTCDay() + 6) % 7;
	d.setUTCDate(d.getUTCDate() - day);
	return d.toISOString().slice(0, 10);
}
var EventBus = class {
	listeners = /* @__PURE__ */ new Map();
	on(event, listener) {
		let set = this.listeners.get(event);
		if (!set) {
			set = /* @__PURE__ */ new Set();
			this.listeners.set(event, set);
		}
		set.add(listener);
		return () => this.off(event, listener);
	}
	off(event, listener) {
		this.listeners.get(event)?.delete(listener);
	}
	emit(event, payload) {
		for (const listener of this.listeners.get(event) ?? []) listener(payload);
	}
	clear() {
		this.listeners.clear();
	}
};
var gameEvents = new EventBus();
var TelemetryBuffer = class {
	max;
	events = [];
	constructor(max = 500) {
		this.max = max;
	}
	track(name, props, context) {
		if (!name) return;
		this.events.push({
			name,
			at: Date.now(),
			props,
			...context
		});
		if (this.events.length > this.max) this.events.splice(0, this.events.length - this.max);
	}
	drain() {
		return this.events.splice(0);
	}
	snapshot() {
		return this.events.slice();
	}
};
var telemetry = new TelemetryBuffer();
var wired = false;
function wireGameTelemetry() {
	if (wired) return;
	wired = true;
	gameEvents.on("level:start", (e) => telemetry.track("level_start", e));
	gameEvents.on("word:found", (e) => telemetry.track("word_found", e));
	gameEvents.on("word:miss", (e) => telemetry.track("word_miss", e));
	gameEvents.on("level:complete", (e) => telemetry.track("level_complete", e));
	gameEvents.on("level:fail", (e) => telemetry.track("level_fail", e));
	gameEvents.on("save:changed", (e) => telemetry.track("save_changed", e));
}
var FixedWindowRateLimiter = class {
	buckets = /* @__PURE__ */ new Map();
	limit;
	windowMs;
	constructor(limit, windowMs) {
		this.limit = limit;
		this.windowMs = windowMs;
	}
	allow(key, now = Date.now()) {
		const current = this.buckets.get(key);
		if (!current || now >= current.resetAt) {
			this.buckets.set(key, {
				count: 1,
				resetAt: now + this.windowMs
			});
			return true;
		}
		if (current.count >= this.limit) return false;
		current.count += 1;
		return true;
	}
	retryAfter(key, now = Date.now()) {
		return Math.max(0, (this.buckets.get(key)?.resetAt ?? now) - now);
	}
};
function normalizeText(value, max = 200) {
	return typeof value === "string" ? value.normalize("NFKC").trim().slice(0, max) : "";
}
function safeId(value, max = 80) {
	const s = normalizeText(value, max);
	return /^[A-Za-z0-9._:-]+$/.test(s) ? s : null;
}
var gameplayLimiter = new FixedWindowRateLimiter(240, 6e4);
function validatePlayerAction(playerId, action) {
	const id = safeId(playerId);
	if (!id || !action || action.length > 64) throw new Error("invalid_action");
	if (!gameplayLimiter.allow(`${id}:${action}`)) throw new Error("rate_limited");
	return id;
}
function validatePathInput(...args) {
	return true;
}
function acceptAction(...args) {
	return true;
}
async function claimAchievementServer(_args) {
	return {
		ok: true,
		reward: 0
	};
}
async function claimMissionServer(_args) {
	return {
		ok: true,
		reward: 0
	};
}
async function claimSeasonTierServer(_args) {
	return {
		ok: true,
		reward: 0
	};
}
var seasonKey = "v26_current_season";
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var modes = /* @__PURE__ */ new Set([
	"classic",
	"timed",
	"survival",
	"blitz",
	"zen",
	"daily",
	"endless",
	"fog",
	"mirror",
	"category",
	"boss",
	"rush",
	"precision",
	"hardcore",
	"double_reward",
	"no_hints",
	"small_grid",
	"giant_grid",
	"reverse_only",
	"diagonal",
	"orthogonal",
	"chaos",
	"streak",
	"treasure",
	"nightmare",
	"focus",
	"speedrun",
	"marathon",
	"random_rules"
]);
var langs = /* @__PURE__ */ new Set([
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
]);
var cleanWords = (v) => Array.isArray(v) ? [...new Set(v.map((x) => String(x).toUpperCase().replace(/[^A-Z]/g, "")).filter(Boolean))].slice(0, 32) : [];
var startGameplaySession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	kind: d.kind === "daily" ? "daily" : "level",
	level: Math.max(1, Math.min(2e3, Math.floor(Number(d.level) || 1))),
	day: String(d.day ?? "").slice(0, 10),
	mode: modes.has(d.mode) ? d.mode : "classic",
	language: langs.has(d.language) ? d.language : "en",
	dailyChallengeId: d.dailyChallengeId ? String(d.dailyChallengeId).slice(0, 20) : void 0
})).handler(createSsrRpc("581036f0ddac4f83c74303356201bde69336ff04faae772693ddc0b401a4ba0e"));
var recordGameplayAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => {
	if (!(/* @__PURE__ */ new Set([
		"found",
		"bonus",
		"miss",
		"hint",
		"pause",
		"resume"
	])).has(d.type)) throw new Error("Invalid gameplay action type.");
	if (d.type === "hint" && d.hintKind !== "first" && d.hintKind !== "letter" && d.hintKind !== "word") throw new Error("Invalid hint kind.");
	return {
		sessionId: String(d.sessionId ?? "").trim().slice(0, 64),
		actionId: String(d.actionId ?? "").trim(),
		type: d.type,
		word: d.word ? String(d.word).toUpperCase().slice(0, 32) : void 0,
		cells: Array.isArray(d.cells) ? d.cells.slice(0, 32).map((c) => [Number(c[0]), Number(c[1])]) : void 0,
		hintKind: d.hintKind === "first" || d.hintKind === "letter" || d.hintKind === "word" ? d.hintKind : void 0
	};
}).handler(createSsrRpc("214e532389d4fd7ac3cf461df51fff915809883bdd8511b99ca25efe6e2ab785"));
var startBossSession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ level: Math.max(1, Math.min(2e3, Math.floor(Number(d.level) || 1))) })).handler(createSsrRpc("fd192289e010307ddc29c0d3356f5cf89a2c58c0870229aede772f099b006e42"));
var bossCombatAction = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	sessionId: String(d.sessionId ?? "").slice(0, 64),
	action: d.action === "word" || d.action === "guard" || d.action === "power" ? d.action : "word",
	perfect: Boolean(d.perfect)
})).handler(createSsrRpc("403e31a54a9929edc37b91d05a6133aff673762c683d5ce96d16f6b4f985050f"));
var verifyGameplayCompletion = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	sessionId: String(d.sessionId ?? "").slice(0, 64),
	found: cleanWords(d.found),
	paths: Array.isArray(d.paths) ? d.paths.slice(0, 32).map((p) => ({
		word: String(p.word ?? "").toUpperCase().slice(0, 32),
		cells: Array.isArray(p.cells) ? p.cells.slice(0, 32).map((c) => [Number(c[0]), Number(c[1])]) : []
	})) : []
})).handler(createSsrRpc("d3ab841e529e3cf0bd7975521fcd65744b8d750609f24fd7cc8415e46578552e"));
var toastN = 1;
var serverActionQueues = /* @__PURE__ */ new Map();
var newActionId = () => {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	if (typeof globalThis.crypto !== "undefined") globalThis.crypto.getRandomValues(bytes);
	else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
	bytes[6] = bytes[6] & 15 | 64;
	bytes[8] = bytes[8] & 63 | 128;
	const h = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
	return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
};
function flushPendingPlayActions(sessionId, play) {
	for (const action of play.actions) {
		if (!action.id) action.id = newActionId();
		queueServerGameplayAction({
			sessionId,
			actionId: action.id,
			type: action.type,
			word: action.word,
			cells: action.cells,
			hintKind: action.hintKind
		});
	}
}
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function queueServerGameplayAction(data) {
	const run = async () => {
		let last;
		for (let attempt = 0; attempt < 3; attempt++) try {
			const result = await recordGameplayAction({ data });
			if (!result.ok) throw new Error(result.error ?? "Gameplay action rejected by server");
			if (result.save) useGame.getState().applyServerSave(result.save);
			if (result.hintEconomy) useGame.getState().patchSave((s) => ({
				...s,
				coins: result.hintEconomy.coins,
				stats: {
					...s.stats,
					hintsUsed: result.hintEconomy.hintsUsed
				}
			}));
			return result;
		} catch (error) {
			last = error;
			if (attempt < 2) await sleep(75 * 2 ** attempt);
		}
		return {
			ok: false,
			error: last instanceof Error ? last.message : "Gameplay action delivery failed"
		};
	};
	const next = (serverActionQueues.get(data.sessionId) ?? Promise.resolve()).catch(() => void 0).then(run);
	serverActionQueues.set(data.sessionId, next);
	next.then(() => {
		if (serverActionQueues.get(data.sessionId) === next) serverActionQueues.delete(data.sessionId);
	}, () => {
		if (serverActionQueues.get(data.sessionId) === next) serverActionQueues.delete(data.sessionId);
	});
	return next;
}
var pendingServerStarts = /* @__PURE__ */ new Map();
function flash(set, text) {
	const id = toastN++;
	set({ toast: {
		id,
		text
	} });
	setTimeout(() => {
		useGame.setState((s) => s.toast?.id === id ? { toast: null } : s);
	}, 2200);
}
function withAchievements(save) {
	const extra = unlockedAchievements(save).filter((id) => !save.achievements.includes(id));
	if (!extra.length) return save;
	return {
		...save,
		achievements: [...save.achievements, ...extra]
	};
}
function haptic(ms = 12) {
	try {
		if (useGame.getState().save.settings.haptics && typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms);
	} catch {}
}
function persistPlay(play) {
	if (typeof sessionStorage === "undefined") return;
	try {
		if (!play) sessionStorage.removeItem(PLAY_KEY);
		else sessionStorage.setItem(PLAY_KEY, JSON.stringify(play));
	} catch {}
}
var useGame = create((set, get) => ({
	ready: false,
	save: defaultSave(),
	screen: "splash",
	prevScreen: "home",
	play: null,
	toast: null,
	overlay: null,
	lastReward: null,
	combat: null,
	dialogue: null,
	claimWorldChest: (world) => {
		const next = claimJourneyChest(get().save, world);
		if (!next) return false;
		writeSave(next);
		set({ save: next });
		flash(set, `World ${world} chest claimed`);
		sfxPlay.coin();
		return true;
	},
	npcAffinity: {},
	hydrate: () => {
		wireGameTelemetry();
		let save = refillEnergy(loadSave());
		save = withAchievements(save);
		let play = null;
		try {
			const raw = sessionStorage.getItem(PLAY_KEY);
			if (raw) play = JSON.parse(raw);
		} catch {
			play = null;
		}
		set({
			ready: true,
			save,
			play,
			screen: play ? "play" : "splash",
			overlay: play?.pausedAt ? "pause" : null
		});
	},
	persist: () => writeSave(get().save),
	patchSave: (fn) => {
		const save = withAchievements(refillEnergy(fn(get().save)));
		writeSave(save);
		set({ save });
		gameEvents.emit("save:changed", { version: save.version });
	},
	go: (screen) => set((s) => ({
		prevScreen: s.screen === "play" ? s.prevScreen : s.screen,
		screen,
		overlay: screen === "play" ? s.overlay : null
	})),
	setScreen: (screen) => {
		get().go(screen);
	},
	back: () => set((s) => ({
		screen: s.screen === "play" ? s.prevScreen : s.prevScreen === s.screen ? "home" : s.prevScreen,
		overlay: null
	})),
	now: () => Date.now(),
	startLevel: (level, mode = "classic") => {
		const { save } = get();
		const filled = refillEnergy(save);
		const rules = modeRules(mode);
		const free = rules.free;
		const petFx = petEffect(filled.equippedPet, filled.equippedPet ? filled.petLevels[filled.equippedPet] ?? 1 : 1);
		const energyCost = Math.max(1, Math.ceil(1 * rules.energyMultiplier * (1 - (petFx.energyReductionPercent ?? 0) / 100)));
		if (!free && filled.energy < energyCost) {
			flash(set, "Need energy");
			set({
				save: filled,
				screen: "shop"
			});
			return false;
		}
		if (level > filled.unlockedLevel) return false;
		const puzzle = puzzleForLevel(level, mode, filled.language);
		const spec = specFor(level);
		intelligenceAdaptivePlan(filled, level);
		const vision = filled.skills.vision + (petFx.startingReveals ?? 0);
		const revealed = [];
		if (vision > 0 && puzzle.placements[0]) revealed.push(puzzle.placements[0].cells[0]);
		const play = {
			kind: "level",
			level,
			mode,
			puzzle,
			found: [],
			bonus: [],
			startAt: Date.now(),
			pausedAt: null,
			pausedMs: 0,
			hints: 0,
			revealed,
			mistakes: 0,
			combo: 0,
			round: 0,
			timeLimit: mode === "zen" || spec.timeLimit == null ? void 0 : Math.max(20, Math.floor(spec.timeLimit * rules.timeMultiplier * (1 + (petFx.timeBonusPercent ?? 0) / 100))),
			actions: []
		};
		const next = typeof navigator !== "undefined" && navigator.onLine || free ? filled : {
			...filled,
			energy: filled.energy - energyCost,
			energyAt: Date.now()
		};
		writeSave(next);
		persistPlay(play);
		const intelligenceStarted = personalizationEnabled(filled) ? applyIntelligenceEvent(next, {
			type: "level_start",
			level,
			mode
		}) : next;
		writeSave(intelligenceStarted);
		set({
			save: intelligenceStarted,
			play,
			screen: "play",
			overlay: null
		});
		if (typeof navigator !== "undefined" && navigator.onLine) {
			const startPromise = startGameplaySession({ data: {
				kind: "level",
				level,
				mode,
				language: filled.language
			} }).then((result) => {
				const current = get().play;
				if (result.ok && current?.kind === "level" && current.level === level) {
					const updated = {
						...current,
						serverSessionId: result.sessionId,
						timeLimit: result.timeLimitMs / 1e3,
						adaptiveTier: result.adaptiveTier
					};
					persistPlay(updated);
					set({ play: updated });
					flushPendingPlayActions(result.sessionId, updated);
					if (!free) get().applyServerSave(result.save);
				} else if (!result.ok && current?.kind === "level" && current.level === level) flash(set, result.error || "Server verification unavailable. You can continue playing.");
				return result;
			}).catch((error) => {
				console.error("[GAMEPLAY_START_RPC_ERROR]", error);
				const message = error instanceof Error ? error.message : String(error);
				flash(set, `GAMEPLAY_START_RPC_ERROR: ${message.slice(0, 300)}`);
				return {
					ok: false,
					error: message
				};
			});
			pendingServerStarts.set(`${level}:${mode}`, startPromise);
			startPromise.then(() => void 0, () => void 0).finally(() => pendingServerStarts.delete(`${level}:${mode}`)).catch(() => void 0);
		}
		gameEvents.emit("level:start", {
			level,
			mode,
			seed: puzzle.seed
		});
		startMusic(journeyWorldForLevel(level).world - 1);
		return true;
	},
	startDaily: () => {
		const day = todayKey();
		const { save } = get();
		const challenge = dailyChallengeFor(day);
		const puzzle = puzzleForDaily(day, save.language, challenge.id);
		const play = {
			kind: "daily",
			level: 0,
			mode: "daily",
			puzzle,
			found: [],
			bonus: [],
			startAt: Date.now(),
			pausedAt: null,
			pausedMs: 0,
			hints: 0,
			revealed: [],
			mistakes: 0,
			combo: 0,
			round: 0,
			timeLimit: challenge.id === "speed" ? 90 : 150,
			actions: [],
			dailyChallenge: challenge
		};
		persistPlay(play);
		set({
			play,
			screen: "play",
			overlay: null,
			save
		});
		if (typeof navigator !== "undefined" && navigator.onLine) {
			const startPromise = startGameplaySession({ data: {
				kind: "daily",
				level: 0,
				day,
				mode: "daily",
				language: save.language,
				dailyChallengeId: challenge.id
			} }).then((result) => {
				const current = get().play;
				if (result.ok && current?.kind === "daily") {
					const updated = {
						...current,
						serverSessionId: result.sessionId,
						timeLimit: result.timeLimitMs / 1e3,
						adaptiveTier: result.adaptiveTier
					};
					persistPlay(updated);
					set({ play: updated });
					flushPendingPlayActions(result.sessionId, updated);
				}
				return result;
			});
			pendingServerStarts.set(`daily:${day}`, startPromise);
			startPromise.then(() => void 0, () => void 0).finally(() => pendingServerStarts.delete(`daily:${day}`)).catch(() => void 0);
		}
		gameEvents.emit("level:start", {
			level: 0,
			mode: "daily",
			seed: puzzle.seed
		});
		return true;
	},
	startEndless: () => {
		const seed = hashSeed("end", get().save.playerName, Date.now() % 99991);
		const puzzle = puzzleEndless(0, seed, get().save.language);
		const play = {
			kind: "endless",
			level: seed,
			mode: "endless",
			puzzle,
			found: [],
			bonus: [],
			startAt: Date.now(),
			pausedAt: null,
			pausedMs: 0,
			hints: 0,
			revealed: [],
			mistakes: 0,
			combo: 0,
			round: 0,
			actions: []
		};
		persistPlay(play);
		set({
			play,
			screen: "play",
			overlay: null
		});
		gameEvents.emit("level:start", {
			level: 0,
			mode: "endless",
			seed: puzzle.seed
		});
	},
	pausePlay: () => {
		const play = get().play;
		if (!play || play.pausedAt) return;
		const actionId = newActionId();
		const next = {
			...play,
			pausedAt: Date.now(),
			actions: [...play.actions, {
				id: actionId,
				type: "pause"
			}]
		};
		persistPlay(next);
		set({
			play: next,
			overlay: "pause"
		});
		if (next.serverSessionId) queueServerGameplayAction({
			sessionId: next.serverSessionId,
			actionId,
			type: "pause"
		});
	},
	resumePlay: () => {
		const play = get().play;
		if (!play?.pausedAt) {
			set({ overlay: null });
			return;
		}
		const actionId = newActionId();
		const next = {
			...play,
			pausedMs: play.pausedMs + (Date.now() - play.pausedAt),
			pausedAt: null,
			actions: [...play.actions, {
				id: actionId,
				type: "resume"
			}]
		};
		persistPlay(next);
		set({
			play: next,
			overlay: null
		});
		if (next.serverSessionId) queueServerGameplayAction({
			sessionId: next.serverSessionId,
			actionId,
			type: "resume"
		});
	},
	quitPlay: () => {
		const play = get().play;
		if (play) get().patchSave((s) => applyIntelligenceEvent(s, {
			type: "session_end",
			level: play.level,
			completedLevels: play.found.length ? 1 : 0
		}));
		persistPlay(null);
		set({
			play: null,
			overlay: null,
			screen: get().prevScreen === "play" ? "home" : get().prevScreen
		});
	},
	submitPath: (letters, cells) => {
		const play = get().play;
		if (!play || play.pausedAt) return "miss";
		try {
			validatePlayerAction(`local:${play.level}`, "submitPath");
		} catch {
			return "miss";
		}
		if (!validatePathInput(letters, cells) || !acceptAction(`local:${play.level}`, "submitPath")) return "miss";
		const rules = modeRules(play.mode);
		const modeCheck = validateModePath(play.mode, cells, play.puzzle.placements);
		if (!modeCheck.ok) {
			flash(set, modeCheck.reason ?? "Rule not allowed");
			return "miss";
		}
		const forward = letters.toUpperCase();
		const backward = [...forward].reverse().join("");
		const targets = play.puzzle.words;
		const match = targets.find((w) => w === forward || w === backward);
		if (match) {
			if (play.found.includes(match)) return "repeat";
			sfxPlay.found(play.combo + 1);
			haptic(18);
			const found = [...play.found, match];
			const extraCells = play.puzzle.placements.find((p) => p.word === match)?.cells ?? cells;
			const revealed = [...play.revealed, ...extraCells];
			const next = {
				...play,
				found,
				revealed,
				combo: play.combo + 1,
				actions: [...play.actions, {
					id: newActionId(),
					type: "found",
					word: match,
					cells
				}]
			};
			persistPlay(next);
			set({ play: next });
			if (next.serverSessionId) queueServerGameplayAction({
				sessionId: next.serverSessionId,
				actionId: next.actions[next.actions.length - 1].id,
				type: "found",
				word: match,
				cells
			});
			gameEvents.emit("word:found", {
				word: match,
				index: found.length - 1,
				combo: next.combo
			});
			get().patchSave((s) => ({
				...s,
				stats: {
					...s.stats,
					wordsFound: s.stats.wordsFound + 1
				}
			}));
			if (found.length >= targets.length) {
				const challenge = next.dailyChallenge;
				if (dailyChallengeObjective(challenge, {
					perfect: next.hints === 0 && next.mistakes === 0,
					combo: next.combo,
					bonusWords: next.bonus.length
				}).met) setTimeout(() => get().completePlay(), 280);
			}
			return "found";
		}
		if (forward.length >= 4 && isWord(forward) && !play.bonus.includes(forward)) {
			sfxPlay.coin();
			const next = {
				...play,
				bonus: [...play.bonus, forward],
				combo: play.combo + 1,
				actions: [...play.actions, {
					id: newActionId(),
					type: "bonus",
					word: forward,
					cells
				}]
			};
			persistPlay(next);
			set({ play: next });
			if (next.serverSessionId) queueServerGameplayAction({
				sessionId: next.serverSessionId,
				actionId: next.actions[next.actions.length - 1].id,
				type: "bonus",
				word: forward,
				cells
			});
			get().patchSave((s) => ({
				...s,
				coins: s.coins + 4,
				stats: {
					...s.stats,
					coinsEarned: s.stats.coinsEarned + 4
				}
			}));
			if (next.dailyChallenge && next.found.length >= next.puzzle.words.length) {
				if (dailyChallengeObjective(next.dailyChallenge, {
					perfect: next.hints === 0 && next.mistakes === 0,
					combo: next.combo,
					bonusWords: next.bonus.length
				}).met) setTimeout(() => get().completePlay(), 280);
			}
			return "bonus";
		}
		sfxPlay.miss();
		haptic(8);
		const next = {
			...play,
			mistakes: play.mistakes + 1,
			combo: 0,
			actions: [...play.actions, {
				id: newActionId(),
				type: "miss",
				word: forward,
				cells
			}]
		};
		persistPlay(next);
		set({ play: next });
		if (next.serverSessionId) queueServerGameplayAction({
			sessionId: next.serverSessionId,
			actionId: next.actions[next.actions.length - 1].id,
			type: "miss",
			word: forward,
			cells
		});
		gameEvents.emit("word:miss", { letters: forward });
		if (rules.maxMistakes != null && next.mistakes >= rules.maxMistakes) setTimeout(() => get().failPlay(), 200);
		return "miss";
	},
	useHint: (kind) => {
		const play = get().play;
		if (!play) return false;
		if (modeRules(play.mode).noHints) {
			flash(set, "Hints are disabled in this mode");
			return false;
		}
		const target = play.puzzle.placements.filter((p) => !play.found.includes(p.word))[0];
		if (!target) return false;
		const fox = get().save.equippedPet === "fox";
		const cost = Math.max(5, HINT_COST[kind] - (fox && kind !== "word" ? 8 : 0));
		const next = play;
		const online = typeof navigator !== "undefined" && navigator.onLine && Boolean(next.serverSessionId);
		if (!online && get().save.coins < cost) {
			flash(set, "Need coins");
			return false;
		}
		const actionId = newActionId();
		const revealCells = () => {
			let revealed = get().play?.revealed.slice() ?? [];
			if (kind === "first") revealed.push(target.cells[0]);
			else if (kind === "letter") {
				const idx = Math.min(target.cells.length - 1, 1 + Math.floor(Math.random() * Math.max(1, target.cells.length - 1)));
				revealed.push(target.cells[idx]);
			} else revealed = [...revealed, ...target.cells];
			const current = get().play;
			if (!current) return;
			const next = {
				...current,
				hints: current.hints + 1,
				revealed,
				actions: [...current.actions, {
					id: actionId,
					type: "hint",
					hintKind: kind
				}]
			};
			persistPlay(next);
			set({ play: next });
			if (personalizationEnabled(get().save)) get().patchSave((s) => applyIntelligenceEvent(s, {
				type: "hint_used",
				level: current.level
			}));
			sfxPlay.hint();
		};
		if (online && play.serverSessionId) {
			queueServerGameplayAction({
				sessionId: play.serverSessionId,
				actionId,
				type: "hint",
				hintKind: kind
			}).then((result) => {
				if (!result?.ok) {
					flash(set, result?.error ?? "Hint was rejected by the server.");
					return;
				}
				if (result.hintEconomy) get().patchSave((s) => ({
					...s,
					coins: result.hintEconomy.coins,
					stats: {
						...s.stats,
						hintsUsed: result.hintEconomy.hintsUsed
					}
				}));
				revealCells();
			}).catch(() => flash(set, "Hint could not be verified. Please retry."));
			return true;
		}
		if (get().save.coins < cost) {
			flash(set, "Need coins");
			return false;
		}
		revealCells();
		get().patchSave((s) => ({
			...s,
			coins: s.coins - cost,
			stats: {
				...s.stats,
				hintsUsed: s.stats.hintsUsed + 1
			}
		}));
		return true;
	},
	completePlay: async () => {
		let play = get().play;
		if (!play) return;
		if ((play.kind === "level" || play.kind === "daily") && typeof navigator !== "undefined" && navigator.onLine && !play.serverSessionId) {
			const pending = pendingServerStarts.get(play.kind === "daily" ? `daily:${todayKey()}` : `${play.level}:${play.mode}`);
			if (pending) await pending;
			play = get().play;
			if (!play?.serverSessionId) {
				flash(set, "Secure game session could not be started. Please retry.");
				return;
			}
		}
		const elapsed = Date.now() - play.startAt - play.pausedMs;
		const target = targetTimeMs(play.level || 1, play.puzzle.words.length, play.puzzle.size);
		const stars = starsFor({
			hints: play.hints,
			timeMs: elapsed,
			targetMs: target,
			mistakes: play.mistakes
		});
		const perfect = play.hints === 0 && play.mistakes === 0;
		const boss = play.kind === "level" && isBoss(play.level);
		const key = play.kind === "daily" ? `daily-${todayKey()}` : play.kind === "endless" ? `end-${play.round}` : String(play.level);
		const firstClear = play.kind === "level" && !get().save.results[key];
		const rules = modeRules(play.mode);
		const fastBonus = elapsed <= target * .72 ? 18 : 0;
		const goldenBonus = Math.floor(play.found.length / 5) * 10;
		const dailyClaimed = play.kind === "daily" && get().save.lastDaily === todayKey();
		const dailyMultiplier = dailyChallengeRewardMultiplier(play.dailyChallenge, {
			perfect,
			combo: play.combo,
			bonusWords: play.bonus.length
		});
		const rewardKind = play.kind === "daily" ? "challenge" : play.combo >= 5 ? "speed" : get().save.equippedPet ? "pet" : boss ? "collection" : "standard";
		const personalizationMultiplier = personalizedRewardMultiplier(get().save, rewardKind);
		const coins = dailyClaimed ? 0 : Math.max(1, Math.floor(rewardCoins({
			mode: play.mode,
			stars,
			combo: play.combo,
			hints: play.hints,
			mistakes: play.mistakes,
			wordCount: play.puzzle.words.length + play.bonus.length,
			boss,
			firstClear
		}) * rules.rewardMultiplier * dailyMultiplier * personalizationMultiplier * (1 + (petEffect(get().save.equippedPet, get().save.equippedPet ? get().save.petLevels[get().save.equippedPet] ?? 1 : 1).coinBonusPercent ?? 0) / 100)) + fastBonus + goldenBonus);
		const xp = Math.floor(xpForClear({
			size: play.puzzle.size,
			stars,
			boss
		}) * (1 + (petEffect(get().save.equippedPet, get().save.equippedPet ? get().save.petLevels[get().save.equippedPet] ?? 1 : 1).xpBonusPercent ?? 0) / 100));
		const dragon = get().save.equippedPet === "dragon" && perfect ? 20 : 0;
		const petId = get().save.equippedPet;
		const petXp = petId && !dailyClaimed ? petXpEarned({
			perfect,
			boss
		}) : 0;
		if (play.kind === "endless") {
			const round = play.round + 1;
			const puzzle = puzzleEndless(round, play.level, get().save.language);
			const next = {
				...play,
				puzzle,
				found: [],
				bonus: [],
				startAt: Date.now(),
				pausedAt: null,
				pausedMs: 0,
				hints: 0,
				revealed: [],
				mistakes: 0,
				combo: 0,
				round,
				actions: []
			};
			persistPlay(next);
			get().patchSave((s) => ({
				...observeCompletion(s, {
					level: play.level,
					world: 1,
					category: play.puzzle.category,
					mode: play.mode,
					timeMs: elapsed,
					hints: play.hints,
					combo: play.combo,
					perfect,
					stars,
					pet: petId,
					rewardCoins: coins + dragon
				}),
				coins: s.coins + coins + dragon,
				xp: s.xp + xp,
				stats: {
					...s.stats,
					gamesWon: s.stats.gamesWon + 1,
					wordsFound: s.stats.wordsFound,
					coinsEarned: s.stats.coinsEarned + coins + dragon,
					currentStreak: s.stats.currentStreak + 1,
					bestStreak: Math.max(s.stats.bestStreak, s.stats.currentStreak + 1)
				}
			}));
			set({
				play: next,
				overlay: null
			});
			sfxPlay.coin();
			return;
		}
		if (play.serverSessionId) try {
			const queued = serverActionQueues.get(play.serverSessionId);
			if (queued) {
				const delivery = await queued;
				if (delivery.ok === false) {
					flash(set, delivery.error ?? "Gameplay action delivery failed. Please retry.");
					return;
				}
			}
			const verified = await verifyGameplayCompletion({ data: {
				sessionId: play.serverSessionId,
				found: play.found,
				paths: play.actions.filter((a) => a.type === "found").map((a) => ({
					word: a.word ?? "",
					cells: a.cells ?? []
				}))
			} });
			if (!verified.ok) {
				console.error("[GAMEPLAY_COMPLETION_FAILED]", {
					level: play.level,
					sessionId: play.serverSessionId,
					found: play.found,
					actions: play.actions,
					error: verified.error
				});
				flash(set, verified.error);
				return;
			}
			if (verified.save) get().applyServerSave(verified.save);
			persistPlay(null);
			sfxPlay.win();
			set({
				overlay: "win",
				lastReward: {
					coins: verified.coins ?? 0,
					xp: verified.xp ?? 0,
					stars: verified.stars ?? 0,
					title: play.puzzle.title
				},
				play: {
					...play,
					found: play.puzzle.words.slice()
				}
			});
			gameEvents.emit("level:complete", {
				level: play.level,
				stars: verified.stars ?? 0,
				timeMs: elapsed
			});
			return;
		} catch (error) {
			console.error("[GAMEPLAY_VERIFY_EXCEPTION]", error);
			flash(set, error instanceof Error ? `Verification failed: ${error.message}` : "Secure result verification failed. Please retry.");
			return;
		}
		persistPlay(null);
		sfxPlay.win();
		if (petId && petXp > 0) get().patchSave((s) => ({
			...s,
			petXp: {
				...s.petXp,
				[petId]: (s.petXp[petId] ?? 0) + petXp
			}
		}));
		if (play.kind === "level") {
			const world = journeyWorldForLevel(play.level);
			const collectibleIds = [...isBoss(play.level) ? [`guardian-trophy-${world.world}`] : [], ...JOURNEY_WORLDS.some((w) => w.to === play.level) ? [`world-artifact-${world.world}`] : []];
			if (collectibleIds.length) get().patchSave((s) => ({
				...s,
				inventory: Array.from(/* @__PURE__ */ new Set([...s.inventory, ...collectibleIds]))
			}));
		}
		if (!play.serverSessionId) get().patchSave((s) => {
			const prev = playerLevel(s.xp);
			const nextXp = s.xp + xp;
			const nextLv = playerLevel(nextXp);
			const skillGain = Math.max(0, nextLv - prev);
			const unlockedLevel = play.kind === "level" ? Math.min(MAX_LEVEL, Math.max(s.unlockedLevel, play.level + 1)) : s.unlockedLevel;
			const result = {
				stars,
				timeMs: elapsed,
				found: play.found.length,
				hints: play.hints,
				perfect
			};
			const behaviorized = applyIntelligenceEvent(s, {
				type: "level_complete",
				level: play.level,
				world: journeyWorldForLevel(Math.max(1, play.level)).world,
				category: play.puzzle.category,
				mode: play.mode,
				timeMs: elapsed,
				hints: play.hints,
				combo: play.combo,
				perfect,
				stars,
				pet: petId,
				rewardCoins: coins + dragon,
				daily: play.kind === "daily"
			});
			const progressed = play.kind === "level" ? recordLevelResult(behaviorized, play.level, result) : behaviorized;
			const results = progressed.results;
			const finalUnlocked = play.kind === "level" ? progressed.unlockedLevel : unlockedLevel;
			const storyChapter = Math.max(s.storyChapter, Math.floor((finalUnlocked - 1) / 100));
			return {
				...s,
				coins: s.coins + coins + dragon,
				xp: nextXp,
				stars: s.stars + stars,
				unlockedLevel: finalUnlocked,
				results,
				skillPoints: s.skillPoints + skillGain,
				storyChapter,
				lastDaily: play.kind === "daily" && !dailyClaimed ? todayKey() : s.lastDaily,
				dailyStreak: play.kind === "daily" && !dailyClaimed ? s.lastDaily === (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString().slice(0, 10) ? s.dailyStreak + 1 : 1 : s.dailyStreak,
				stats: {
					...s.stats,
					gamesPlayed: s.stats.gamesPlayed + 1,
					gamesWon: s.stats.gamesWon + 1,
					playTimeMs: s.stats.playTimeMs + elapsed,
					coinsEarned: s.stats.coinsEarned + coins + dragon,
					currentStreak: s.stats.currentStreak + 1,
					bestStreak: Math.max(s.stats.bestStreak, s.stats.currentStreak + 1),
					perfectClears: s.stats.perfectClears + (perfect ? 1 : 0),
					dailyCompleted: s.stats.dailyCompleted + (play.kind === "daily" && !dailyClaimed ? 1 : 0),
					bossesDefeated: s.stats.bossesDefeated + (boss ? 1 : 0),
					levelsCompleted: s.stats.levelsCompleted + (play.kind === "level" ? 1 : 0)
				},
				inventory: Array.from(/* @__PURE__ */ new Set([
					...s.inventory,
					...play.kind === "level" && play.level > 0 && isBoss(play.level) ? [`guardian-trophy-${journeyWorldForLevel(play.level).world}`] : [],
					...play.kind === "level" && JOURNEY_WORLDS.some((w) => w.to === play.level) ? [`world-artifact-${journeyWorldForLevel(play.level).world}`] : []
				])),
				materials: {
					...s.materials,
					wood: s.materials.wood + 1 + (boss ? 2 : 0),
					stone: s.materials.stone + (stars >= 2 ? 1 : 0),
					crystal: s.materials.crystal + (perfect ? 1 : 0)
				}
			};
		});
		gameEvents.emit("level:complete", {
			level: play.level,
			stars,
			timeMs: elapsed
		});
		set({
			overlay: "win",
			lastReward: {
				coins: coins + dragon,
				xp,
				stars,
				title: play.puzzle.title
			},
			play: {
				...play,
				found: play.puzzle.words.slice()
			}
		});
	},
	failPlay: () => {
		const play = get().play;
		if (!play) return;
		persistPlay(null);
		get().patchSave((s) => ({
			...applyIntelligenceEvent(s, {
				type: "level_fail",
				level: play.level,
				reason: "rule_or_timeout"
			}),
			stats: {
				...s.stats,
				gamesPlayed: s.stats.gamesPlayed + 1,
				currentStreak: 0,
				playTimeMs: s.stats.playTimeMs + (Date.now() - play.startAt - play.pausedMs)
			}
		}));
		gameEvents.emit("level:fail", {
			level: play.level,
			reason: "rule_or_timeout"
		});
		set({ overlay: "fail" });
	},
	buy: (id) => {
		const item = SHOP.find((x) => x.id === id);
		if (!item) return false;
		const save = get().save;
		if ("theme" in item && item.theme && save.ownedThemes.includes(item.theme)) {
			flash(set, "Already owned");
			return false;
		}
		if (save.coins < item.coins || save.diamonds < item.diamonds) {
			flash(set, item.coins && save.coins < item.coins ? "Need coins" : "Need diamonds");
			return false;
		}
		get().patchSave((s) => {
			let next = {
				...s,
				coins: s.coins - item.coins,
				diamonds: s.diamonds - item.diamonds
			};
			if (item.kind === "energy") next = {
				...next,
				energy: Math.min(20, next.energy + item.amount)
			};
			if (item.kind === "coins") next = {
				...next,
				coins: next.coins + item.amount
			};
			if (item.kind === "item") next = {
				...next,
				inventory: [...next.inventory, String(item.item)]
			};
			if ("theme" in item && item.theme) next = {
				...next,
				ownedThemes: [.../* @__PURE__ */ new Set([...next.ownedThemes, item.theme])]
			};
			return next;
		});
		sfxPlay.coin();
		flash(set, "Purchased");
		return true;
	},
	buyPet: (id) => {
		const pet = PETS.find((p) => p.id === id);
		if (!pet) return false;
		const save = get().save;
		if (save.ownedPets.includes(id)) return false;
		if (save.coins < pet.coins || save.diamonds < pet.diamonds) {
			flash(set, "Need currency");
			return false;
		}
		get().patchSave((s) => ({
			...s,
			coins: s.coins - pet.coins,
			diamonds: s.diamonds - pet.diamonds,
			ownedPets: [...s.ownedPets, id],
			petLevels: {
				...s.petLevels,
				[id]: 1
			}
		}));
		sfxPlay.coin();
		return true;
	},
	upgradePet: (id) => {
		const save = get().save;
		if (!save.ownedPets.includes(id)) return false;
		const profile = petProfile(id);
		const level = save.petLevels[id] ?? 1;
		if (!profile || level >= profile.maxLevel) return false;
		const cost = petUpgradeCost(id, level);
		if (save.coins < cost) {
			flash(set, "Need coins");
			return false;
		}
		get().patchSave((s) => ({
			...s,
			coins: s.coins - cost,
			petLevels: {
				...s.petLevels,
				[id]: level + 1
			}
		}));
		flash(set, `${profile.name} reached level ${level + 1}`);
		return true;
	},
	equipPet: (id) => get().patchSave((s) => s.ownedPets.includes(id) ? {
		...s,
		equippedPet: id
	} : s),
	equipTheme: (id) => get().patchSave((s) => s.ownedThemes.includes(id) ? {
		...s,
		equippedTheme: id
	} : s),
	setAvatar: (id) => get().patchSave((s) => ({
		...s,
		avatarId: id
	})),
	setName: (name) => get().patchSave((s) => ({
		...s,
		playerName: name.slice(0, 24) || s.playerName
	})),
	setSetting: (k, v) => get().patchSave((s) => ({
		...s,
		settings: {
			...s.settings,
			[k]: v
		}
	})),
	setLang: (language) => get().patchSave((s) => ({
		...s,
		language
	})),
	claimLogin: () => {
		const day = todayKey();
		if (get().save.lastLoginReward === day) return false;
		const dayIndex = get().save.loginDays % 7;
		const coins = [
			10,
			20,
			35,
			50,
			75,
			100,
			150
		][dayIndex];
		get().patchSave((s) => ({
			...s,
			coins: s.coins + coins,
			lastLoginReward: day,
			loginDays: s.loginDays + 1,
			diamonds: s.diamonds + (dayIndex === 6 ? 1 : 0),
			stats: {
				...s.stats,
				coinsEarned: s.stats.coinsEarned + coins
			}
		}));
		sfxPlay.coin();
		flash(set, `+${coins} coins`);
		return true;
	},
	spin: () => {
		const save = refillEnergy(get().save);
		const day = todayKey();
		const paid = save.lastSpin === day;
		if (paid && save.coins < 25) {
			flash(set, "Need coins");
			return null;
		}
		const luck = save.skills.luck + (save.equippedPet === "unicorn" ? 2 : 0);
		const rng = mulberry32(hashSeed("spin", day, save.loginDays, Date.now() % 997));
		const table = SPIN_TABLE.map((row, i) => i >= 5 ? {
			...row,
			w: row.w + luck
		} : row);
		const total = table.reduce((a, r) => a + r.w, 0);
		let roll = rng() * total;
		let hit = table[0];
		for (const row of table) {
			roll -= row.w;
			if (roll <= 0) {
				hit = row;
				break;
			}
		}
		get().patchSave((s) => ({
			...s,
			coins: s.coins - (paid ? 25 : 0) + hit.coins,
			diamonds: s.diamonds + hit.diamonds,
			energy: Math.min(20, s.energy + hit.energy),
			lastSpin: day,
			stats: {
				...s.stats,
				coinsEarned: s.stats.coinsEarned + hit.coins
			}
		}));
		sfxPlay.spin();
		return hit.label;
	},
	upgradeBuilding: (id) => {
		const save = get().save;
		const level = save.baseBuildings[id] ?? 1;
		const cost = buildingUpgradeCost(id, level);
		if (cost == null) return false;
		if (save.coins < cost) {
			flash(set, "Not enough coins");
			return false;
		}
		get().patchSave((s) => ({
			...s,
			coins: s.coins - cost,
			baseBuildings: {
				...s.baseBuildings,
				[id]: level + 1
			}
		}));
		flash(set, `${BUILDINGS[id].name} upgraded`);
		return true;
	},
	craft: (slot) => {
		const save = get().save;
		const level = Math.max(1, save.baseBuildings.workshop ?? 1);
		const item = craftEquipment(slot, level, save.materials);
		if (!item) {
			flash(set, "Need more crafting materials");
			return false;
		}
		const spend = {
			wood: 5 + level,
			stone: 4 + level,
			crystal: 2,
			iron: 2,
			gold: 0
		};
		get().patchSave((s) => {
			const materials = { ...s.materials };
			for (const [k, v] of Object.entries(spend)) materials[k] = Math.max(0, (materials[k] ?? 0) - Number(v));
			return {
				...s,
				materials,
				equipment: [...s.equipment, item]
			};
		});
		flash(set, `Crafted ${item.name}`);
		return true;
	},
	equipEquipment: (id) => {
		get().patchSave((s) => {
			const item = s.equipment.find((e) => e.id === id);
			if (!item) return s;
			return {
				...s,
				equippedEquipment: {
					...s.equippedEquipment,
					[item.slot]: id
				}
			};
		});
	},
	spendSkill: (k) => {
		get().patchSave((s) => {
			if (s.skillPoints < 1 || s.skills[k] >= 10) return s;
			return {
				...s,
				skillPoints: s.skillPoints - 1,
				skills: {
					...s.skills,
					[k]: s.skills[k] + 1
				}
			};
		});
	},
	applyCloud: (remote) => {
		const merged = mergeSaves(get().save, remote);
		writeSave(merged);
		set({ save: merged });
		flash(set, "Cloud save merged");
	},
	applyServerSave: (remote) => {
		const merged = { ...remote };
		writeSave(merged);
		set({ save: merged });
	},
	startBossCombat: async (level) => {
		const save = get().save;
		if (!isJourneyBoss(level) || level > save.unlockedLevel) {
			flash(set, "Reach an unlocked Boss Gate first");
			return;
		}
		try {
			const result = await startBossSession({ data: { level } });
			if (!result.ok) {
				flash(set, result.error);
				return;
			}
			set({
				combat: {
					...result.combat,
					sessionId: result.sessionId
				},
				screen: "combat"
			});
		} catch {
			flash(set, "Guardian connection failed");
		}
	},
	combatAction: async (action, perfect) => {
		const combat = get().combat;
		if (!combat || combat.victory || combat.defeated) return;
		const sessionId = combat.sessionId;
		if (!sessionId) {
			flash(set, "Guardian session missing");
			return;
		}
		try {
			const result = await bossCombatAction({ data: {
				sessionId,
				action,
				perfect
			} });
			if (!result.ok) {
				flash(set, result.error);
				return;
			}
			set({ combat: {
				...result.combat,
				sessionId
			} });
			if (result.combat.victory) {
				if (result.save) {
					writeSave(result.save);
					set({ save: result.save });
				}
				flash(set, `Victory · +${result.combat.enemy.reward} coins`);
				sfxPlay.win();
			}
		} catch {
			flash(set, "Guardian action failed");
		}
	},
	clearCombat: () => set({
		combat: null,
		screen: "home"
	}),
	openDialogue: (chapter) => {
		set({
			dialogue: dialogueForChapter(chapter),
			screen: "dialogue"
		});
	},
	chooseDialogue: (choiceId) => {
		const node = get().dialogue;
		if (!node) return;
		const choice = node.choices.find((c) => c.id === choiceId);
		if (!choice) return;
		if (choice.affinity) set({ npcAffinity: {
			...get().npcAffinity,
			[node.speaker]: (get().npcAffinity[node.speaker] ?? 0) + choice.affinity
		} });
		if (choice.reward) {
			get().patchSave((s) => ({
				...s,
				coins: s.coins + choice.reward
			}));
			flash(set, `+${choice.reward} coins`);
		}
		if (!choice.next || choice.next === "end") {
			set({
				dialogue: null,
				screen: "npcs"
			});
			return;
		}
		const next = DIALOGUES[choice.next];
		set({
			dialogue: next ?? null,
			screen: next ? "dialogue" : "npcs"
		});
	},
	closeDialogue: () => set({
		dialogue: null,
		screen: "npcs"
	}),
	claimAchievement: async (id) => {
		const a = ACHIEVEMENTS.find((x) => x.id === id);
		if (!a) return false;
		const save = get().save;
		if (save.claimedAchievements.includes(id) || !achievementProgress(a, save.stats).done) return false;
		try {
			const remote = await claimAchievementServer({ data: { id } });
			if (!remote.ok) {
				flash(set, remote.error ?? "Achievement claim failed");
				return false;
			}
			if (remote.reward > 0) {
				get().patchSave((s) => ({
					...s,
					claimedAchievements: [...s.claimedAchievements, id],
					coins: s.coins + remote.reward,
					stats: {
						...s.stats,
						coinsEarned: s.stats.coinsEarned + remote.reward
					}
				}));
				flash(set, `+${remote.reward} coins`);
				sfxPlay.coin();
			}
			return true;
		} catch {
			get().patchSave((s) => ({
				...s,
				claimedAchievements: [...s.claimedAchievements, id],
				coins: s.coins + a.reward,
				stats: {
					...s.stats,
					coinsEarned: s.stats.coinsEarned + a.reward
				}
			}));
			flash(set, `+${a.reward} coins`);
			sfxPlay.coin();
			return true;
		}
	},
	claimMission: async (id) => {
		const m = MISSIONS.find((x) => x.id === id);
		if (!m) return false;
		const save = get().save;
		const ck = `${m.id}:${periodKey(m.period)}`;
		const k = m.metric === "levels" ? "levelsCompleted" : m.metric === "words" ? "wordsFound" : "coinsEarned";
		if (save.claimedMissions.includes(ck) || (save.stats[k] ?? 0) < m.target) return false;
		try {
			const remote = await claimMissionServer({ data: { id } });
			if (!remote.ok) {
				flash(set, remote.error ?? "Mission claim failed");
				return false;
			}
			if (remote.reward > 0) {
				get().patchSave((s) => ({
					...s,
					claimedMissions: [...s.claimedMissions, ck],
					coins: s.coins + remote.reward,
					stats: {
						...s.stats,
						coinsEarned: s.stats.coinsEarned + remote.reward
					}
				}));
				flash(set, `+${remote.reward} coins`);
				sfxPlay.coin();
			}
			return true;
		} catch {
			get().patchSave((s) => ({
				...s,
				claimedMissions: [...s.claimedMissions, ck],
				coins: s.coins + m.reward,
				stats: {
					...s.stats,
					coinsEarned: s.stats.coinsEarned + m.reward
				}
			}));
			flash(set, `+${m.reward} coins`);
			sfxPlay.coin();
			return true;
		}
	},
	claimSeasonTier: async (level) => {
		const tier = Math.max(1, Math.min(10, Math.floor(level)));
		const save = get().save;
		const key = `${seasonKey}:${tier}`;
		if (save.claimedSeasonTiers.includes(key)) return false;
		try {
			const remote = await claimSeasonTierServer({ data: { level: tier } });
			if (!remote.ok) {
				flash(set, remote.error ?? "Season claim failed");
				return false;
			}
			if (remote.reward > 0) {
				get().patchSave((s) => ({
					...s,
					claimedSeasonTiers: [...s.claimedSeasonTiers, key],
					coins: s.coins + remote.reward,
					stats: {
						...s.stats,
						coinsEarned: s.stats.coinsEarned + remote.reward
					}
				}));
				flash(set, `+${remote.reward} coins`);
				sfxPlay.coin();
			}
			return true;
		} catch {
			flash(set, "Sign in with a cloud save to claim season rewards");
			return false;
		}
	},
	exportJson: () => exportSave(get().save),
	importJson: (text) => {
		try {
			const next = importSave(text);
			writeSave(next);
			set({ save: next });
			flash(set, "Save imported");
			return true;
		} catch {
			flash(set, "Import failed");
			return false;
		}
	},
	resetProgress: () => {
		const keep = get().save.settings;
		const lang = get().save.language;
		const next = {
			...defaultSave(),
			settings: keep,
			language: lang
		};
		writeSave(next);
		persistPlay(null);
		set({
			save: next,
			play: null,
			overlay: null,
			screen: "home"
		});
	}
}));
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			username: user.username ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var EN = {
	"app.title": "Mera Word Search Journey",
	"app.tag": "A quiet atlas of hidden words",
	"cta.play": "Continue the journey",
	"cta.start": "Begin",
	"cta.daily": "Daily challenge",
	"cta.worlds": "World map",
	"cta.modes": "Modes",
	"cta.shop": "Bazaar",
	"cta.pets": "Companions",
	"cta.profile": "Profile",
	"cta.settings": "Settings",
	"cta.achievements": "Seals",
	"cta.stats": "Ledger",
	"cta.spin": "Lucky wheel",
	"cta.story": "Chronicle",
	"cta.dictionary": "Lexicon",
	"cta.leaderboard": "Hall",
	"cta.inventory": "Satchel",
	"cta.skills": "Craft",
	"cta.legal": "Charter",
	"cta.more": "More",
	"cta.back": "Back",
	"cta.home": "Home",
	"cta.pause": "Pause",
	"cta.resume": "Resume",
	"cta.quit": "Leave puzzle",
	"cta.next": "Next level",
	"cta.retry": "Try again",
	"cta.hint": "Hint",
	"cta.claim": "Claim",
	"cta.spinNow": "Spin",
	"cta.signIn": "Sign in",
	"cta.guest": "Continue as guest",
	"cta.sync": "Save to cloud",
	"cta.export": "Export save",
	"cta.import": "Import save",
	"hud.coins": "Coins",
	"hud.diamonds": "Diamonds",
	"hud.energy": "Energy",
	"hud.stars": "Stars",
	"play.find": "Find these words",
	"play.found": "Found",
	"play.bonus": "Bonus word",
	"play.complete": "The page is complete",
	"play.failed": "The ink ran dry",
	"play.time": "Time",
	"play.paused": "Paused",
	"play.needEnergy": "Rest a while — energy refills every five minutes.",
	"shop.title": "Traveler's bazaar",
	"pets.title": "Companions",
	"settings.title": "Preferences",
	"profile.title": "Traveler",
	"daily.title": "Today's page",
	"spin.title": "Wheel of chance",
	"story.title": "Chronicle",
	"legal.tos": "Terms of travel",
	"legal.privacy": "Quiet ledger",
	"toast.saved": "Progress kept",
	"toast.needCoins": "Not enough coins",
	"toast.needDiamonds": "Not enough diamonds",
	"toast.owned": "Already owned",
	"toast.energy": "Energy restored",
	"toast.synced": "Cloud save merged",
	"lang.en": "English",
	"lang.ur": "اردو",
	"lang.ur-Latn": "Roman Urdu",
	"lang.hi": "हिन्दी",
	"lang.ar": "العربية",
	"lang.es": "Español",
	"lang.fr": "Français",
	"lang.de": "Deutsch",
	"lang.tr": "Türkçe",
	"lang.zh": "中文",
	"lang.ja": "日本語",
	"lang.bn": "বাংলা",
	"lang.pa": "ਪੰਜਾਬੀ",
	"lang.sd": "سنڌي",
	"lang.ps": "پښتو"
};
var UR = {
	"app.title": "میرا ورڈ سرچ سفر",
	"app.tag": "پوشیدہ الفاظ کا خاموش اطلس",
	"cta.play": "سفر جاری رکھیں",
	"cta.start": "شروع",
	"cta.daily": "آج کا چیلنج",
	"cta.worlds": "دنیا کا نقشہ",
	"cta.modes": "انداز",
	"cta.shop": "بازار",
	"cta.pets": "ساتھی",
	"cta.profile": "پروفائل",
	"cta.settings": "ترتیبات",
	"cta.achievements": "مہریں",
	"cta.stats": "کھاتہ",
	"cta.spin": "قسمت کا پہیہ",
	"cta.story": "سفرنامہ",
	"cta.dictionary": "لغت",
	"cta.leaderboard": "ہال",
	"cta.back": "واپس",
	"cta.home": "گھر",
	"cta.pause": "توقف",
	"cta.resume": "جاری",
	"cta.quit": "پہیلی چھوڑیں",
	"cta.next": "اگلا درجہ",
	"cta.retry": "دوبارہ",
	"cta.hint": "اشارہ",
	"cta.claim": "حاصل کریں",
	"cta.spinNow": "گھمائیں",
	"cta.signIn": "داخل ہوں",
	"cta.guest": "مہمان کے طور پر کھیلیں",
	"cta.sync": "بادل میں محفوظ",
	"play.find": "یہ الفاظ تلاش کریں",
	"play.found": "مل گیا",
	"play.complete": "صفحہ مکمل ہوا",
	"play.failed": "روشنی ختم ہو گئی",
	"play.time": "وقت",
	"play.paused": "توقف",
	"play.needEnergy": "ذرا آرام — توانائی ہر پانچ منٹ میں بھرتی ہے۔",
	"shop.title": "مسافر کا بازار",
	"pets.title": "ساتھی",
	"settings.title": "ترجیحات",
	"profile.title": "مسافر",
	"daily.title": "آج کا صفحہ",
	"spin.title": "قسمت کا پہیہ",
	"story.title": "سفرنامہ",
	"toast.saved": "پیشرفت محفوظ",
	"toast.needCoins": "سکے کم ہیں",
	"hud.coins": "سکے",
	"hud.diamonds": "ہیرے",
	"hud.energy": "توانائی",
	"hud.stars": "ستارے"
};
var ES = {
	"app.title": "Mera Word Search Journey",
	"app.tag": "Un atlas silencioso de palabras ocultas",
	"cta.play": "Seguir el viaje",
	"cta.start": "Empezar",
	"cta.daily": "Reto del día",
	"cta.worlds": "Mapa",
	"cta.shop": "Bazar",
	"cta.pets": "Compañeros",
	"cta.settings": "Ajustes",
	"cta.back": "Volver",
	"play.find": "Encuentra estas palabras",
	"play.complete": "La página está completa"
};
var AR = {
	"app.title": "رحلة البحث عن الكلمات",
	"app.tag": "أطلس هادئ للكلمات المخفية",
	"cta.play": "واصل الرحلة",
	"cta.start": "ابدأ",
	"cta.daily": "تحدي اليوم",
	"cta.worlds": "الخريطة",
	"cta.back": "رجوع",
	"play.find": "ابحث عن هذه الكلمات"
};
var PACKS = {
	en: EN,
	ur: UR,
	"ur-Latn": {
		...EN,
		"app.title": "Mera Word Search Safar",
		"app.tag": "Posheeda alfaaz ka khamosh atlas",
		"cta.play": "Safar jari rakhein",
		"cta.daily": "Aaj ka challenge",
		"cta.worlds": "Dunya ka naqsha"
	},
	es: ES,
	ar: AR,
	hi: {
		...EN,
		"cta.play": "यात्रा जारी रखें",
		"cta.daily": "आज की चुनौती"
	},
	fr: {
		...EN,
		"cta.play": "Continuer le voyage",
		"cta.daily": "Défi du jour"
	},
	de: {
		...EN,
		"cta.play": "Reise fortsetzen",
		"cta.daily": "Tagesaufgabe"
	},
	tr: {
		...EN,
		"cta.play": "Yolculuğa devam",
		"cta.daily": "Günün görevi"
	},
	zh: {
		...EN,
		"cta.play": "继续旅程",
		"cta.daily": "每日挑战"
	},
	ja: {
		...EN,
		"cta.play": "旅を続ける",
		"cta.daily": "今日の挑戦"
	},
	bn: EN,
	pa: EN,
	sd: UR,
	ps: UR
};
var LANGS = [
	"en",
	"ur",
	"ur-Latn",
	"hi",
	"ar",
	"es",
	"fr",
	"de",
	"tr",
	"zh",
	"ja",
	"bn",
	"pa",
	"sd",
	"ps"
];
var RTL_LANGS = /* @__PURE__ */ new Set([
	"ur",
	"ar",
	"sd",
	"ps"
]);
function t(lang, key) {
	return PACKS[lang]?.[key] ?? EN[key] ?? key;
}
function isRtl(lang, force) {
	return Boolean(force) || RTL_LANGS.has(lang);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function key(r, c) {
	return `${r},${c}`;
}
function GridBoard({ puzzle, found, revealed, fog, mirror, tileStyle, disabled, opponentFound = [], onPath }) {
	const wrapRef = (0, import_react.useRef)(null);
	const [hot, setHot] = (0, import_react.useState)([]);
	const [miss, setMiss] = (0, import_react.useState)([]);
	const drag = (0, import_react.useRef)(null);
	const tap = (0, import_react.useRef)(null);
	const [keyboardCell, setKeyboardCell] = (0, import_react.useState)([0, 0]);
	const [frozenUntil, setFrozenUntil] = (0, import_react.useState)(0);
	const [blast, setBlast] = (0, import_react.useState)([]);
	const onKeyDown = (e) => {
		if (disabled) return;
		const [r, c] = keyboardCell;
		let nr = r, nc = c;
		if (e.key === "ArrowUp") nr = Math.max(0, r - 1);
		else if (e.key === "ArrowDown") nr = Math.min(puzzle.size - 1, r + 1);
		else if (e.key === "ArrowLeft") nc = Math.max(0, c - 1);
		else if (e.key === "ArrowRight") nc = Math.min(puzzle.size - 1, c + 1);
		else if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			if (tap.current) {
				const line = cellsAlong(tap.current[0], tap.current[1], r, c);
				tap.current = null;
				finish(line ?? [[r, c]]);
			} else {
				if (specialMap.get(key(r, c)) === "locked") {
					setMiss([[r, c]]);
					setTimeout(() => setMiss([]), 280);
					return;
				}
				tap.current = [r, c];
				setHot([[r, c]]);
			}
			return;
		} else return;
		e.preventDefault();
		setKeyboardCell([nr, nc]);
		setHot(tap.current ? [tap.current, [nr, nc]] : [[nr, nc]]);
	};
	const [mechanicTick, setMechanicTick] = (0, import_react.useState)(0);
	const specialTiles = (0, import_react.useMemo)(() => specialTilesForPuzzle(puzzle), [puzzle]);
	(0, import_react.useEffect)(() => {
		if (!specialTiles.some((t) => t.kind === "moving")) return;
		const id = window.setInterval(() => setMechanicTick((v) => v + 1), 1400);
		return () => window.clearInterval(id);
	}, [specialTiles]);
	const specialMap = (0, import_react.useMemo)(() => movingPositions(specialTiles, mechanicTick), [specialTiles, mechanicTick]);
	const foundSet = (0, import_react.useMemo)(() => {
		const s = /* @__PURE__ */ new Set();
		for (const p of puzzle.placements) {
			if (!found.includes(p.word)) continue;
			for (const [r, c] of p.cells) s.add(key(r, c));
		}
		return s;
	}, [puzzle, found]);
	const foundPaths = (0, import_react.useMemo)(() => puzzle.placements.filter((p) => found.includes(p.word)), [puzzle, found]);
	const opponentPaths = (0, import_react.useMemo)(() => puzzle.placements.filter((p) => opponentFound.includes(p.word)), [puzzle, opponentFound]);
	const revealedSet = (0, import_react.useMemo)(() => {
		const s = /* @__PURE__ */ new Set();
		for (const [r, c] of revealed) s.add(key(r, c));
		return s;
	}, [revealed]);
	const missSet = (0, import_react.useMemo)(() => new Set(miss.map(([r, c]) => key(r, c))), [miss]);
	const hotSet = (0, import_react.useMemo)(() => new Set(hot.map(([r, c]) => key(r, c))), [hot]);
	const cellAt = (0, import_react.useCallback)((clientX, clientY) => {
		const el = wrapRef.current;
		if (!el) return null;
		const rect = el.getBoundingClientRect();
		const n = puzzle.size;
		let col = Math.floor((clientX - rect.left) / rect.width * n);
		let row = Math.floor((clientY - rect.top) / rect.height * n);
		if (mirror) col = n - 1 - col;
		if (row < 0 || col < 0 || row >= n || col >= n) return null;
		return [row, col];
	}, [puzzle.size, mirror]);
	const lettersOf = (cells) => cells.map(([r, c]) => puzzle.grid[r][c]).join("");
	const finish = (rawCells) => {
		if (Date.now() < frozenUntil) return;
		const cells = rawCells;
		if (cells.length < 2) {
			setHot([]);
			return;
		}
		const lockedIndex = cells.findIndex(([r, c]) => specialMap.get(key(r, c)) === "locked");
		const usable = lockedIndex >= 0 ? cells.slice(0, lockedIndex) : cells;
		if (usable.length < 2) {
			setMiss(cells.slice(0, Math.min(2, cells.length)));
			setTimeout(() => setMiss([]), 280);
			setHot([]);
			return;
		}
		const result = onPath(lettersOf(usable), usable);
		const kinds = new Set(usable.map(([r, c]) => specialMap.get(key(r, c))).filter(Boolean));
		if (result === "miss") {
			setMiss(usable);
			setTimeout(() => setMiss([]), 280);
		}
		if (kinds.has("bomb")) {
			const [cr, cc] = usable.find(([r, c]) => specialMap.get(key(r, c)) === "bomb");
			const cellsAround = [];
			for (let r = Math.max(0, cr - 1); r <= Math.min(puzzle.size - 1, cr + 1); r++) for (let c = Math.max(0, cc - 1); c <= Math.min(puzzle.size - 1, cc + 1); c++) cellsAround.push([r, c]);
			setBlast(cellsAround);
			setTimeout(() => setBlast([]), 420);
		}
		if (kinds.has("ice")) {
			const until = Date.now() + 900;
			setFrozenUntil(until);
			setTimeout(() => setFrozenUntil((v) => v === until ? 0 : v), 920);
		}
		setHot([]);
	};
	const onDown = (e) => {
		if (disabled || Date.now() < frozenUntil) return;
		const cell = cellAt(e.clientX, e.clientY);
		if (!cell) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		drag.current = {
			id: e.pointerId,
			start: cell,
			cells: [cell],
			moved: false
		};
		setHot([cell]);
		e.preventDefault();
	};
	const onMove = (e) => {
		const d = drag.current;
		if (!d || d.id !== e.pointerId) return;
		const cell = cellAt(e.clientX, e.clientY);
		if (!cell) return;
		if (cell[0] === d.start[0] && cell[1] === d.start[1]) {
			d.cells = [d.start];
			setHot(d.cells);
			return;
		}
		d.moved = true;
		const [sr, sc] = d.start;
		const [er, ec] = cell;
		const [dr, dc] = snapDir(er - sr, ec - sc);
		if (dr === 0 && dc === 0) return;
		const steps = Math.max(Math.abs(er - sr), Math.abs(ec - sc));
		const endR = sr + dr * steps;
		const endC = sc + dc * steps;
		const line = cellsAlong(sr, sc, endR, endC);
		if (!line) return;
		const clipped = line.filter(([r, c]) => r >= 0 && c >= 0 && r < puzzle.size && c < puzzle.size);
		const lockedIndex = clipped.findIndex(([r, c]) => specialMap.get(key(r, c)) === "locked");
		d.cells = lockedIndex >= 0 ? clipped.slice(0, lockedIndex) : clipped;
		setHot(clipped);
	};
	const onUp = (e) => {
		const d = drag.current;
		if (!d || d.id !== e.pointerId) return;
		drag.current = null;
		if (!d.moved) {
			if (tap.current) {
				const line = cellsAlong(tap.current[0], tap.current[1], d.start[0], d.start[1]);
				tap.current = null;
				finish(line ?? [d.start]);
			} else {
				tap.current = d.start;
				setHot([d.start]);
			}
			return;
		}
		tap.current = null;
		finish(d.cells);
	};
	const onCancel = (e) => {
		if (drag.current?.id === e.pointerId) {
			drag.current = null;
			setHot(tap.current ? [tap.current] : []);
		}
	};
	const n = puzzle.size;
	const font = n >= 16 ? "text-[11px] sm:text-sm" : n >= 12 ? "text-sm sm:text-base" : "text-base sm:text-lg";
	const pt = (r, c) => {
		return `${(mirror ? n - 1 - c : c) + .5},${r + .5}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "grid-board relative aspect-square h-auto w-full max-h-full max-w-[min(100%,42dvh)] sm:max-w-[min(100%,50dvh)] lg:max-w-[min(100%,54dvh)]",
		onPointerDown: onDown,
		onPointerMove: onMove,
		onPointerUp: onUp,
		onPointerCancel: onCancel,
		onKeyDown,
		tabIndex: 0,
		role: "grid",
		"aria-label": "Word search grid. Use arrow keys to move and Enter to select cells.",
		"aria-activedescendant": `cell-${keyboardCell[0]}-${keyboardCell[1]}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-full w-full gap-[3px] sm:gap-1",
			style: { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` },
			children: puzzle.grid.map((row, r) => row.map((ch, cRaw) => {
				const c = mirror ? n - 1 - cRaw : cRaw;
				const letter = puzzle.grid[r][c];
				const k = key(r, c);
				const isFound = foundSet.has(k);
				const isHot = hotSet.has(k);
				const isMiss = missSet.has(k);
				const isBlast = blast.some(([br, bc]) => br === r && bc === c);
				const isRev = revealedSet.has(k);
				const special = specialMap.get(k);
				const hide = Boolean(fog) && !isFound && !isHot && !isRev;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: `cell-${r}-${c}`,
					role: "gridcell",
					"data-hot": isHot ? "1" : void 0,
					"data-found": isFound ? "1" : void 0,
					"data-miss": isMiss ? "1" : void 0,
					"data-blast": isBlast ? "1" : void 0,
					"data-frozen": Date.now() < frozenUntil ? "1" : void 0,
					"data-rev": isRev && !isFound ? "1" : void 0,
					"data-special": special,
					"data-style": tileStyle,
					className: cn("letter-tile", font),
					"aria-label": hide ? "hidden letter" : `${letter}${special ? `, ${special} tile` : ""}`,
					children: [hide ? "" : letter, special && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "special-tile-mark",
						"aria-hidden": "true",
						children: special === "ice" ? "❄" : special === "bomb" ? "✦" : special === "locked" ? "🔒" : "↝"
					})]
				}, `${r}-${cRaw}`);
			}))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			className: "pointer-events-none absolute inset-0 h-full w-full",
			viewBox: `0 0 ${n} ${n}`,
			children: [
				opponentPaths.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
					fill: "none",
					stroke: "color-mix(in oklab, var(--color-warning) 72%, white)",
					strokeWidth: "0.14",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					strokeDasharray: "0.28 0.18",
					opacity: "0.58",
					points: p.cells.map(([r, c]) => pt(r, c)).join(" ")
				}, `opponent-${p.word}`)),
				foundPaths.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
					fill: "none",
					stroke: "color-mix(in oklab, var(--color-success) 72%, white)",
					strokeWidth: "0.18",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					opacity: "0.7",
					points: p.cells.map(([r, c]) => pt(r, c)).join(" ")
				}, p.word)),
				hot.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
					fill: "none",
					stroke: "color-mix(in oklab, var(--color-primary) 88%, white)",
					strokeWidth: "0.22",
					strokeLinecap: "round",
					strokeLinejoin: "round",
					points: hot.map(([r, c]) => pt(r, c)).join(" ")
				})
			]
		})]
	});
}
var askSmartHint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	word: String(d.word ?? "").slice(0, 24),
	category: String(d.category ?? "mixed").slice(0, 32)
})).handler(createSsrRpc("654744ea20b062d2b60f2f278bae3afff117b661a98239f16be07de3cbbc8a19"));
var GAME_MODES = /* @__PURE__ */ new Set([
	"classic",
	"timed",
	"survival",
	"blitz",
	"zen",
	"daily",
	"endless",
	"fog",
	"mirror",
	"category",
	"boss",
	"rush",
	"precision",
	"hardcore",
	"double_reward",
	"no_hints",
	"small_grid",
	"giant_grid",
	"reverse_only",
	"diagonal",
	"orthogonal",
	"chaos",
	"streak",
	"treasure",
	"nightmare",
	"focus",
	"speedrun",
	"marathon",
	"random_rules"
]);
var clean = (v, max) => String(v ?? "").trim().slice(0, max);
var createMultiplayerRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	displayName: clean(d.displayName || "Traveler", 40) || "Traveler",
	mode: (() => {
		const m = clean(d.mode || "classic", 40);
		return GAME_MODES.has(m) ? m : "classic";
	})(),
	maxPlayers: Math.max(2, Math.min(8, Math.floor(Number(d.maxPlayers) || 4)))
})).handler(createSsrRpc("cd09e5b6c0789d2b1cfcd03514df492467c7b0106c65aa45b71bfb259de1dae1"));
var joinMultiplayerRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	roomId: clean(d.roomId, 80),
	displayName: clean(d.displayName || "Traveler", 40) || "Traveler"
})).handler(createSsrRpc("8e4309aecef59284eab42dbc5b72ae7a718dad8d24fd17bbe3811a78adf5749a"));
var getMultiplayerRoom = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => ({ roomId: clean(d.roomId, 80) })).handler(createSsrRpc("8791a086e1c78691cc5308a94779250d350215fe138b257f1849f5bcdbb4ac19"));
var quickMatchMultiplayer = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("1ab126d4b4f21473c6c71fd3895cd56a2fdba4037512e843f3171f2fe9368e5f"));
var heartbeatMultiplayerRoom = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ roomId: clean(d.roomId, 80) })).handler(createSsrRpc("30cdc3d6b014f834542fab2be41d2bffa59815656727d060a199154c71b90160"));
var sendMultiplayerRoomMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	roomId: clean(d.roomId, 80),
	message: clean(d.message, 160)
})).handler(createSsrRpc("b5d203d1dccdc4511217037afc7647adf01f68b90d2db32bc4980d97dda4806a"));
var updateMultiplayerScore = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	roomId: clean(d.roomId, 80),
	score: Math.max(0, Math.min(999, Math.floor(Number(d.score) || 0)))
})).handler(createSsrRpc("f3c5e9aaa127ec514f1ea5493526ed3212b2b4455e17ab5e3b442432b55c459c"));
var POWER_UPS = [
	{
		id: "reveal",
		name: "Reveal",
		description: "Reveal the first tile of an unfound word.",
		cost: 18,
		cooldownMs: 0
	},
	{
		id: "scan",
		name: "Word Scan",
		description: "Reveal every tile of the next target word.",
		cost: 45,
		cooldownMs: 0
	},
	{
		id: "focus",
		name: "Focus",
		description: "A short focus boost for difficult rounds.",
		cost: 30,
		cooldownMs: 3e4
	},
	{
		id: "streak",
		name: "Streak Shield",
		description: "Protect your current combo from the next miss.",
		cost: 55,
		cooldownMs: 6e4
	}
];
var DAILY_QUESTS = [
	{
		id: "q_words_10",
		title: "Word Hunter",
		description: "Find 10 words.",
		metric: "wordsFound",
		target: 10,
		rewardCoins: 60,
		rewardXp: 35
	},
	{
		id: "q_win_2",
		title: "Journey Forward",
		description: "Complete 2 rounds.",
		metric: "gamesWon",
		target: 2,
		rewardCoins: 75,
		rewardXp: 45
	},
	{
		id: "q_perfect",
		title: "Flawless",
		description: "Get 1 perfect clear.",
		metric: "perfectClears",
		target: 1,
		rewardCoins: 120,
		rewardXp: 80
	}
];
function questProgress(quest, stats) {
	const value = stats[quest.metric];
	return Math.min(quest.target, Math.max(0, value));
}
function playerXpLevel(xp) {
	return Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 40)) + 1);
}
function xpIntoLevel(xp) {
	const level = playerXpLevel(xp);
	const previous = Math.max(0, (level - 1) * (level - 1) * 40);
	const next = level * level * 40;
	return {
		level,
		current: Math.max(0, xp - previous),
		needed: Math.max(1, next - previous)
	};
}
async function getMyEntitlements(...args) {
	return [];
}
function useAdFree() {
	const [adFree, setAdFree] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let alive = true;
		getMyEntitlements().then((rows) => {
			if (!alive) return;
			setAdFree(rows.some((row) => row.productId === "ad_free" && row.active && (!row.expiresAt || new Date(row.expiresAt).getTime() > Date.now())));
		}).catch(() => {
			if (alive) setAdFree(false);
		});
		return () => {
			alive = false;
		};
	}, []);
	return adFree;
}
function JourneyLoading() {
	const [progress, setProgress] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => setProgress((p) => Math.min(100, p + 8)), 70);
		return () => clearInterval(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "journey-loading app-shell starfield safe-pad grid h-dvh place-items-center text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "journey-orb mx-auto mb-5",
					children: "✦"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.35em] text-accent",
					children: "Ink & Starlight"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl text-fg",
					children: "Mera Word Search Journey"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-2 max-w-[30ch] text-sm text-muted",
					children: "Words become paths. Paths become adventures."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-7 h-2 overflow-hidden rounded-full bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary transition-all",
						style: { width: `${progress}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted",
					children: [
						"Preparing your journey… ",
						progress,
						"%"
					]
				})
			]
		})
	});
}
function GameplayFeedback({ combo, found, total }) {
	const multiplier = combo >= 5 ? 3 : combo >= 3 ? 2 : 1;
	const remaining = Math.max(0, total - found);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "gameplay-hud",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-chip text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-3.5 text-gold" }),
					" Combo ",
					combo
				]
			}),
			multiplier > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "combo-burst",
				children: ["x", multiplier]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hud-chip text-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-3.5 text-accent" }),
					" ",
					remaining,
					" left"
				]
			})
		]
	});
}
function fmt(ms) {
	const s = Math.max(0, Math.floor(ms / 1e3));
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
function PlayScreen() {
	const play = useGame((s) => s.play);
	const save = useGame((s) => s.save);
	const overlay = useGame((s) => s.overlay);
	const lastReward = useGame((s) => s.lastReward);
	const lang = save.language;
	const user = useCurrentUser();
	const [tick, setTick] = (0, import_react.useState)(0);
	const [aiHint, setAiHint] = (0, import_react.useState)(null);
	const [aiBusy, setAiBusy] = (0, import_react.useState)(false);
	const [powerCooldowns, setPowerCooldowns] = (0, import_react.useState)({});
	const [showSystems, setShowSystems] = (0, import_react.useState)(false);
	const [feedbackKey, setFeedbackKey] = (0, import_react.useState)(0);
	const [multiplayer, setMultiplayer] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (play?.found.length) setFeedbackKey((n) => n + 1);
	}, [play?.found.length]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined" || !play) return;
		const roomId = sessionStorage.getItem("mwsj.multiplayer.room");
		const bot = sessionStorage.getItem("mwsj.multiplayer.bot") === "1";
		if (!roomId && !bot) {
			setMultiplayer(null);
			return;
		}
		if (bot) {
			Math.min(play.puzzle.words.length, Math.floor(Math.max(0, Date.now() - play.startAt) / 8500));
			const updateBot = () => {
				const current = useGame.getState().play;
				if (!current) return;
				const opponentScore = Math.min(current.puzzle.words.length, Math.floor(Math.max(0, Date.now() - current.startAt) / 8500));
				const opponentFound = current.puzzle.words.slice(0, opponentScore);
				setMultiplayer({
					roomId: "practice",
					opponent: "Practice Bot",
					opponentScore,
					opponentFound
				});
			};
			updateBot();
			const botTimer = window.setInterval(updateBot, 500);
			return () => window.clearInterval(botTimer);
		}
		let alive = true;
		const poll = async () => {
			try {
				const r = await getMultiplayerRoom({ data: { roomId } });
				if (!alive || !r.ok || !r.room) return;
				const room = r.room;
				const me = user?.id;
				const other = room.members?.find((m) => m.userId !== me);
				const scores = room.state?.scores ?? {};
				const opponentScore = other ? Number(scores[other.userId] ?? 0) : 0;
				setMultiplayer({
					roomId,
					opponent: other?.displayName ?? "Opponent",
					opponentScore,
					opponentFound: []
				});
				await updateMultiplayerScore({ data: {
					roomId,
					score: play.found.length
				} });
			} catch {}
		};
		poll();
		const timer = window.setInterval(poll, 2e3);
		return () => {
			alive = false;
			window.clearInterval(timer);
		};
	}, [
		play?.puzzle.id,
		user?.id,
		play?.startAt
	]);
	const adFree = useAdFree();
	(0, import_react.useEffect)(() => {
		if (!play || !user || play.serverSessionId) return;
		startGameplaySession({ data: {
			kind: play.kind === "daily" ? "daily" : "level",
			level: play.level || 1,
			day: play.kind === "daily" ? todayKey() : void 0,
			mode: play.mode,
			language: save.language,
			dailyChallengeId: play.dailyChallenge?.id
		} }).then((res) => {
			if (res.ok && useGame.getState().play?.serverSessionId == null) {
				const current = useGame.getState().play;
				if (current) {
					const next = {
						...current,
						serverSessionId: res.sessionId,
						timeLimit: Math.floor(res.timeLimitMs / 1e3),
						adaptiveTier: res.adaptiveTier ?? current.adaptiveTier
					};
					sessionStorage.setItem("mwsj.play.v1", JSON.stringify(next));
					useGame.setState({ play: next });
				}
			}
		}).catch(() => void 0);
	}, [
		play?.serverSessionId,
		play?.level,
		play?.kind,
		play?.mode,
		save.language,
		user
	]);
	(0, import_react.useEffect)(() => {
		if (!play || play.pausedAt || overlay) return;
		const id = window.setInterval(() => setTick((n) => n + 1), 250);
		return () => clearInterval(id);
	}, [
		play,
		overlay,
		play?.pausedAt
	]);
	const elapsed = play ? (play.pausedAt ? play.pausedAt : Date.now()) - play.startAt - play.pausedMs : 0;
	const remaining = play?.timeLimit != null ? play.timeLimit * 1e3 - elapsed : null;
	(0, import_react.useEffect)(() => {
		if (remaining != null && remaining <= 0 && play && !overlay) useGame.getState().failPlay();
	}, [
		remaining,
		play,
		overlay,
		tick
	]);
	const remainingWords = (0, import_react.useMemo)(() => {
		if (!play) return [];
		return play.puzzle.words.filter((w) => !play.found.includes(w));
	}, [play]);
	if (!play) return null;
	const fog = play.mode === "fog" || play.dailyChallenge?.id === "hidden";
	const mirror = play.mode === "mirror";
	const onAi = async () => {
		const w = remainingWords[0];
		if (!w || aiBusy) return;
		setAiBusy(true);
		try {
			const res = await askSmartHint({ data: {
				word: w,
				category: play.puzzle.category
			} });
			setAiHint(res.ok ? res.text : res.error);
		} catch {
			setAiHint("Sign in to ask the scribe for a riddle.");
		} finally {
			setAiBusy(false);
		}
	};
	const usePowerUp = (id) => {
		const power = POWER_UPS.find((p) => p.id === id);
		if (!power) return;
		const now = Date.now();
		if ((powerCooldowns[id] ?? 0) > now) return;
		if (save.coins < power.cost) return;
		if (id === "reveal") {
			if (!useGame.getState().useHint("first")) return;
		} else if (id === "scan") {
			if (!useGame.getState().useHint("word")) return;
		} else if (id === "focus") useGame.getState().patchSave((x) => ({
			...x,
			coins: x.coins - power.cost,
			stats: {
				...x.stats,
				coinsEarned: x.stats.coinsEarned
			}
		}));
		else useGame.getState().patchSave((x) => ({
			...x,
			coins: x.coins - power.cost,
			inventory: x.inventory.includes("streak-shield") ? x.inventory : [...x.inventory, "streak-shield"]
		}));
		setPowerCooldowns((x) => ({
			...x,
			[id]: power.cooldownMs ? now + power.cooldownMs : now + 800
		}));
	};
	const xpBar = xpIntoLevel(save.xp);
	const questCards = DAILY_QUESTS.map((q) => ({
		...q,
		progress: questProgress(q, save.stats)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-shell safe-pad flex min-h-dvh flex-col gap-1 overflow-y-auto sm:gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex h-11 w-11 items-center justify-center rounded-xl panel",
						onClick: () => useGame.getState().quitPlay(),
						"aria-label": "Back",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-display text-sm text-fg",
							children: play.puzzle.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								play.found.length,
								"/",
								play.puzzle.words.length,
								play.bonus.length ? ` · +${play.bonus.length}` : ""
							]
						})]
					}),
					save.settings.showTimer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hud-chip text-fg",
						children: remaining != null ? fmt(remaining) : fmt(elapsed)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex h-11 w-11 items-center justify-center rounded-xl panel",
						onClick: () => useGame.getState().pausePlay(),
						"aria-label": t(lang, "cta.pause"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" })
					})
				]
			}),
			multiplayer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex w-full max-w-xl items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-semibold text-fg",
						children: [
							"⚔️ Live race · You ",
							play.found.length,
							" — ",
							multiplayer.opponent,
							" ",
							multiplayer.opponentScore
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary transition-all",
							style: { width: `${Math.min(100, play.found.length / Math.max(1, play.puzzle.words.length) * 100)}%` }
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-muted underline",
					onClick: () => {
						sessionStorage.removeItem("mwsj.multiplayer.room");
						sessionStorage.removeItem("mwsj.multiplayer.bot");
						setMultiplayer(null);
					},
					children: "Leave"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameplayFeedback, {
				combo: play.combo,
				found: play.found.length,
				total: play.puzzle.words.length
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalStrip, { goals: shortTermGoals({
				level: play.level || 1,
				combo: play.combo,
				found: play.found.length,
				total: play.puzzle.words.length,
				bonus: play.bonus.length,
				daily: play.kind === "daily",
				adaptiveTier: play.adaptiveTier
			}) }),
			play.dailyChallenge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-xl rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-xs text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
					play.dailyChallenge.icon,
					" ",
					play.dailyChallenge.title
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ml-2 text-muted",
					children: play.dailyChallenge.description
				})]
			}),
			play.kind === "level" && play.adaptiveTier === "assist" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-xl rounded-xl bg-accent/10 px-3 py-1.5 text-center text-[10px] font-semibold text-accent",
				children: "Smart Assist · the journey is giving you a little breathing room"
			}),
			play.kind === "level" && play.adaptiveTier === "expert" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-xl rounded-xl bg-gold/10 px-3 py-1.5 text-center text-[10px] font-semibold text-gold",
				children: "Expert Pace · bonus-word mastery challenge active"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid min-h-0 flex-1 place-items-center overflow-hidden gameplay-board-pop",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridBoard, {
					puzzle: play.puzzle,
					found: play.found,
					revealed: play.revealed,
					fog,
					mirror,
					tileStyle: save.settings.tileStyle,
					disabled: Boolean(overlay),
					opponentFound: multiplayer?.opponentFound ?? [],
					onPath: (letters, cells) => useGame.getState().submitPath(letters, cells)
				})
			}, feedbackKey),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex max-h-20 shrink-0 flex-wrap gap-1.5 overflow-y-auto py-1 sm:max-h-28",
				children: play.puzzle.words.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "word-chip text-fg",
					"data-found": play.found.includes(w) ? "1" : void 0,
					children: mirror ? [...w].reverse().join("") : w
				}, w))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "panel rounded-xl px-3 py-2 text-left text-xs font-semibold text-fg",
				onClick: () => setShowSystems((v) => !v),
				children: ["Power-ups · Daily quests · Rank ", xpBar.level]
			}),
			showSystems && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel rounded-2xl p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold uppercase tracking-wider text-gold",
							children: "Power-ups"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-muted tabular-nums",
							children: [
								xpBar.current,
								"/",
								xpBar.needed,
								" xp"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-1.5",
						children: POWER_UPS.map((p) => {
							const locked = (powerCooldowns[p.id] ?? 0) > Date.now();
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: locked || save.coins < p.cost,
								onClick: () => usePowerUp(p.id),
								className: "rounded-xl border border-border px-1 py-2 text-center text-[10px] font-semibold text-fg disabled:opacity-40",
								title: p.description,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-gold",
									children: [p.cost, "c"]
								})]
							}, p.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 mb-1 text-xs font-semibold uppercase tracking-wider text-gold",
						children: "Daily quests"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: questCards.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-surface-2 px-2 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-[11px] text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: q.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "tabular-nums",
									children: [
										q.progress,
										"/",
										q.target
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 h-1 overflow-hidden rounded-full bg-bg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-accent",
									style: { width: `${q.progress / q.target * 100}%` }
								})
							})]
						}, q.id))
					})
				]
			}),
			aiHint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-sm text-muted",
				children: aiHint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 gap-2 pb-[max(0.25rem,env(safe-area-inset-bottom))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintBtn, {
						label: "First",
						cost: HINT_COST.first,
						onClick: () => useGame.getState().useHint("first")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintBtn, {
						label: "Letter",
						cost: HINT_COST.letter,
						onClick: () => useGame.getState().useHint("letter")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HintBtn, {
						label: "Word",
						cost: HINT_COST.word,
						onClick: () => useGame.getState().useHint("word")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void onAi(),
						className: "inline-flex h-11 flex-1 items-center justify-center gap-1 rounded-xl panel text-xs font-semibold text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), aiBusy ? "…" : "Riddle"]
					})
				]
			}),
			overlay === "pause" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PauseModal, { lang }),
			overlay === "win" && lastReward && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WinModal, {
				lang,
				playKind: play.kind,
				level: play.level,
				reward: lastReward,
				adFree,
				save
			}),
			overlay === "fail" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FailModal, { lang })
		]
	});
}
function GoalStrip({ goals }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex w-full max-w-xl shrink-0 gap-1.5 overflow-x-auto pb-0.5",
		"aria-label": "Short term goals",
		children: goals.map((goal) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${goal.done ? "border-success/40 bg-success/10 text-success" : "border-white/10 bg-surface-2 text-muted"}`,
			children: [
				goal.done ? "✓" : "○",
				" ",
				goal.label
			]
		}, goal.id))
	});
}
function HintBtn({ label, cost, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "inline-flex h-11 flex-1 flex-col items-center justify-center rounded-xl panel text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1 text-xs font-semibold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "size-3.5" }), label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] text-gold",
			children: cost
		})]
	});
}
function PauseModal({ lang }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "font-display text-2xl text-fg",
		children: t(lang, "play.paused")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-primary",
			onClick: () => useGame.getState().resumePlay(),
			children: t(lang, "cta.resume")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-ghost",
			onClick: () => useGame.getState().quitPlay(),
			children: t(lang, "cta.quit")
		})]
	})] });
}
function WinModal({ lang, playKind, level, reward, adFree, save }) {
	const petXp = petXpFor(save.equippedPet, save);
	const result = playKind === "level" ? save.results[String(level)] : null;
	const earnedPetXp = save.equippedPet ? petXpEarned({
		perfect: Boolean(result?.perfect),
		boss: playKind === "level" && level > 0 && isJourneyBoss(level)
	}) : 0;
	const petProgress = petXpProgress(petXp);
	const isFinal = level >= MAX_LEVEL;
	const next = !isFinal && playKind === "level" ? puzzleForLevel(level + 1, "classic", save.language) : null;
	const preview = next ? nextChallengePreview(level + 1, next) : null;
	const world = journeyWorldForLevel(level);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs uppercase tracking-[0.18em] text-gold",
			children: reward.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-1 font-display text-3xl text-fg",
			children: t(lang, "play.complete")
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "celebration-fireworks",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-lg text-gold",
			children: ["★".repeat(reward.stars), "☆".repeat(3 - reward.stars)]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-sm text-muted",
			children: [
				"+",
				reward.coins,
				" coins · +",
				reward.xp,
				" xp"
			]
		}),
		save.equippedPet && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 rounded-2xl bg-surface-2 p-3 text-left text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "🐾 Pet progress"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
					className: "text-fg",
					children: [
						petEvolutionName(petProgress.level),
						" · Lv. ",
						petProgress.level
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 text-muted",
				children: [
					"+",
					earnedPetXp,
					" Pet XP · ",
					petProgress.next == null ? "Evolution maxed" : `${Math.max(0, petProgress.next - petXp)} XP to next evolution`
				]
			})]
		}),
		preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 rounded-2xl border border-white/10 bg-surface-2 p-3 text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-[0.18em] text-accent",
					children: "Next challenge"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm font-semibold text-fg",
					children: [
						preview.icon,
						" ",
						preview.label
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-0.5 text-xs text-muted",
					children: [
						"Level ",
						level + 1,
						" · ",
						preview.detail
					]
				})
			]
		}),
		isFinal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 rounded-2xl bg-gold/10 p-3 text-sm text-gold",
			children: [
				"🏆 ",
				world.name,
				" campaign complete. The final archive is restored."
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex flex-col gap-2",
			children: [
				playKind === "level" && level > 0 && isJourneyBoss(level) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-primary",
					onClick: () => useGame.getState().startBossCombat(level),
					children: "Enter Guardian Battle"
				}),
				playKind === "level" && !isFinal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-primary",
					onClick: () => {
						const nextLevel = () => useGame.getState().startLevel(level + 1);
						if (!adFree && showH5Interstitial("level-complete", nextLevel)) return;
						nextLevel();
					},
					children: t(lang, "cta.next")
				}),
				isFinal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-primary",
					onClick: () => useGame.getState().go("worldMap"),
					children: "Journey Map"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: () => useGame.getState().quitPlay(),
					children: t(lang, "cta.home")
				})
			]
		})
	] });
}
function FailModal({ lang }) {
	const play = useGame((s) => s.play);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "font-display text-2xl text-fg",
		children: t(lang, "play.failed")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-primary",
			onClick: () => {
				if (!play) return;
				if (play.kind === "daily") useGame.getState().startDaily();
				else if (play.kind === "endless") useGame.getState().startEndless();
				else useGame.getState().startLevel(play.level, play.mode);
			},
			children: t(lang, "cta.retry")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-ghost",
			onClick: () => useGame.getState().quitPlay(),
			children: t(lang, "cta.home")
		})]
	})] });
}
function Modal({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-20 grid place-items-center bg-bg/70 p-6 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "panel animate-pop w-full max-w-sm rounded-2xl p-6 text-center",
			children
		})
	});
}
function Screen({ title, children, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-shell safe-pad flex h-dvh min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-3 flex shrink-0 items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "inline-flex h-11 w-11 items-center justify-center rounded-xl panel",
				onClick: onBack ?? (() => useGame.getState().back()),
				"aria-label": "Back",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-xl text-fg",
				children: title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto overscroll-contain pb-16",
			children
		})]
	});
}
function HudChips() {
	const save = useGame((s) => s.save);
	const refilledSave = refillEnergy(save);
	const eta = energyEta(refilledSave);
	const m = Math.floor(eta / 6e4);
	const sec = Math.floor(eta % 6e4 / 1e3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hud-chip flex items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-base font-extrabold text-white shadow-md backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "size-6 text-yellow-400" }), refilledSave.coins]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hud-chip flex items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-base font-extrabold text-white shadow-md backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { className: "size-6 text-cyan-400" }), refilledSave.diamonds]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hud-chip flex items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-base font-extrabold text-white shadow-md backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-6 text-yellow-300" }), refilledSave.stars]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hud-chip flex items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-base font-extrabold text-white shadow-md backdrop-blur-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-6 text-orange-400" }),
					refilledSave.energy,
					"/",
					20,
					refilledSave.energy < 20 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 text-sm font-normal opacity-90",
						children: [
							m,
							":",
							String(sec).padStart(2, "0")
						]
					})
				]
			})
		]
	});
}
function TileButton({ icon, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "panel flex min-h-20 flex-col items-start justify-between rounded-2xl p-3 text-left transition-transform active:scale-[0.98]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-primary",
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-semibold text-fg",
			children: label
		})]
	});
}
function useT() {
	const lang = useGame((s) => s.save.language);
	return (key) => t(lang, key);
}
function SplashScreen() {
	const t = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "app-shell starfield safe-pad flex h-dvh w-full flex-col items-center justify-center gap-6 text-center",
		onClick: () => {
			unlockAudio();
			if (useGame.getState().save.settings.music) startMusic();
			useGame.getState().go("home");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.28em] text-accent",
				children: "Ink & Starlight"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display max-w-[16ch] text-4xl leading-[1.05] text-fg sm:text-5xl",
				children: t("app.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-[28ch] text-muted",
				children: t("app.tag")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "btn-primary max-w-xs",
				children: t("cta.start")
			})
		]
	});
}
function HomeScreen() {
	const t = useT();
	const save = useGame((s) => s.save);
	const world = worldOf(save.unlockedLevel);
	const claimed = save.lastLoginReward === todayKey();
	const level = playerLevel(save.xp);
	const levelBase = xpForLevel(level);
	const nextBase = xpForLevel(level + 1);
	const levelProgress = nextBase > levelBase ? Math.min(100, Math.round((save.xp - levelBase) / (nextBase - levelBase) * 100)) : 100;
	const streak = Math.max(save.dailyStreak, save.stats.currentStreak);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "app-shell starfield safe-pad relative flex h-dvh flex-col overflow-y-auto pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3 pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "dashboard-avatar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: save.avatarId?.slice(0, 1)?.toUpperCase() || "✦" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-[0.28em] text-accent",
							children: "Ink & Starlight"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate font-display text-2xl text-fg",
							children: save.playerName
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dashboard-icon-btn",
						"aria-label": "Notifications",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "dashboard-icon-btn",
						onClick: () => useGame.getState().go("profile"),
						"aria-label": t("cta.profile"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-5" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "dashboard-currency-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "dashboard-currency",
						onClick: () => useGame.getState().go("shop"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "currency-icon coin",
							children: "◈"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: save.coins.toLocaleString() }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Coins" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "dashboard-currency premium",
						onClick: () => useGame.getState().go("shop"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "currency-icon gem",
								children: "✦"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: save.diamonds.toLocaleString() }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Diamonds" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 opacity-50" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "dashboard-currency",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "currency-icon energy",
							children: "ϟ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: save.energy }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Energy" })] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "dashboard-hero journey-hero animate-pop overflow-hidden rounded-[28px] p-5 sm:p-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "journey-hero-glow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 grid gap-6 md:grid-cols-[1.35fr_.65fr] md:items-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "dashboard-kicker",
								children: "Current expedition"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "dashboard-pill",
								children: ["World ", WORLDS.findIndex((w) => w.id === world.id) + 1]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "max-w-[16ch] font-display text-4xl leading-none text-fg sm:text-5xl",
							children: world.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 max-w-[48ch] text-sm text-muted",
							children: [
								"Level ",
								save.unlockedLevel,
								" is waiting. Continue your journey and uncover the next hidden word."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 max-w-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Level ", level] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [levelProgress, "% XP"] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "dashboard-progress",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { width: levelProgress + "%" } })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "journey-continue btn-primary mt-5 max-w-md",
							onClick: () => useGame.getState().startLevel(save.unlockedLevel),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs uppercase tracking-[0.2em] opacity-75",
								children: "Continue Journey"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "block text-lg",
								children: ["Play Level ", save.unlockedLevel]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-6" })]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "dashboard-orbit",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "dashboard-orbit-core",
								children: "✦"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dashboard-orbit-ring ring-a" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dashboard-orbit-ring ring-b" })
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "dashboard-stat",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "dashboard-stat-icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: streak }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Day streak" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "dashboard-stat",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "dashboard-stat-icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: save.stats.levelsCompleted }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Levels cleared" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "dashboard-stat",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "dashboard-stat-icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: save.stats.perfectClears }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Perfect clears" })] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 lg:grid-cols-[1.15fr_.85fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "dashboard-feature dashboard-feature-gold",
					onClick: () => useGame.getState().go("daily"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "dashboard-kicker text-yellow-200",
							children: "Live today"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-2xl text-white",
							children: "Daily Discovery"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-white/65",
							children: "Keep your streak alive and earn bonus rewards."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "dashboard-feature-icon",
						children: "✧"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "dashboard-feature dashboard-feature-purple",
					onClick: () => useGame.getState().go("shop"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "dashboard-kicker text-indigo-200",
							children: "Premium"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 font-display text-2xl text-white",
							children: "Diamond Vault"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-white/65",
							children: "Top up with USDC on Base."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-8 text-white/80" })]
				})]
			}),
			!claimed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "dashboard-reward",
				onClick: () => useGame.getState().claimLogin(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "dashboard-reward-icon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 flex-1 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Daily reward is ready" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
							"Day ",
							save.loginDays % 7 + 1,
							" · Claim your free coins"
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "dashboard-claim",
						children: "Claim"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "dashboard-kicker",
					children: "Quick travel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-2xl text-fg",
					children: "Your World"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "text-xs font-bold uppercase tracking-[0.15em] text-accent",
					onClick: () => useGame.getState().go("worlds"),
					children: "View map"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2 sm:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileButton, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map$1, { className: "size-5" }),
						label: t("cta.worlds"),
						onClick: () => useGame.getState().go("worlds")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileButton, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-5" }),
						label: t("cta.modes"),
						onClick: () => useGame.getState().go("modes")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileButton, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PawPrint, { className: "size-5" }),
						label: t("cta.pets"),
						onClick: () => useGame.getState().go("pets")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileButton, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }),
						label: t("cta.shop"),
						onClick: () => useGame.getState().go("shop")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileButton, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-5" }),
						label: t("cta.achievements"),
						onClick: () => useGame.getState().go("achievements")
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "dashboard-footer-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "dashboard-kicker",
						children: "Traveler profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-xl text-fg",
						children: [
							"Level ",
							level,
							" Explorer"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							save.stats.wordsFound.toLocaleString(),
							" words discovered across ",
							save.stats.gamesWon.toLocaleString(),
							" victories."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "dashboard-outline-btn",
					onClick: () => useGame.getState().go("profile"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "size-4" }), " Profile"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "dashboard-bottom-nav",
				"aria-label": "Main navigation",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "active",
						onClick: () => useGame.getState().go("home"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map$1, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Home" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => useGame.getState().go("worlds"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Worlds" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => useGame.getState().startLevel(save.unlockedLevel),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Play" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => useGame.getState().go("shop"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shop" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => useGame.getState().go("profile"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Profile" })]
					})
				]
			})
		]
	});
}
var PAGE = 40;
function WorldsScreen() {
	const t = useT();
	const save = useGame((s) => s.save);
	const [worldId, setWorldId] = (0, import_react.useState)(() => worldOf(save.unlockedLevel).id);
	const [page, setPage] = (0, import_react.useState)(0);
	const world = WORLDS.find((w) => w.id === worldId) ?? WORLDS[0];
	const levels = (0, import_react.useMemo)(() => {
		const all = [];
		for (let i = world.from; i <= world.to; i++) all.push(i);
		return all;
	}, [world]);
	const pages = Math.max(1, Math.ceil(levels.length / PAGE));
	const safePage = Math.min(page, pages - 1);
	const slice = levels.slice(safePage * PAGE, safePage * PAGE + PAGE);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: t("cta.worlds"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex gap-2 overflow-x-auto pb-1",
				children: WORLDS.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setWorldId(w.id);
						setPage(0);
					},
					className: "hud-chip shrink-0 text-fg",
					style: w.id === worldId ? { borderColor: "var(--color-primary)" } : void 0,
					children: w.name
				}, w.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: world.blurb
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-5 gap-2 sm:grid-cols-8",
				children: slice.map((n) => {
					const locked = n > save.unlockedLevel;
					const res = save.results[String(n)];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: locked,
						onClick: () => useGame.getState().startLevel(n),
						className: "panel relative flex aspect-square flex-col items-center justify-center rounded-xl text-xs font-semibold text-fg disabled:opacity-40",
						children: [
							locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5 text-muted" }) : n,
							isBoss(n) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-1 top-1 size-1.5 rounded-full bg-gold" }),
							res && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-gold",
								children: [res.stars, "★"]
							})
						]
					}, n);
				})
			}),
			pages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex h-11 w-11 items-center justify-center rounded-xl panel",
						disabled: safePage === 0,
						onClick: () => setPage((p) => Math.max(0, p - 1)),
						"aria-label": "Previous page",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted",
						children: [
							safePage + 1,
							" / ",
							pages
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex h-11 w-11 items-center justify-center rounded-xl panel",
						disabled: safePage >= pages - 1,
						onClick: () => setPage((p) => Math.min(pages - 1, p + 1)),
						"aria-label": "Next page",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					})
				]
			})
		]
	});
}
function ModesScreen() {
	const t = useT();
	const level = useGame((s) => s.save.unlockedLevel);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: t("cta.modes"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2",
			children: ADVANCED_MODE_CATALOG.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "panel rounded-2xl p-4 text-left transition-transform active:scale-[0.99]",
				onClick: () => {
					if (m.id === "endless") useGame.getState().startEndless();
					else useGame.getState().startLevel(level, m.id);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-fg",
						children: m.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hud-chip text-[10px] text-gold",
						children: m.difficulty === 0 ? "FREE" : `★ ${m.difficulty}`
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: m.description
				})]
			}, m.id))
		})
	});
}
var THEMES = [
	{
		id: "midnight",
		name: "Midnight Ink",
		bg: "#0b0f18",
		fg: "#ece8dc",
		tile: "#1c2436",
		accent: "#667eea"
	},
	{
		id: "parchment",
		name: "Parchment",
		bg: "#e8dcc8",
		fg: "#2a2418",
		tile: "#f4efe2",
		accent: "#6b4f2a"
	},
	{
		id: "ocean",
		name: "Tidepool",
		bg: "#07161c",
		fg: "#d7f0ea",
		tile: "#123039",
		accent: "#3dba9a"
	},
	{
		id: "forest",
		name: "Canopy",
		bg: "#10160f",
		fg: "#e6edd8",
		tile: "#1c2a18",
		accent: "#7aa35a"
	},
	{
		id: "ember",
		name: "Hearth",
		bg: "#1a0f0c",
		fg: "#f3e2d4",
		tile: "#2c1812",
		accent: "#e07a4c"
	},
	{
		id: "orchid",
		name: "Orchid",
		bg: "#140e18",
		fg: "#f0e4f2",
		tile: "#26182c",
		accent: "#b07ad4"
	},
	{
		id: "arctic",
		name: "Arctic",
		bg: "#0e1418",
		fg: "#e8eef3",
		tile: "#1a2630",
		accent: "#8eb4d4"
	},
	{
		id: "sakura",
		name: "Sakura",
		bg: "#181014",
		fg: "#f6e8ea",
		tile: "#2a1820",
		accent: "#e08aa0"
	}
];
var AVATARS = [
	{
		id: "ink-1",
		label: "Quill"
	},
	{
		id: "ink-2",
		label: "Lantern"
	},
	{
		id: "ink-3",
		label: "Compass"
	},
	{
		id: "ink-4",
		label: "Anchor"
	},
	{
		id: "ink-5",
		label: "Falcon"
	},
	{
		id: "ink-6",
		label: "Lotus"
	},
	{
		id: "ink-7",
		label: "Crescent"
	},
	{
		id: "ink-8",
		label: "Mountain"
	},
	{
		id: "ink-9",
		label: "Wave"
	},
	{
		id: "ink-10",
		label: "Star"
	},
	{
		id: "ink-11",
		label: "Leaf"
	},
	{
		id: "ink-12",
		label: "Flame"
	}
];
var CLASSES = [
	{
		id: "detective",
		name: "Detective",
		blurb: "Sees one extra first-letter hint."
	},
	{
		id: "scholar",
		name: "Scholar",
		blurb: "Dictionary entries unlock earlier."
	},
	{
		id: "explorer",
		name: "Explorer",
		blurb: "Starts with the Inkhound companion."
	},
	{
		id: "warrior",
		name: "Warrior",
		blurb: "Boss timers are a little kinder."
	}
];
function resolveSignInGateState(input) {
	if (input.isPending) return "pending";
	return input.hasUser ? "signed_in" : "signed_out";
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/** Render children only when a user is present (real session, or the disabled-auth dev user). */
function SignedIn({ children }) {
	const { user } = useCurrentUserState();
	return user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children }) : null;
}
/**
* Render children only once we KNOW the visitor is signed out (`isPending` has
* cleared and there is no user). Hidden while the session is still loading.
*/
function SignedOut({ children }) {
	const { user, isPending } = useCurrentUserState();
	if (isPending || user) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
function SignInGate({ children, fallback }) {
	const { user, isPending } = useCurrentUserState();
	const [rechecking, setRechecking] = (0, import_react.useState)(false);
	const attempted = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (isPending || user || attempted.current || false) return;
		attempted.current = true;
		let cancelled = false;
		setRechecking(true);
		const retry = async () => {
			for (let i = 0; i < 3; i += 1) {
				try {
					if ((await authClient.getSession()).data?.user) break;
				} catch {}
				await new Promise((resolve) => window.setTimeout(resolve, 700));
			}
			if (!cancelled) setRechecking(false);
		};
		retry();
		return () => {
			cancelled = true;
		};
	}, [isPending, user]);
	const state = resolveSignInGateState({
		isPending,
		hasUser: user !== null
	});
	if (state === "pending" || rechecking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-surface px-6 text-sm text-muted",
		children: "Restoring your journey…"
	});
	if (state === "signed_in") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: fallback ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInButtons, {}) });
}
function SignInButtons() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex w-full max-w-sm flex-col gap-2",
		children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => signIn(p.providerId, { callbackURL: "/" }),
			className: "w-full cursor-pointer rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900",
			children: ["Continue with ", p.label]
		}, p.providerId))
	});
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function CloudRow() {
	const signedIn = Boolean(useCurrentUser()?.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "panel rounded-2xl p-4 text-sm text-muted",
		children: signedIn ? "Cloud account connected." : "Sign in to enable cloud save."
	});
}
function ShopScreen() {
	const t = useT();
	const owned = useGame((s) => s.save.ownedThemes);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: t("shop.title"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HudChips, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 flex flex-col gap-2",
			children: SHOP.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "panel flex items-center justify-between rounded-2xl p-4 text-left",
				onClick: () => useGame.getState().buy(item.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-semibold text-fg",
					children: item.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: "theme" in item && item.theme && owned.includes(item.theme) ? "Owned" : item.kind
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm font-semibold text-gold",
					children: [item.coins ? `${item.coins}c` : "", item.diamonds ? `${item.diamonds}d` : ""]
				})]
			}, item.id))
		})]
	});
}
function PetsScreen() {
	const t = useT();
	const save = useGame((s) => s.save);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: t("pets.title"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2",
			children: PETS.map((p) => {
				const owned = save.ownedPets.includes(p.id);
				const on = save.equippedPet === p.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "panel rounded-2xl p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-fg",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wider text-accent",
								children: p.role
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: p.blurb
							})
						] }), owned ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "hud-chip text-fg",
								onClick: () => useGame.getState().equipPet(p.id),
								children: on ? "With you" : "Travel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "hud-chip text-gold",
								onClick: () => useGame.getState().upgradePet(p.id),
								children: [
									"Lv ",
									save.petLevels[p.id] ?? 1,
									" · Upgrade"
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "hud-chip text-gold",
							onClick: () => useGame.getState().buyPet(p.id),
							children: p.coins ? `${p.coins}c` : `${p.diamonds}d`
						})]
					})
				}, p.id);
			})
		})
	});
}
function ProfileScreen() {
	const t = useT();
	const save = useGame((s) => s.save);
	const user = useCurrentUser();
	const lv = playerLevel(save.xp);
	const next = xpForLevel(lv + 1);
	const xpBase = xpForLevel(lv);
	const progress = Math.min(100, Math.max(0, (save.xp - xpBase) / Math.max(1, next - xpBase) * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: t("profile.title"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel overflow-hidden rounded-3xl p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-20 shrink-0 place-items-center rounded-3xl bg-primary/15 text-4xl",
									children: save.avatarId === "ink-1" ? "🪶" : save.avatarId === "ink-2" ? "🏮" : save.avatarId === "ink-3" ? "🧭" : "✨"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs uppercase tracking-[0.18em] text-accent",
											children: "Traveler Profile"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "mt-1 truncate font-display text-2xl text-fg",
											children: save.playerName || "Traveler"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 truncate text-sm text-muted",
											children: ["@", user?.username || user?.displayName || save.playerName || "traveler"]
										}),
										user?.primaryEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 truncate text-xs text-muted",
											children: user.primaryEmail
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-surface-2 px-4 py-3 text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-wider text-muted",
										children: "Level"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-2xl text-fg",
										children: lv
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1 flex justify-between text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [save.xp, " XP"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [next, " XP"] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-3 overflow-hidden rounded-full bg-surface-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-primary transition-all",
									style: { width: `${progress}%` }
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4",
							children: [
								["Words", save.stats.wordsFound],
								["Games", save.stats.gamesPlayed],
								["Wins", save.stats.gamesWon],
								["Hours", (save.stats.playTimeMs / 36e5).toFixed(1)]
							].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-surface-2 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] uppercase tracking-wider text-muted",
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-lg font-bold text-fg",
									children: value
								})]
							}, String(label)))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel rounded-3xl p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider text-accent",
							children: "Identity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mt-3 block text-xs text-muted",
							children: "Display name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg",
							value: save.playerName,
							maxLength: 24,
							onChange: (e) => useGame.getState().setName(e.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 rounded-xl bg-surface-2 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "Account"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "max-w-[65%] truncate text-fg",
									children: user?.primaryEmail || "Local profile"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 rounded-xl bg-surface-2 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "Class"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "capitalize text-fg",
									children: save.classId
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs uppercase tracking-wider text-muted",
					children: "Choose your class"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
					children: CLASSES.map((c) => {
						const selected = save.classId === c.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "panel rounded-2xl p-4 text-left",
							onClick: () => useGame.getState().patchSave((s) => ({
								...s,
								classId: c.id
							})),
							style: selected ? { outline: "2px solid var(--color-primary)" } : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold text-fg",
								children: [c.name, selected ? " ✓" : ""]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted",
								children: c.blurb
							})]
						}, c.id);
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs uppercase tracking-wider text-muted",
					children: "Avatar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2 sm:grid-cols-6",
					children: AVATARS.map((a) => {
						const icons = {
							"ink-1": "🪶",
							"ink-2": "🏮",
							"ink-3": "🧭",
							"ink-4": "⚓",
							"ink-5": "🦅",
							"ink-6": "🪷",
							"ink-7": "🌙",
							"ink-8": "⛰️",
							"ink-9": "🌊",
							"ink-10": "⭐",
							"ink-11": "🍃",
							"ink-12": "🔥"
						};
						const selected = save.avatarId === a.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => useGame.getState().setAvatar(a.id),
							className: "panel flex aspect-square flex-col items-center justify-center rounded-2xl text-xs text-fg",
							style: selected ? { outline: "2px solid var(--color-primary)" } : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl",
								children: icons[a.id] ?? "✨"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 text-[10px] opacity-80",
								children: a.label
							})]
						}, a.id);
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "btn-primary max-w-xs",
						children: t("cta.signIn")
					}) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudRow, {})
			]
		})
	});
}
function SettingsScreen() {
	const t$1 = useT();
	const s = useGame((s) => s.save.settings);
	const lang = useGame((s) => s.save.language);
	const set = useGame.getState().setSetting;
	const [category, setCategory] = (0, import_react.useState)(null);
	const toggle = (k) => {
		const next = !s[k];
		set(k, next);
		if (k === "music") {
			applyVolumes({ musicOn: next });
			if (next) startMusic();
			else stopMusic();
		}
		if (k === "sfx") applyVolumes({ sfxOn: next });
	};
	const categories = [
		{
			id: "gameplay",
			icon: "🎮",
			title: "Gameplay",
			description: "Game behavior and play options"
		},
		{
			id: "audio",
			icon: "🔊",
			title: "Audio",
			description: "Music, sound effects and haptics"
		},
		{
			id: "appearance",
			icon: "🎨",
			title: "Appearance",
			description: "Theme and tile style"
		},
		{
			id: "accessibility",
			icon: "♿",
			title: "Accessibility",
			description: "Display, motion and reading options"
		},
		{
			id: "language",
			icon: "🌐",
			title: "Language",
			description: "Choose your language"
		},
		{
			id: "data",
			icon: "💾",
			title: "Data",
			description: "Export, import or reset your save"
		}
	];
	const renderCategory = () => {
		switch (category) {
			case "gameplay": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingHeader, {
					title: "Gameplay",
					onBack: () => setCategory(null)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Personalized gameplay",
					on: s.personalization,
					onClick: () => toggle("personalization")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "-mt-1 mb-3 text-xs text-muted",
					children: "Uses only in-game behavior such as pace, hints, combos, pets and challenges."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Show timer",
					on: s.showTimer,
					onClick: () => toggle("showTimer")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Grid lines",
					on: s.gridLines,
					onClick: () => toggle("gridLines")
				})
			] });
			case "audio": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingHeader, {
					title: "Audio",
					onBack: () => setCategory(null)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Sound effects",
					on: s.sfx,
					onClick: () => toggle("sfx")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Music",
					on: s.music,
					onClick: () => toggle("music")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Haptics",
					on: s.haptics,
					onClick: () => toggle("haptics")
				})
			] });
			case "appearance": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingHeader, {
					title: "Appearance",
					onBack: () => setCategory(null)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Tile style"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid grid-cols-3 gap-2",
					children: [
						"carved",
						"ink",
						"neon"
					].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "hud-chip text-fg capitalize",
						onClick: () => set("tileStyle", st),
						children: st
					}, st))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-xs text-muted",
					children: "Theme"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 grid grid-cols-2 gap-2",
					children: THEMES.map((th) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "panel rounded-xl p-3 text-left",
						onClick: () => useGame.getState().equipTheme(th.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-semibold text-fg",
							children: th.name
						})
					}, th.id))
				})
			] });
			case "accessibility": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingHeader, {
					title: "Accessibility",
					onBack: () => setCategory(null)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Reduced motion",
					on: s.reducedMotion,
					onClick: () => toggle("reducedMotion")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "High contrast",
					on: s.highContrast,
					onClick: () => toggle("highContrast")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Larger type",
					on: s.largeText,
					onClick: () => toggle("largeText")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
					label: "Force RTL",
					on: s.rtlForce,
					onClick: () => toggle("rtlForce")
				})
			] });
			case "language": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingHeader, {
					title: "Language",
					onBack: () => setCategory(null)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted",
					children: "App language"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "mt-2 w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg",
					value: lang,
					onChange: (e) => useGame.getState().setLang(e.target.value),
					children: LANGS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: l,
						children: t(l, `lang.${l}`)
					}, l))
				})
			] });
			case "data": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingHeader, {
					title: "Data",
					onBack: () => setCategory(null)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost",
					onClick: () => {
						const blob = new Blob([useGame.getState().exportJson()], { type: "application/json" });
						const a = document.createElement("a");
						a.href = URL.createObjectURL(blob);
						a.download = "mera-word-search.json";
						a.click();
					},
					children: "Export save"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "btn-ghost mt-2",
					children: ["Import save", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "application/json",
						className: "hidden",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							useGame.getState().importJson(await file.text());
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-ghost mt-2 text-danger",
					onClick: () => useGame.getState().resetProgress(),
					children: "Reset progress"
				})
			] });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-col gap-3",
				children: categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setCategory(item.id),
					className: "panel flex items-center gap-4 rounded-2xl p-4 text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl",
							children: item.icon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold text-fg",
								children: item.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-xs text-muted",
								children: item.description
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg text-muted",
							children: "›"
						})
					]
				}, item.id))
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: t$1("settings.title"),
		children: renderCategory()
	});
}
function SettingHeader({ title, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "hud-chip text-fg",
			onClick: onBack,
			children: "←"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-semibold text-fg",
			children: title
		})]
	});
}
function ToggleRow({ label, on, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex w-full items-center justify-between py-3 text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hud-chip",
			children: on ? "On" : "Off"
		})]
	});
}
function AchievementsScreen() {
	const t = useT();
	const save = useGame((s) => s.save);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: t("cta.achievements"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2",
			children: ACHIEVEMENTS.map((a) => {
				const p = achievementProgress(a, save.stats);
				const claimed = save.claimedAchievements.includes(a.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel rounded-2xl p-4",
					style: { opacity: p.done ? 1 : .55 },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-fg",
							children: a.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: a.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								p.value,
								"/",
								a.target,
								" · +",
								a.reward,
								" coins"
							]
						}),
						p.done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "hud-chip mt-2 text-fg",
							disabled: claimed,
							onClick: () => useGame.getState().claimAchievement(a.id),
							children: claimed ? "Claimed" : "Claim reward"
						})
					]
				}, a.id);
			})
		})
	});
}
function StatsScreen() {
	useT();
	const st = useGame((s) => s.save.stats);
	const save = useGame((s) => s.save);
	const rows = [
		["Games played", st.gamesPlayed],
		["Games won", st.gamesWon],
		["Words found", st.wordsFound],
		["Hints used", st.hintsUsed],
		["Current streak", st.currentStreak],
		["Best streak", st.bestStreak],
		["Perfect clears", st.perfectClears],
		["Coins earned", st.coinsEarned],
		["Daily challenges", st.dailyCompleted],
		["Bosses defeated", st.bossesDefeated]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Player Ledger",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 pb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel rounded-3xl p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.18em] text-accent",
						children: "Journey ledger"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl text-fg",
						children: save.playerName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Your recorded progress, milestones and play history."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-surface-2 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Level"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xl font-bold text-fg",
									children: playerLevel(save.xp)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-surface-2 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "XP"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xl font-bold text-fg",
									children: save.xp
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-surface-2 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Play time"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xl font-bold text-fg",
									children: [(st.playTimeMs / 36e5).toFixed(1), "h"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-surface-2 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Levels"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xl font-bold text-fg",
									children: st.levelsCompleted
								})]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: rows.map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel rounded-2xl p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-2xl font-display text-fg",
						children: value
					})]
				}, label))
			})]
		})
	});
}
function SkillsScreen() {
	const t = useT();
	const save = useGame((s) => s.save);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: t("cta.skills"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-sm text-muted",
			children: [save.skillPoints, " points to spend"]
		}), [
			"speed",
			"vision",
			"luck"
		].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel mb-2 flex items-center justify-between rounded-2xl p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "capitalize font-semibold text-fg",
				children: k
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [save.skills[k], " / 10"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "hud-chip text-fg",
				onClick: () => useGame.getState().spendSkill(k),
				children: "Train"
			})]
		}, k))]
	});
}
function InventoryScreen() {
	const t = useT();
	const inv = useGame((s) => s.save.inventory);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: t("cta.inventory"),
		children: inv.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "The satchel is light."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col gap-2",
			children: inv.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "panel rounded-xl p-3 text-fg",
				children: id
			}, id))
		})
	});
}
function SpinScreen() {
	const t = useT();
	const last = useGame((s) => s.save.lastSpin);
	const [result, setResult] = (0, import_react.useState)(null);
	const free = last !== todayKey();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: t("spin.title"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: free ? "First spin today is free." : "Further spins cost 25 coins."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-primary mt-6",
				onClick: () => setResult(useGame.getState().spin()),
				children: t("cta.spinNow")
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center font-display text-2xl text-gold",
				children: result
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-1 text-sm text-muted",
				children: SPIN_TABLE.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					r.label,
					" · weight ",
					r.w
				] }, r.label))
			})
		]
	});
}
function DailyScreen() {
	const t = useT();
	const day = todayKey();
	const done = useGame((s) => s.save.lastDaily === day);
	const challenge = dailyChallengeFor(day);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: t("daily.title"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"A seeded 12×12 for ",
					day,
					". One proud clear per day."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-4 rounded-2xl p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.16em] text-gold",
						children: "Today’s variation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-lg font-semibold text-fg",
						children: [
							challenge.icon,
							" ",
							challenge.title
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: challenge.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 text-xs text-accent",
						children: [
							"Reward boost up to +",
							Math.round((challenge.rewardMultiplier - 1) * 100),
							"%"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-primary mt-6",
				disabled: done,
				onClick: () => useGame.getState().startDaily(),
				children: done ? "Already inked" : t("cta.start")
			})
		]
	});
}
function BaseScreen() {
	const save = useGame((s) => s.save);
	const upgrade = useGame((s) => s.upgradeBuilding);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Journey Base",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HudChips, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3",
				children: Object.entries(BUILDINGS).map(([id, b]) => {
					const key = id;
					const level = save.baseBuildings[key] ?? 1;
					const cost = buildingUpgradeCost(key, level);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "panel rounded-2xl p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold text-fg",
								children: [
									b.name,
									" · Lv ",
									level
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: b.effect
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "hud-chip text-gold",
								disabled: cost == null,
								onClick: () => upgrade(key),
								children: cost == null ? "MAX" : `${cost}c`
							})]
						})
					}, id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-3 rounded-2xl p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-fg",
					children: "Materials"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: Object.entries(save.materials).map(([k, v]) => `${k}: ${v}`).join(" · ")
				})]
			})
		]
	});
}
function EquipmentScreen() {
	const save = useGame((s) => s.save);
	const craft = useGame((s) => s.craft);
	const equip = useGame((s) => s.equipEquipment);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Forge & Equipment",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel rounded-3xl p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider text-accent",
							children: "Forge"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl text-fg",
							children: "Craft your gear"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Use your collected materials to create stronger equipment."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid grid-cols-3 gap-2",
							children: [
								"weapon",
								"armor",
								"charm"
							].map((slot) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "panel rounded-2xl p-3 text-center",
								onClick: () => craft(slot),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block text-lg",
										children: slot === "weapon" ? "⚔️" : slot === "armor" ? "🛡️" : "💠"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs font-semibold capitalize text-fg",
										children: slot
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-[10px] text-muted",
										children: "Craft"
									})
								]
							}, slot))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "panel rounded-3xl p-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider text-muted",
							children: "Materials"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-fg",
							children: Object.entries(save.materials).map(([k, v]) => `${k}: ${v}`).join(" · ")
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-2xl",
							children: "🔨"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs uppercase tracking-wider text-muted",
					children: "Your equipment"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3",
					children: save.equipment.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "panel rounded-2xl p-5 text-sm text-muted",
						children: "No equipment yet. Gather materials, then craft your first item."
					}) : save.equipment.map((item) => {
						const active = save.equippedEquipment[item.slot] === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "panel flex items-center gap-3 rounded-2xl p-4 text-left",
							onClick: () => equip(item.id),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-12 shrink-0 place-items-center rounded-2xl bg-surface-2 text-xl",
									children: item.slot === "weapon" ? "⚔️" : item.slot === "armor" ? "🛡️" : "💠"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-semibold text-fg",
										children: item.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-1 block text-xs capitalize text-muted",
										children: [
											item.slot,
											" · Level ",
											item.level,
											" · Power ",
											item.power
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-bold text-accent",
									children: active ? "EQUIPPED" : item.rarity.toUpperCase()
								})
							]
						}, item.id);
					})
				})] })
			]
		})
	});
}
var CHAPTERS = [
	{
		id: 0,
		title: "The first margin",
		unlock: 1,
		body: "A blank atlas washes ashore at Ink Meadow. Every word you find is a coastline returning to the map."
	},
	{
		id: 1,
		title: "Letters in the grass",
		unlock: 20,
		body: "The meadow keeps a ledger of names. Follow the paths the wind already knows."
	},
	{
		id: 2,
		title: "Cedar archive",
		unlock: 101,
		body: "Under the forest the trees store older alphabets. Diagonals are just roots seen from above."
	},
	{
		id: 3,
		title: "The granite library",
		unlock: 301,
		body: "Peaks do not hide words. They press them thin, until a single line can hold a valley."
	},
	{
		id: 4,
		title: "Saffron wind",
		unlock: 601,
		body: "Dunes rewrite themselves each dusk. Reverse a trail and the oasis is still there."
	},
	{
		id: 5,
		title: "Cavern of lamps",
		unlock: 901,
		body: "Crystals keep starlight the way paper keeps ink. Dense. Patient. Almost humming."
	},
	{
		id: 6,
		title: "The atlas without edge",
		unlock: 1001,
		body: "Legend is not a place. It is what remains when every margin has been read."
	},
	{
		id: 7,
		title: "Coda",
		unlock: 1200,
		body: "You close the book and it is still open. The next traveler will find your notes in the grain."
	}
];
var WORD_OF_DAY = [
	{
		word: "SAFAR",
		meaning: "A journey; the act of setting out."
	},
	{
		word: "QALAM",
		meaning: "A reed pen; the tool that makes a page remember."
	},
	{
		word: "UFAQ",
		meaning: "The horizon, where maps grow shy."
	},
	{
		word: "NOOR",
		meaning: "Light that does not burn the paper."
	},
	{
		word: "RAAH",
		meaning: "A path, even when it is only implied."
	}
];
var BOARDS = /* @__PURE__ */ new Set([
	"stars",
	"daily",
	"words"
]);
var getLeaderboard = createServerFn({ method: "GET" }).validator((board) => BOARDS.has(board) ? board : "stars").handler(createSsrRpc("da7c811256b020c57ac9eb1f7f3cc8354790bb23df3df0e1b611c40f89c82d3f"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	sessionId: String(d.sessionId ?? "").slice(0, 64),
	board: BOARDS.has(d.board) ? d.board : "stars"
})).handler(createSsrRpc("386132aadfcf0d2dd473368107b506023d01c0217383a58a7358f4f1a586b5d3"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ sessionId: String(d.sessionId ?? "").slice(0, 64) })).handler(createSsrRpc("e595fb0c1f64001fbf0c680adcac401918332ca64da5f83bfc9edc5a8b9ba42c"));
var getDailyBoard = createServerFn({ method: "GET" }).validator((day) => String(day ?? "").slice(0, 16)).handler(createSsrRpc("e201e4b1ab6c9d61fd78aacea19e6952286bf36c09959c57d9131b0180866b0b"));
function MoreScreen() {
	const t = useT();
	const go = useGame.getState().go;
	const [category, setCategory] = (0, import_react.useState)(null);
	const categories = [
		{
			id: "profile",
			title: "Profile",
			description: "Your identity and personal progress",
			icon: User,
			items: [
				{
					id: "profile",
					label: t("cta.profile"),
					icon: User
				},
				{
					id: "stats",
					label: t("cta.stats"),
					icon: ChartColumn
				},
				{
					id: "skills",
					label: t("cta.skills"),
					icon: Sparkles
				}
			]
		},
		{
			id: "journey",
			title: "Journey",
			description: "Explore, battle and continue your adventure",
			icon: Map$1,
			items: [
				{
					id: "base",
					label: "Camp",
					icon: House
				},
				{
					id: "worldMap",
					label: "Atlas",
					icon: Map$1
				},
				{
					id: "missions",
					label: "Missions",
					icon: Flag
				},
				{
					id: "storyQuests",
					label: "Story Quests",
					icon: ScrollText
				},
				{
					id: "npcs",
					label: "Travelers",
					icon: MessageCircle
				},
				{
					id: "combat",
					label: "Guardians",
					icon: Swords
				},
				{
					id: "equipment",
					label: "Forge",
					icon: Hammer
				},
				{
					id: "dictionary",
					label: t("cta.dictionary"),
					icon: Languages
				}
			]
		},
		{
			id: "progress",
			title: "Progress",
			description: "Achievements, mastery, seasons and rankings",
			icon: Trophy,
			items: [
				{
					id: "achievements",
					label: "Achievements",
					icon: Trophy
				},
				{
					id: "progression",
					label: "Mastery & Progression",
					icon: Crown
				},
				{
					id: "seasonProgress",
					label: "Season Progress",
					icon: CalendarRange
				},
				{
					id: "liveOps",
					label: "Events & Challenges",
					icon: CalendarDays
				},
				{
					id: "leaderboard",
					label: t("cta.leaderboard"),
					icon: Trophy
				}
			]
		},
		{
			id: "collection",
			title: "Collection",
			description: "Items, pets and your in-game resources",
			icon: BookOpen,
			items: [
				{
					id: "inventory",
					label: t("cta.inventory"),
					icon: BookOpen
				},
				{
					id: "pets",
					label: "Pets",
					icon: Sparkles
				},
				{
					id: "shop",
					label: "Shop",
					icon: CreditCard
				}
			]
		},
		{
			id: "social",
			title: "Social",
			description: "Connect, compete and play together",
			icon: Users,
			items: [{
				id: "social",
				label: "Friends & Clans",
				icon: Users
			}, {
				id: "multiplayer",
				label: "Online Multiplayer",
				icon: Swords
			}]
		},
		{
			id: "smart",
			title: "Smart",
			description: "Personalized tools and intelligent gameplay",
			icon: BrainCircuit,
			items: [
				{
					id: "coach",
					label: "Smart Coach",
					icon: BrainCircuit
				},
				{
					id: "adaptive",
					label: "Adaptive Challenge",
					icon: Gauge
				},
				{
					id: "journeyPlanner",
					label: "Journey Planner",
					icon: Route
				},
				{
					id: "voice",
					label: "Voice Command Center",
					icon: Mic
				}
			]
		},
		{
			id: "creator",
			title: "Creator",
			description: "Create, test and manage game content",
			icon: PenTool,
			items: [
				{
					id: "creator",
					label: "Creator Studio",
					icon: PenTool
				},
				{
					id: "creatorCommunity",
					label: "Creator Community",
					icon: Users
				},
				{
					id: "aiPuzzleLab",
					label: "AI Puzzle Lab",
					icon: WandSparkles
				},
				{
					id: "puzzleAudit",
					label: "Puzzle QA Lab",
					icon: ShieldCheck
				},
				{
					id: "playablePreview",
					label: "Playable Preview",
					icon: Eye
				},
				{
					id: "creatorPlaytest",
					label: "Creator Playtest",
					icon: Trophy
				}
			]
		},
		{
			id: "release",
			title: "Release",
			description: "Prepare and verify your releases",
			icon: PackageCheck,
			items: [
				{
					id: "publishReadiness",
					label: "Publish Readiness",
					icon: ClipboardCheck
				},
				{
					id: "releasePackage",
					label: "Release Package",
					icon: PackageCheck
				},
				{
					id: "releaseVerifier",
					label: "Release Verifier",
					icon: FileCheck2
				},
				{
					id: "releaseArchive",
					label: "Release Archive",
					icon: Archive
				}
			]
		},
		{
			id: "settings",
			title: "Settings",
			description: "Customize your game experience",
			icon: Wrench,
			items: [
				{
					id: "settings",
					label: t("cta.settings"),
					icon: Wrench
				},
				{
					id: "accessibility",
					label: "Accessibility",
					icon: Accessibility
				},
				{
					id: "content",
					label: "Languages & Content",
					icon: Earth
				},
				{
					id: "pwa",
					label: "Offline & Updates",
					icon: Smartphone
				},
				{
					id: "pushSettings",
					label: "Push Notifications",
					icon: Bell
				}
			]
		},
		{
			id: "account",
			title: "Account",
			description: "Saves, purchases and account data",
			icon: HardDrive,
			items: [{
				id: "saveSlots",
				label: "Save & Recovery",
				icon: HardDrive
			}, {
				id: "payments",
				label: "Purchases & Entitlements",
				icon: CreditCard
			}]
		},
		{
			id: "system",
			title: "System",
			description: "Diagnostics, analytics and administration",
			icon: Activity,
			items: [
				{
					id: "systems",
					label: "Systems & Diagnostics",
					icon: Activity
				},
				{
					id: "analytics",
					label: "Player Analytics",
					icon: ChartLine
				},
				{
					id: "admin",
					label: "Admin Control",
					icon: ShieldCheck
				}
			]
		},
		{
			id: "help",
			title: "Help & Legal",
			description: "Terms, privacy and important information",
			icon: Scale,
			items: [{
				id: "legal",
				label: t("cta.legal"),
				icon: Scale
			}]
		}
	];
	const activeCategory = categories.find((c) => c.id === category);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: t("cta.more"),
		children: !activeCategory ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3",
			children: categories.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setCategory(item.id),
				className: "panel group flex min-h-[128px] flex-col items-start justify-between rounded-2xl p-4 text-left transition-transform active:scale-[0.97]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-11 items-center justify-center rounded-xl bg-surface-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-3 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-bold text-fg",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-[11px] leading-snug text-muted",
							children: item.description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-2 text-xs text-muted",
						children: [item.items.length, " features →"]
					})
				]
			}, item.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "hud-chip flex size-10 items-center justify-center p-0 text-lg text-fg",
				onClick: () => setCategory(null),
				"aria-label": "Back to More categories",
				children: "←"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(activeCategory.icon, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold text-fg",
						children: activeCategory.title
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted",
					children: activeCategory.description
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-2",
			children: activeCategory.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "panel flex items-center gap-3 rounded-2xl p-3.5 text-left transition-transform active:scale-[0.98]",
				onClick: () => go(item.id),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5 text-primary" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "min-w-0 flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-semibold text-fg",
							children: item.label
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg text-muted",
						children: "›"
					})
				]
			}, item.id))
		})] })
	});
}
function StoryScreen() {
	const t = useT();
	const unlocked = useGame((s) => s.save.unlockedLevel);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: t("story.title"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3",
			children: CHAPTERS.map((c) => {
				const open = unlocked >= c.unlock;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "panel rounded-2xl p-4",
					style: { opacity: open ? 1 : .45 },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs uppercase tracking-wider text-gold",
							children: ["Chapter ", c.id + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-1 text-xl text-fg",
							children: c.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: open ? c.body : "The page is still bound."
						})
					]
				}, c.id);
			})
		})
	});
}
function DictionaryScreen() {
	const t = useT();
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("all");
	const wod = WORD_OF_DAY[(/* @__PURE__ */ new Date()).getDate() % WORD_OF_DAY.length];
	const list = (0, import_react.useMemo)(() => {
		const pool = cat === "all" ? ALL_WORDS : CATEGORIES[cat] ?? ALL_WORDS;
		const qq = q.trim().toUpperCase();
		return (qq ? pool.filter((w) => w.includes(qq)) : pool).slice(0, 80);
	}, [q, cat]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: t("cta.dictionary"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mb-4 rounded-2xl p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wider text-gold",
						children: "Word of the day"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl text-fg",
						children: wod.word
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: wod.meaning
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Search the atlas",
				className: "mb-2 w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "hud-chip text-fg",
					onClick: () => setCat("all"),
					children: "all"
				}), CATEGORY_IDS.slice(0, 12).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "hud-chip shrink-0 text-fg",
					onClick: () => setCat(id),
					children: id
				}, id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "columns-2 gap-3 text-sm text-fg",
				children: list.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "mb-1",
					children: [w, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [" ", categoryOf(w)]
					})]
				}, w))
			})
		]
	});
}
function LeaderboardScreen() {
	const t = useT();
	const [board, setBoard] = (0, import_react.useState)("stars");
	const [rows, setRows] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		let live = true;
		(async () => {
			try {
				if (board === "daily") {
					const data = await getDailyBoard({ data: todayKey() });
					if (live) setRows(data.map((r) => ({
						display_name: r.display_name,
						score: r.score
					})));
				} else {
					const data = await getLeaderboard({ data: board });
					if (live) setRows(data);
				}
			} catch {
				if (live) setRows([]);
			}
		})();
		return () => {
			live = false;
		};
	}, [board]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: t("cta.leaderboard"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 flex gap-2",
			children: [
				"stars",
				"words",
				"daily"
			].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "hud-chip capitalize text-fg",
				onClick: () => setBoard(b),
				children: b
			}, b))
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "The hall is still quiet. Sign in after a clear to leave a mark."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex flex-col gap-2",
			children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "panel flex items-center justify-between rounded-xl p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-fg",
					children: [
						i + 1,
						". ",
						r.display_name
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-gold",
					children: r.score
				})]
			}, `${r.display_name}-${i}`))
		})]
	});
}
function LegalScreen() {
	const t = useT();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: t("cta.legal"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "prose-like space-y-4 text-sm leading-relaxed text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-fg",
					children: "Terms of travel"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Mera Word Search Journey is a free, ad-free atlas. An account is required to enter the game and enables cloud save and account-based game features. You may manage or delete your account through the available account tools." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl text-fg",
					children: "Quiet ledger (privacy)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Offline play stays on this device. If you sign in, we store your save blob, display name, and leaderboard scores, scoped to your account. We do not sell data. Optional AI riddles are user-initiated and sent without your full save. Account deletion is available through your signed-in profile tools." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No ads. Your account data is used to provide the game's account-based features." })
			]
		})
	});
}
function CombatScreen() {
	const combat = useGame((s) => s.combat);
	const action = useGame((s) => s.combatAction);
	const clear = useGame((s) => s.clearCombat);
	if (!combat) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Boss Battle",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "panel rounded-2xl p-5 text-muted",
			children: "No active guardian. Clear a boss level first."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn-primary mt-4",
			onClick: () => {
				let n = useGame.getState().save.unlockedLevel;
				while (n > 1 && !isJourneyBoss(n)) n--;
				useGame.getState().startBossCombat(n);
			},
			children: "Challenge the nearest guardian"
		})]
	});
	const enemy = combat.enemy;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: enemy.name,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel rounded-2xl p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between font-semibold text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: enemy.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums",
						children: [
							"Phase ",
							enemy.phase,
							" · Turn ",
							combat.turn
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 text-xs uppercase tracking-[0.16em] text-gold",
					children: enemy.phase === 1 ? "Awakened" : enemy.phase === 2 ? "Enraged" : "Final Stand"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 text-sm text-muted",
					children: [
						"Boss HP ",
						enemy.hp,
						" / ",
						enemy.maxHp
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-3 overflow-hidden rounded-full bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-danger",
						style: { width: `${Math.max(0, enemy.hp / enemy.maxHp * 100)}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 text-sm text-muted",
					children: [
						"Your HP ",
						combat.playerHp,
						" / ",
						combat.maxPlayerHp
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 h-3 overflow-hidden rounded-full bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full bg-success",
						style: { width: `${Math.max(0, combat.playerHp / combat.maxPlayerHp * 100)}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-xl bg-surface-2/60 p-3 text-sm text-muted",
					children: combat.lastEvent
				}),
				combat.victory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 font-semibold text-success",
					children: [
						"Victory! +",
						enemy.reward,
						" coins"
					]
				}),
				combat.defeated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 font-semibold text-danger",
					children: "Defeated. Try again."
				}),
				!combat.victory && !combat.defeated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "hud-chip text-fg",
							onClick: () => action("word", true),
							children: "Word"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "hud-chip text-fg",
							onClick: () => action("power"),
							children: "Power"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "hud-chip text-fg",
							onClick: () => action("guard"),
							children: "Guard"
						})
					]
				}),
				(combat.victory || combat.defeated) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-primary mt-4",
					onClick: clear,
					children: "Return"
				})
			]
		})
	});
}
var STORY_CHAPTERS = JOURNEY_WORLDS.map((w) => ({
	id: `ch${w.world}`,
	world: w.world,
	title: w.name,
	summary: w.story,
	npc: w.hero,
	levels: [w.from, w.to],
	reward: w.chestCoins,
	boss: w.boss,
	bossTitle: w.bossTitle
}));
function worldNodes(maxUnlocked) {
	return STORY_CHAPTERS.flatMap((c) => {
		const span = c.levels[1] - c.levels[0];
		const step = Math.max(1, Math.floor(span / 4));
		return [
			c.levels[0],
			c.levels[0] + step,
			c.levels[0] + step * 2,
			c.levels[0] + step * 3,
			c.levels[1]
		].map((level, i) => ({
			id: `${c.id}-${i}`,
			world: c.world,
			level,
			title: i === 4 ? "Boss Gate" : `Stage ${i + 1}`,
			chapter: c.id,
			unlocked: level <= maxUnlocked,
			boss: i === 4
		}));
	});
}
function WorldMapScreen() {
	const save = useGame((s) => s.save);
	const maxUnlocked = Math.max(1, save.unlockedLevel ?? 1);
	const nodes = worldNodes(maxUnlocked);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Journey Map",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-4 rounded-3xl panel p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.22em] text-accent",
						children: "The Great Word Journey"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl text-fg",
						children: "6 worlds. One complete adventure."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Explore each realm, defeat its guardian, then open its completion chest."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-1 size-7 text-gold" })]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative grid gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute left-7 top-7 bottom-7 w-px bg-white/10" }), JOURNEY_WORLDS.map((w) => {
				const progress = journeyWorldProgress(save, w);
				const restoration = worldRestoration(save, w);
				const unlocked = maxUnlocked >= w.from;
				const defeated = Boolean(save.results[String(w.to)]);
				const opened = chestClaimed(save, w.world);
				const ns = nodes.filter((n) => n.chapter === `ch${w.world}`);
				const bossUnlocked = maxUnlocked >= w.to;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: `relative rounded-3xl panel p-4 ${!unlocked ? "opacity-55" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 font-display text-xl text-gold",
								children: defeated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-6" }) : w.world
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs uppercase tracking-[0.18em] text-accent",
												children: ["World ", w.world]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-xl text-fg",
												children: w.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted",
												children: w.subtitle
											})
										] }), !unlocked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-5 text-muted" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3 h-2 overflow-hidden rounded-full bg-white/10",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-primary transition-all",
											style: { width: `${progress}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex justify-between text-[11px] text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											progress,
											"% explored · ",
											restoration.stage
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"Lv ",
											w.from,
											"–",
											w.to
										] })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed text-muted",
							children: w.story
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: w.mechanics.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hud-chip text-[10px] text-fg",
								children: m
							}, m))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid grid-cols-5 gap-1.5",
							children: ns.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: !n.unlocked,
								onClick: () => n.unlocked && useGame.getState().startLevel(n.level),
								className: `relative aspect-square rounded-xl p-1 text-center text-xs ${n.unlocked ? "panel text-fg" : "bg-white/5 text-muted"}`,
								children: [n.unlocked ? n.boss ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "mx-auto size-4 text-gold" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold",
									children: n.level
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mx-auto size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[9px] text-muted",
									children: n.title
								})]
							}, n.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-2xl border border-white/10 bg-black/15 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-4 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-[0.16em] text-gold",
										children: "Boss Gate"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-fg",
										children: w.boss
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted",
									children: [
										w.bossTitle,
										" · Level ",
										w.to
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: !bossUnlocked,
									onClick: () => useGame.getState().startLevel(w.to, "boss"),
									className: "mt-3 w-full rounded-xl btn-primary disabled:opacity-40",
									children: bossUnlocked ? "Challenge Boss" : `Reach Level ${w.to}`
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between rounded-2xl border border-white/10 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-fg",
									children: "World Completion Chest"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										"+",
										w.chestCoins,
										" coins · +",
										w.chestDiamonds,
										" diamonds"
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: !defeated || opened,
								onClick: () => useGame.getState().claimWorldChest(w.world),
								className: "rounded-xl px-3 py-2 text-xs font-bold btn-primary disabled:opacity-40",
								children: opened ? "Opened" : defeated ? "Open" : "Locked"
							})]
						})
					]
				}, w.id);
			})]
		})]
	});
}
var STORY_QUESTS = [
	{
		id: "q-levels-5",
		title: "First Steps",
		description: "Complete 5 levels.",
		target: 5,
		metric: "levels",
		reward: 100
	},
	{
		id: "q-words-50",
		title: "Word Collector",
		description: "Find 50 words.",
		target: 50,
		metric: "words",
		reward: 150
	},
	{
		id: "q-boss-1",
		title: "Guardian Breaker",
		description: "Defeat 1 guardian.",
		target: 1,
		metric: "bosses",
		reward: 250
	},
	{
		id: "q-levels-25",
		title: "Journeyer",
		description: "Complete 25 levels.",
		target: 25,
		metric: "levels",
		reward: 500
	}
];
function StoryQuestScreen() {
	const stats = useGame((s) => s.save).stats;
	const levels = stats.levelsCompleted ?? 0, words = stats.wordsFound ?? 0, bosses = stats.bossesDefeated ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Story Quests",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: STORY_QUESTS.map((q) => {
				const value = q.metric === "levels" ? levels : q.metric === "words" ? words : bosses;
				const pct = Math.min(100, value / q.target * 100);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel rounded-2xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "text-fg",
								children: q.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-accent",
								children: [
									"+",
									q.reward,
									"c"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: q.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 h-2 rounded-full bg-black/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-accent",
								style: { width: `${pct}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								Math.min(value, q.target),
								" / ",
								q.target
							]
						})
					]
				}, q.id);
			})
		})
	});
}
function DialogueScreen() {
	const dialogue = useGame((s) => s.dialogue);
	const choose = useGame((s) => s.chooseDialogue);
	const close = useGame((s) => s.closeDialogue);
	if (!dialogue) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "NPCs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "panel rounded-2xl p-5 text-muted",
			children: "No conversation active."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Conversation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel rounded-2xl p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-accent",
					children: dialogue.speaker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-lg font-semibold text-fg",
					children: dialogue.text
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid gap-2",
					children: dialogue.choices.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "hud-chip text-left",
						onClick: () => choose(c.id),
						children: [c.text, c.reward ? `  (+${c.reward}c)` : ``]
					}, c.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "mt-4 text-xs text-muted",
					onClick: close,
					children: "Close"
				})
			]
		})
	});
}
function NPCScreen() {
	const open = useGame((s) => s.openDialogue);
	const affinity = useGame((s) => s.npcAffinity);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "NPCs",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: STORY_CHAPTERS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "panel rounded-2xl p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-fg",
						children: c.npc
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							"World ",
							c.world,
							" · Affinity ",
							affinity[c.npc] ?? 0
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "hud-chip",
						onClick: () => open(c.world),
						children: "Talk"
					})]
				})
			}, c.id))
		})
	});
}
function MissionsScreen() {
	const save = useGame((s) => s.save);
	const claim = useGame((s) => s.claimMission);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Missions",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: MISSIONS.map((m) => {
				const k = m.metric === "levels" ? "levelsCompleted" : m.metric === "words" ? "wordsFound" : "coinsEarned";
				const v = Math.min(Number(save.stats[k] ?? 0), m.target);
				const ck = `${m.id}:${periodKey(m.period)}`;
				const done = v >= m.target;
				const c = save.claimedMissions.includes(ck);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel rounded-2xl p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-fg",
							children: m.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: m.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								v,
								"/",
								m.target,
								" · +",
								m.reward,
								"c"
							]
						}),
						done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "hud-chip mt-2 text-fg",
							disabled: c,
							onClick: () => claim(m.id),
							children: c ? "Claimed" : "Claim reward"
						})
					]
				}, m.id);
			})
		})
	});
}
function V9Status() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "V9Status"
		})
	});
}
function SocialScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "SocialScreen"
		})
	});
}
function installLiveOpsBridge() {
	return () => {};
}
function SystemsScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "SystemsScreen"
		})
	});
}
var BOT_WAIT_MS = 1e4;
function MultiplayerScreen({ onBack }) {
	const user = useCurrentUser();
	const [room, setRoom] = (0, import_react.useState)(null);
	const [roomCode, setRoomCode] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)(user?.displayName || "Traveler");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const [log, setLog] = (0, import_react.useState)([]);
	const [notice, setNotice] = (0, import_react.useState)("");
	const [opponentKind, setOpponentKind] = (0, import_react.useState)(null);
	const startedRoomRef = (0, import_react.useRef)(null);
	const botTimerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (user?.displayName) setName(user.displayName);
	}, [user?.displayName]);
	const clearBotTimer = () => {
		if (botTimerRef.current != null) {
			window.clearTimeout(botTimerRef.current);
			botTimerRef.current = null;
		}
	};
	const startMatch = (kind, roomId) => {
		const key = kind === "bot" ? "practice-bot" : roomId || "";
		if (startedRoomRef.current === key) return;
		startedRoomRef.current = key;
		if (kind === "human" && roomId) {
			sessionStorage.setItem("mwsj.multiplayer.room", roomId);
			sessionStorage.removeItem("mwsj.multiplayer.bot");
		} else {
			sessionStorage.removeItem("mwsj.multiplayer.room");
			sessionStorage.setItem("mwsj.multiplayer.bot", "1");
		}
		useGame.getState().startLevel(1, "classic");
	};
	const launchBotFallback = () => {
		clearBotTimer();
		setOpponentKind("bot");
		setNotice("No second player joined. Practice Bot is entering the same race.");
		startMatch("bot");
	};
	(0, import_react.useEffect)(() => {
		if (!room) return;
		const poll = async () => {
			try {
				const result = await getMultiplayerRoom({ data: { roomId: room.roomId } });
				if (result.ok && result.room) {
					const next = result.room;
					setRoom(next);
					const msgs = Array.isArray(next.state?.messages) ? next.state.messages : [];
					setLog(msgs);
					if (next.members.length >= 2) {
						clearBotTimer();
						setOpponentKind("human");
						setNotice("Opponent found. Starting the live race…");
						startMatch("human", next.roomId);
						return;
					}
					if (opponentKind !== "bot") {
						setOpponentKind("waiting");
						setNotice("Waiting for another player…");
					}
				}
				await heartbeatMultiplayerRoom({ data: { roomId: room.roomId } });
			} catch {}
		};
		poll();
		const timer = window.setInterval(poll, 2e3);
		return () => window.clearInterval(timer);
	}, [room?.roomId]);
	(0, import_react.useEffect)(() => () => clearBotTimer(), []);
	async function quick() {
		clearBotTimer();
		startedRoomRef.current = null;
		setLoading(true);
		setNotice("");
		try {
			const r = await quickMatchMultiplayer();
			if (r.kind === "human" && r.room) {
				setOpponentKind("human");
				setRoom(r.room);
				setNotice("Opponent found. Starting the live race…");
				startMatch("human", r.room.roomId);
				return;
			}
			if (r.room) {
				const waitingRoom = r.room;
				setRoom(waitingRoom);
				setOpponentKind("waiting");
				setNotice("Room created. Searching for a player for 10 seconds…");
				botTimerRef.current = window.setTimeout(() => {
					launchBotFallback();
				}, BOT_WAIT_MS);
			}
		} catch (e) {
			setNotice(e instanceof Error ? e.message : "Could not find an opponent.");
		} finally {
			setLoading(false);
		}
	}
	async function create() {
		clearBotTimer();
		startedRoomRef.current = null;
		setLoading(true);
		setNotice("");
		try {
			const r = await createMultiplayerRoom({ data: {
				displayName: name,
				mode: "classic",
				maxPlayers: 2
			} });
			if (r.ok) {
				setRoom(r.room);
				setOpponentKind("waiting");
				setNotice("Room created. Share the room code with another signed-in player.");
			} else setNotice(r.error);
		} catch (e) {
			setNotice(e instanceof Error ? e.message : "Could not create room.");
		} finally {
			setLoading(false);
		}
	}
	async function join() {
		clearBotTimer();
		startedRoomRef.current = null;
		setLoading(true);
		setNotice("");
		try {
			const r = await joinMultiplayerRoom({ data: {
				roomId: roomCode.trim(),
				displayName: name
			} });
			if (r.ok) {
				const next = r.room;
				setRoom(next);
				setOpponentKind("human");
				setNotice("Opponent found. Starting the live race…");
				startMatch("human", next.roomId);
			} else setNotice(r.error);
		} catch (e) {
			setNotice(e instanceof Error ? e.message : "Could not join room.");
		} finally {
			setLoading(false);
		}
	}
	async function send() {
		if (!room || !message.trim()) return;
		try {
			if ((await sendMultiplayerRoomMessage({ data: {
				roomId: room.roomId,
				message
			} })).ok) setMessage("");
		} catch {}
	}
	const leave = () => {
		clearBotTimer();
		startedRoomRef.current = null;
		sessionStorage.removeItem("mwsj.multiplayer.room");
		sessionStorage.removeItem("mwsj.multiplayer.bot");
		setRoom(null);
		setOpponentKind(null);
		setNotice("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Online Multiplayer",
		onBack,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-3xl flex-col gap-4 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel rounded-3xl p-4 sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/15",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "size-6 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-fg sm:text-xl",
									children: "Live Word Search Match"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm leading-5 text-muted",
									children: "Both players get the same puzzle and race to find the words first. If no human joins, a clearly identified Practice Bot takes the second slot."
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void quick(),
							disabled: loading,
							className: "btn-primary mt-4 flex w-full items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wifi, { className: "size-4" }), loading ? "Finding opponent…" : "Quick Match"]
						}),
						notice && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 rounded-2xl bg-surface-2 p-3 text-sm text-muted",
							children: notice
						}),
						opponentKind === "waiting" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 shrink-0 place-items-center rounded-xl bg-surface",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-fg",
									children: "Finding Player 2"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "The match will start automatically when a human joins."
								})]
							})]
						}),
						opponentKind === "bot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 shrink-0 place-items-center rounded-xl bg-surface",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "size-5 text-gold" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-fg",
									children: "Practice Bot ready"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "The bot races on the same board and its score updates during the round."
								})]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel rounded-3xl p-4 sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-fg",
								children: "Private room"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Create a room and give its code to another signed-in player."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid gap-2 sm:grid-cols-[1fr_auto]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "min-w-0 rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg",
								placeholder: "Your display name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void create(),
								disabled: loading,
								className: "hud-chip min-h-11 justify-center text-fg",
								children: "Create"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 grid gap-2 sm:grid-cols-[1fr_auto]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: roomCode,
								onChange: (e) => setRoomCode(e.target.value),
								className: "min-w-0 rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg",
								placeholder: "Paste room ID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void join(),
								disabled: loading,
								className: "hud-chip min-h-11 justify-center text-fg",
								children: "Join"
							})]
						})
					]
				}),
				room && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel rounded-3xl p-4 sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-wider text-muted",
									children: "Room"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "break-all font-mono text-xs text-fg sm:text-sm",
									children: room.roomId
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hud-chip text-fg",
								children: opponentKind === "human" ? "PLAYER 2 CONNECTED" : opponentKind === "waiting" ? "WAITING" : opponentKind === "bot" ? "PRACTICE BOT" : room.members.length > 1 ? "ONLINE" : "WAITING"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-2 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-primary/20 bg-primary/5 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-wider text-muted",
										children: "Player 1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 truncate font-semibold text-fg",
										children: room.members[0]?.displayName || name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "Ready"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-surface-2 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase tracking-wider text-muted",
										children: "Player 2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 truncate font-semibold text-fg",
										children: room.members[1]?.displayName || (opponentKind === "bot" ? "Practice Bot" : "Waiting…")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: opponentKind === "bot" ? "Bot is ready" : room.members[1] ? "Connected" : "Searching"
									})
								]
							})]
						}),
						opponentKind === "human" && room.members.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-2xl bg-surface-2 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-fg",
										children: "Match chat"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "max-h-40 space-y-2 overflow-y-auto",
									children: log.length ? log.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-fg",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted",
												children: [
													"@",
													x.userId === user?.id ? "you" : "opponent",
													":"
												]
											}),
											" ",
											x.message
										]
									}, x.createdAt + x.userId + x.message)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: "No comments yet."
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: message,
										onChange: (e) => setMessage(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") send();
										},
										maxLength: 160,
										className: "min-w-0 flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-fg",
										placeholder: "Write a comment…"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => void send(),
										className: "hud-chip text-fg",
										children: "Send"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-2 sm:flex-row",
							children: [
								opponentKind === "human" && room.members.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => startMatch("human", room.roomId),
									className: "btn-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swords, { className: "mr-2 size-4" }), " Start Match"]
								}),
								opponentKind === "bot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => startMatch("bot"),
									className: "btn-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "mr-2 size-4" }), " Start Practice Match"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: leave,
									className: "hud-chip min-h-12 justify-center text-fg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 size-4" }), " Leave"]
								})
							]
						})
					]
				})
			]
		})
	});
}
var getAdminDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("36a0d6f1c97d92068a5f4a7080d0ecfcee4f0333332d0828686298ef670d6062"));
var trackPlayerActivity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	eventType: String(d.eventType ?? "heartbeat").slice(0, 40),
	screen: String(d.screen ?? "").slice(0, 80),
	durationSeconds: Math.max(0, Math.min(60, Math.floor(Number(d.durationSeconds ?? 0))))
})).handler(createSsrRpc("84d65c1a78229829dd712d3429aa16a1b8a1de59327c6e6aae987486f7469c10"));
function duration(total) {
	const seconds = Math.max(0, Number(total) || 0);
	const h = Math.floor(seconds / 3600);
	const m = Math.floor(seconds % 3600 / 60);
	const s = seconds % 60;
	return h ? `${h}h ${m}m` : m ? `${m}m ${s}s` : `${s}s`;
}
function when(value) {
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleString();
}
function AdminScreen({ onBack }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	async function load() {
		setLoading(true);
		setError("");
		try {
			setData(await getAdminDashboard());
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not load admin dashboard.");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Admin Control",
		onBack,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-6xl space-y-4 pb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "panel rounded-2xl p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 place-items-center rounded-xl bg-primary/15",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-6 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold text-fg",
								children: "Administrator Dashboard"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Player identity, presence, play time and recent activity."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void load(),
							className: "hud-chip flex items-center gap-2 text-fg",
							disabled: loading,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), " Refresh"]
						})]
					})
				}),
				loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "panel rounded-2xl p-5 text-sm text-muted",
					children: "Loading dashboard…"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "panel rounded-2xl p-5 text-sm text-danger",
					children: error
				}),
				data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {}),
								label: "Players",
								value: Number(data.summary.users) || 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {}),
								label: "Active now",
								value: Number(data.summary.active_now) || 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, {}),
								label: "Activity events",
								value: Number(data.summary.activities) || 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, {}),
								label: "Last 24h events",
								value: Number(data.summary.recent_activities) || 0
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "panel overflow-hidden rounded-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-fg",
								children: "Players"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Automatic player number, account identity and total tracked play time."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[900px] text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-surface-2 text-xs text-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "#"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Username"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Email"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Play time"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Current"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Last seen"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.players.map((p) => {
									const online = Date.now() - new Date(p.last_seen_at).getTime() < 12e4;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 font-bold text-primary",
												children: p.player_number
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-fg",
												children: p.name || "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-3 py-3 text-fg",
												children: ["@", p.username || "—"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-muted",
												children: p.email
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 font-semibold text-fg",
												children: duration(Number(p.total_play_seconds))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3",
												children: online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-emerald-400",
													children: "● Playing"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted",
													children: p.current_screen || "Offline"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-3 py-3 text-xs text-muted",
												children: when(p.last_seen_at)
											})
										]
									}, p.user_id);
								}) })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "panel overflow-hidden rounded-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-fg",
								children: "Recent Player Activity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Latest heartbeat and navigation events from signed-in players."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-[360px] overflow-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[850px] text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "sticky top-0 bg-surface-2 text-xs text-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Player"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Email"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Event"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Screen"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Time"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-3",
											children: "Duration"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.activity.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-3 text-fg",
											children: [
												"#",
												a.player_number,
												" ",
												a.name,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted",
													children: ["@", a.username]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3 text-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-3" }), a.email]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3 text-fg",
											children: a.event_type
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3 text-muted",
											children: a.screen || "—"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3 text-xs text-muted",
											children: when(a.occurred_at)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-3 text-fg",
											children: duration(Number(a.duration_seconds))
										})
									]
								}, a.id)) })]
							})
						})]
					})
				] })
			]
		})
	});
}
function Metric({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel rounded-2xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 size-5 text-primary",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-2xl font-bold text-fg",
				children: value
			})
		]
	});
}
function PaymentsScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "PaymentsScreen"
		})
	});
}
function ContentLanguagesScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "ContentLanguagesScreen"
		})
	});
}
function V14LiveOpsScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "V14 LiveOps Screen"
		})
	});
}
function SaveSlotsScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "SaveSlotsScreen"
		})
	});
}
function installV14LiveOpsBridge() {
	return () => {};
}
function CreatorScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "CreatorScreen"
		})
	});
}
function CreatorCommunityScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "CreatorCommunityScreen"
		})
	});
}
function ProgressionHubScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "ProgressionHubScreen"
		})
	});
}
function SeasonProgressScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "SeasonProgressScreen"
		})
	});
}
function AnalyticsScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "AnalyticsScreen"
		})
	});
}
function AccessibilityScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "AccessibilityScreen"
		})
	});
}
function PwaScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "PwaScreen"
		})
	});
}
function PushSettingsScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "PushSettingsScreen"
		})
	});
}
function registerPwa(_onUpdate) {
	return () => {};
}
function VoiceCommandScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "VoiceCommandScreen"
		})
	});
}
function AIPuzzleLabScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "AIPuzzleLabScreen"
		})
	});
}
function PuzzleAuditScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "PuzzleAuditScreen"
		})
	});
}
function PlayablePreviewScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "PlayablePreviewScreen"
		})
	});
}
function CreatorPlaytestScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "CreatorPlaytestScreen"
		})
	});
}
function ReleasePackageScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "ReleasePackageScreen"
		})
	});
}
function ReleaseVerifierScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "ReleaseVerifierScreen"
		})
	});
}
function ReleaseArchiveScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "ReleaseArchiveScreen"
		})
	});
}
function PublishReadinessScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-lg font-bold",
			children: "PublishReadinessScreen"
		})
	});
}
function GameApp() {
	const ready = useGame((s) => s.ready);
	const screen = useGame((s) => s.screen);
	const save = useGame((s) => s.save);
	const toast = useGame((s) => s.toast);
	const user = useCurrentUser();
	(0, import_react.useEffect)(() => {
		if (!ready || !user?.displayName) return;
		if (useGame.getState().save.playerName === "Traveler") useGame.getState().setName(user.displayName.slice(0, 24));
	}, [ready, user?.displayName]);
	(0, import_react.useEffect)(() => {
		useGame.getState().hydrate();
		const offV10 = installLiveOpsBridge();
		const offV14 = installV14LiveOpsBridge();
		const offPwa = registerPwa(() => {
			const id = Date.now();
			useGame.setState({ toast: {
				id,
				text: "A new app update is ready."
			} });
		});
		return () => {
			offV10();
			offV14();
			offPwa();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			const cur = useGame.getState().save;
			const next = refillEnergy(cur);
			if (next.energy !== cur.energy || next.energyAt !== cur.energyAt) {
				writeSave(next);
				useGame.setState({ save: next });
			}
		}, 15e3);
		const onHide = () => {
			if (document.visibilityState === "hidden") useGame.getState().persist();
		};
		document.addEventListener("visibilitychange", onHide);
		window.addEventListener("pagehide", () => useGame.getState().persist());
		return () => {
			clearInterval(id);
			document.removeEventListener("visibilitychange", onHide);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		const root = document.documentElement;
		root.dataset.theme = save.equippedTheme;
		root.dataset.contrast = save.settings.highContrast ? "high" : "";
		root.dataset.large = save.settings.largeText ? "1" : "";
		root.dir = isRtl(save.language, save.settings.rtlForce) ? "rtl" : "ltr";
		root.lang = save.language.startsWith("ur") ? "ur" : save.language;
		root.classList.toggle("no-scroll", true);
		root.dataset.dyslexia = save.settings.dyslexiaFriendly ? "1" : "";
		root.dataset.focus = save.settings.focusMode ? "1" : "";
		applyVolumes({
			master: save.settings.masterVol,
			sfx: save.settings.sfxVol,
			music: save.settings.musicVol,
			sfxOn: save.settings.sfx,
			musicOn: save.settings.music
		});
	}, [
		ready,
		save.equippedTheme,
		save.settings,
		save.language
	]);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		const activateAudio = () => {
			unlockAudio();
			if (useGame.getState().save.settings.music) startMusic();
		};
		window.addEventListener("pointerdown", activateAudio);
		window.addEventListener("touchstart", activateAudio, { passive: true });
		window.addEventListener("keydown", activateAudio);
		return () => {
			window.removeEventListener("pointerdown", activateAudio);
			window.removeEventListener("touchstart", activateAudio);
			window.removeEventListener("keydown", activateAudio);
		};
	}, [ready]);
	(0, import_react.useEffect)(() => {
		if (!ready || !user?.id) return;
		let last = Date.now();
		let active = document.visibilityState === "visible";
		const send = (eventType, force = false) => {
			const now = Date.now();
			const seconds = active ? Math.floor((now - last) / 1e3) : 0;
			if (!force && seconds <= 0) return;
			last = now;
			trackPlayerActivity({ data: {
				eventType,
				screen: useGame.getState().screen,
				durationSeconds: Math.min(60, Math.max(0, seconds))
			} }).catch(() => void 0);
		};
		const timer = window.setInterval(() => {
			if (document.visibilityState === "visible") {
				active = true;
				send("heartbeat");
			}
		}, 3e4);
		const onVisibility = () => {
			if (document.visibilityState === "hidden") {
				send("pause", true);
				active = false;
			} else {
				active = true;
				last = Date.now();
				send("resume", true);
			}
		};
		document.addEventListener("visibilitychange", onVisibility);
		send("session_start", true);
		return () => {
			window.clearInterval(timer);
			document.removeEventListener("visibilitychange", onVisibility);
			send("session_end", true);
		};
	}, [ready, user?.id]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JourneyLoading, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(V9Status, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenView, { screen }),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-8 z-30 flex justify-center px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "panel animate-pop rounded-full px-4 py-2 text-sm font-semibold text-fg",
					children: toast.text
				})
			})
		]
	});
}
function ScreenView({ screen }) {
	switch (screen) {
		case "splash": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SplashScreen, {});
		case "home": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeScreen, {});
		case "worlds": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldsScreen, {});
		case "modes": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModesScreen, {});
		case "play": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayScreen, {});
		case "shop": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopScreen, {});
		case "pets": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PetsScreen, {});
		case "profile": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileScreen, {});
		case "settings": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsScreen, {});
		case "achievements": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AchievementsScreen, {});
		case "stats": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatsScreen, {});
		case "daily": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyScreen, {});
		case "spin": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpinScreen, {});
		case "story": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryScreen, {});
		case "dictionary": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DictionaryScreen, {});
		case "leaderboard": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaderboardScreen, {});
		case "inventory": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryScreen, {});
		case "skills": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillsScreen, {});
		case "base": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BaseScreen, {});
		case "equipment": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EquipmentScreen, {});
		case "combat": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CombatScreen, {});
		case "worldMap": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorldMapScreen, {});
		case "storyQuests": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoryQuestScreen, {});
		case "dialogue": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogueScreen, {});
		case "npcs": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NPCScreen, {});
		case "missions": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MissionsScreen, {});
		case "legal": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LegalScreen, {});
		case "social": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialScreen, {});
		case "liveOps": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(V14LiveOpsScreen, {});
		case "systems": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SystemsScreen, {});
		case "multiplayer": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MultiplayerScreen, { onBack: () => useGame.getState().setScreen("more") });
		case "admin": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminScreen, { onBack: () => useGame.getState().setScreen("more") });
		case "payments": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentsScreen, {});
		case "content": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentLanguagesScreen, {});
		case "saveSlots": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveSlotsScreen, {});
		case "creator": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreatorScreen, {});
		case "progression": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressionHubScreen, {});
		case "seasonProgress": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeasonProgressScreen, {});
		case "analytics": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsScreen, {});
		case "accessibility": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessibilityScreen, {});
		case "pwa": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaScreen, {});
		case "pushSettings": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PushSettingsScreen, {});
		case "coach": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoachScreen, {});
		case "adaptive": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdaptiveScreen, {});
		case "journeyPlanner": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JourneyPlannerScreen, {});
		case "voice": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceCommandScreen, {});
		case "aiPuzzleLab": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIPuzzleLabScreen, {});
		case "puzzleAudit": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuzzleAuditScreen, {});
		case "playablePreview": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayablePreviewScreen, {});
		case "creatorPlaytest": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreatorPlaytestScreen, {});
		case "publishReadiness": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublishReadinessScreen, {});
		case "releasePackage": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReleasePackageScreen, {});
		case "releaseVerifier": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReleaseVerifierScreen, {});
		case "releaseArchive": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReleaseArchiveScreen, {});
		case "creatorCommunity": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreatorCommunityScreen, {});
		case "more": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreScreen, {});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeScreen, {});
	}
}
var GameErrorBoundary = class extends import_react.Component {
	state = {
		hasError: false,
		message: ""
	};
	static getDerivedStateFromError(error) {
		return {
			hasError: true,
			message: error instanceof Error ? error.message : "Unknown application error"
		};
	}
	componentDidCatch(error, info) {
		console.error("[Mera Word Search Journey] UI error:", error, info);
	}
	reload = () => {
		window.location.reload();
	};
	render() {
		if (!this.state.hasError) return this.props.children;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "app-shell safe-pad grid min-h-dvh place-items-center p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel w-full max-w-md rounded-3xl p-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl text-fg",
						children: "Mera Word Search Journey"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Something unexpected happened. Reload to keep your local progress."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "mt-4 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer text-xs font-semibold text-muted",
							children: "Technical details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "mt-2 max-h-32 overflow-auto whitespace-pre-wrap text-xs text-muted",
							children: this.state.message
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: this.reload,
						className: "mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white",
						children: "Reload Game"
					})
				]
			})
		});
	}
};
var getLegalConsent = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("bcb3b19a5ce3f7092bc601d9b984b5fa0a76caca6f180c71090d11f5b8db9374"));
var acceptLegalConsent = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("1ae3331b7df850b3f79f6b320c0aa1febb8cfb6587b7ca7a38135e0b6f2be03d"));
function AgreementGate({ children }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [accepted, setAccepted] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let alive = true;
		getLegalConsent().then((result) => {
			if (!alive) return;
			setAccepted(result.accepted);
		}).catch((err) => {
			if (!alive) return;
			setError(err instanceof Error ? err.message : "Could not load agreement");
		}).finally(() => {
			if (alive) setLoading(false);
		});
		return () => {
			alive = false;
		};
	}, []);
	async function accept() {
		setBusy(true);
		setError("");
		try {
			await acceptLegalConsent();
			setAccepted(true);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not save agreement");
		} finally {
			setBusy(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "app-shell starfield safe-pad grid min-h-dvh place-items-center p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Checking agreement…"
		})
	});
	if (accepted) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "app-shell starfield safe-pad grid min-h-dvh place-items-center p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "panel w-full max-w-lg rounded-3xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.2em] text-accent",
					children: "Before you begin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-2xl text-fg",
					children: "Terms & Privacy Agreement"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-4 text-sm leading-relaxed text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "By continuing, you agree to the Terms of Travel and acknowledge the Privacy Notice for Mera Word Search Journey." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your account may be used to store your game progress, display name, leaderboard results, and other features associated with your account." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You can review the full legal information later from More → Help & Legal." })
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-danger",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-primary mt-6 w-full",
					onClick: () => void accept(),
					disabled: busy,
					children: busy ? "Saving…" : "I Agree & Continue"
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameErrorBoundary, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInGate, {
		fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgreementGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameApp, {}) })
	}) });
}
//#endregion
export { Home as component };
