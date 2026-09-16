//#region node_modules/.nitro/vite/services/ssr/assets/seasonRules-DJspMrVl.js
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
var REWARDS = [
	50,
	75,
	100,
	150,
	200,
	300,
	400,
	500,
	750,
	1e3
];
function seasonKey(now = /* @__PURE__ */ new Date()) {
	return `${now.getUTCFullYear()}-S${Math.floor(now.getUTCMonth() / 3) + 1}`;
}
function seasonPoints(save) {
	return save.stats.levelsCompleted * 10 + save.stats.wordsFound * 2 + save.stats.perfectClears * 15 + save.stats.bossesDefeated * 30;
}
//#endregion
export { periodKey as a, unlockedAchievements as c, achievementProgress as i, MISSIONS as n, seasonKey as o, REWARDS as r, seasonPoints as s, ACHIEVEMENTS as t };
