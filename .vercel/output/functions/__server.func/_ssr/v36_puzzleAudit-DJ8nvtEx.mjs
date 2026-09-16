import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/v36_puzzleAudit-DJ8nvtEx.js
var cleanWords = (input) => {
	if (!Array.isArray(input)) return [];
	return [...new Set(input.map((v) => String(v).trim().toUpperCase()).filter((v) => /^[A-Z]{3,14}$/.test(v)))].slice(0, 20);
};
function auditPuzzleWordsLocal(words) {
	const issues = [];
	const suggestions = [];
	if (words.length < 3) issues.push("Add at least 3 valid words.");
	const short = words.filter((w) => w.length <= 3);
	const long = words.filter((w) => w.length >= 10);
	const uniqueLengths = new Set(words.map((w) => w.length)).size;
	const vowelSparse = words.filter((w) => !/[AEIOU]/.test(w));
	if (short.length > Math.ceil(words.length * .5)) issues.push("The set is dominated by very short words.");
	if (uniqueLengths < 2 && words.length >= 5) issues.push("Word lengths lack variety.");
	if (vowelSparse.length > 0) suggestions.push("Consider replacing vowel-sparse words with more recognizable vocabulary.");
	if (long.length === 0 && words.length >= 6) suggestions.push("Add one or two longer words for challenge variety.");
	if (words.length >= 8 && uniqueLengths >= 3) suggestions.push("Length distribution looks suitable for a mixed-difficulty puzzle.");
	if (!issues.length) suggestions.push("No structural issues detected. Generate a puzzle and run gameplay QA next.");
	const balance = Math.min(100, Math.max(0, 55 + words.length * 4 + uniqueLengths * 7 - short.length * 5 - issues.length * 10));
	return {
		score: Math.round(balance),
		words,
		issues,
		suggestions,
		source: "local"
	};
}
var auditPuzzleWords_createServerFn_handler = createServerRpc({
	id: "e9e6ac6cc851f2f412a9132465e703eec6b80defe607249b8d462594edb381a7",
	name: "auditPuzzleWords",
	filename: "src/lib/v36_puzzleAudit.ts"
}, (opts) => auditPuzzleWords.__executeServer(opts));
var auditPuzzleWords = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({ words: cleanWords(d.words) })).handler(auditPuzzleWords_createServerFn_handler, async ({ data }) => {
	const fallback = auditPuzzleWordsLocal(data.words);
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return fallback;
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 260,
				temperature: .2,
				messages: [{
					role: "system",
					content: "Audit a word-search word list. Return ONLY JSON: {score:number,issues:string[],suggestions:string[]}. Score 0-100. Check duplicates, length variety, recognizability, spelling-like validity, and game balance. Never invent replacement words."
				}, {
					role: "user",
					content: JSON.stringify({ words: data.words })
				}]
			})
		});
		if (!res.ok) return fallback;
		const raw = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
		const parsed = JSON.parse(raw);
		const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score))));
		const issues = Array.isArray(parsed.issues) ? parsed.issues.map(String).slice(0, 6) : [];
		const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String).slice(0, 6) : [];
		if (!Number.isFinite(score)) return fallback;
		return {
			score,
			words: data.words,
			issues,
			suggestions,
			source: "ai"
		};
	} catch {
		return fallback;
	}
});
//#endregion
export { auditPuzzleWords_createServerFn_handler };
