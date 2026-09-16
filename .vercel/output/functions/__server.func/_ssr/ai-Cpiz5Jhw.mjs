import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-C8m-3aaU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-Cpiz5Jhw.js
var askSmartHint_createServerFn_handler = createServerRpc({
	id: "654744ea20b062d2b60f2f278bae3afff117b661a98239f16be07de3cbbc8a19",
	name: "askSmartHint",
	filename: "src/lib/server/ai.ts"
}, (opts) => askSmartHint.__executeServer(opts));
var askSmartHint = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => ({
	word: String(d.word ?? "").slice(0, 24),
	category: String(d.category ?? "mixed").slice(0, 32)
})).handler(askSmartHint_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available right now."
	};
	const word = data.word.toUpperCase();
	if (!/^[A-Z]{3,14}$/.test(word) && !/^[\u0600-\u06FF]{2,10}$/.test(data.word)) return {
		ok: false,
		error: "Invalid word"
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			max_tokens: 80,
			temperature: .7,
			messages: [{
				role: "system",
				content: "You write one short riddle-style hint for a word-search game. Never say the target word, never spell it, never give the first letter. One or two sentences, warm and literary. English."
			}, {
				role: "user",
				content: `Category: ${data.category}. Target word length: ${word.length}. Hint for the hidden word (do not name it).`
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI error ${res.status}`
	};
	const text = (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
	if (!text) return {
		ok: false,
		error: "Empty hint"
	};
	return {
		ok: true,
		text
	};
});
//#endregion
export { askSmartHint_createServerFn_handler };
