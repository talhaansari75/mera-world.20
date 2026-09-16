import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
import { t as ALL_WORDS } from "./words-p0ihLMcj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/creatorIdeas-CCcls1A9.js
var clean = (v, max) => String(v ?? "").trim().slice(0, max);
var validWord = (v) => /^[A-Z]{3,14}$/.test(v);
function localIdeas(category, count) {
	const q = category.toUpperCase().replace(/[^A-Z]/g, "");
	const scored = ALL_WORDS.map((word) => ({
		word: String(word).toUpperCase(),
		score: q && String(word).toUpperCase().includes(q.slice(0, 4)) ? 3 : 1
	})).filter((x) => validWord(x.word)).sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
	return [...new Set(scored.map((x) => x.word))].slice(0, count);
}
var generateCreatorIdeas_createServerFn_handler = createServerRpc({
	id: "05bb3f90a6df201c3b09534d8e0fc44c18be09c7e497530b564ec724860913c1",
	name: "generateCreatorIdeas",
	filename: "src/lib/v35/ai/creatorIdeas.ts"
}, (opts) => generateCreatorIdeas.__executeServer(opts));
var generateCreatorIdeas = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	category: clean(d.category, 32) || "adventure",
	difficulty: clean(d.difficulty, 16) || "medium",
	count: Math.max(3, Math.min(12, Math.floor(Number(d.count) || 8)))
})).handler(generateCreatorIdeas_createServerFn_handler, async ({ data }) => {
	const fallback = localIdeas(data.category, data.count);
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		source: "local",
		words: fallback,
		note: "AI service is not configured; local curated vocabulary was used."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 180,
			temperature: .5,
			messages: [{
				role: "system",
				content: "Return ONLY a JSON array of 3-12 common English single-word vocabulary items for a word-search game. A-Z letters only, 3-14 characters, no proper nouns, no profanity, no phrases."
			}, {
				role: "user",
				content: `Category: ${data.category}. Difficulty: ${data.difficulty}. Count: ${data.count}.`
			}]
		})
	});
	if (!res.ok) return {
		ok: true,
		source: "local",
		words: fallback,
		note: "AI service failed; local vocabulary was used instead."
	};
	const raw = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	try {
		const parsed = JSON.parse(raw);
		const words = Array.isArray(parsed) ? [...new Set(parsed.map((x) => String(x).toUpperCase().replace(/[^A-Z]/g, "")).filter(validWord))].slice(0, data.count) : [];
		if (words.length >= 3) return {
			ok: true,
			source: "ai",
			words,
			note: "AI suggestions validated by the server."
		};
	} catch {}
	return {
		ok: true,
		source: "local",
		words: fallback,
		note: "AI response could not be validated; local vocabulary was used."
	};
});
//#endregion
export { generateCreatorIdeas_createServerFn_handler };
