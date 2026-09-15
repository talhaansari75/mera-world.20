import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { ALL_WORDS } from "@/lib/game/words";

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const validWord = (v: string) => /^[A-Z]{3,14}$/.test(v);

function localIdeas(category: string, count: number) {
  const q = category.toUpperCase().replace(/[^A-Z]/g, "");
  const scored = ALL_WORDS
    .map((word) => ({ word: String(word).toUpperCase(), score: q && String(word).toUpperCase().includes(q.slice(0, 4)) ? 3 : 1 }))
    .filter((x) => validWord(x.word))
    .sort((a, b) => b.score - a.score || a.word.localeCompare(b.word));
  return [...new Set(scored.map((x) => x.word))].slice(0, count);
}

export const generateCreatorIdeas = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { category: string; difficulty: string; count: number }) => ({
    category: clean(d.category, 32) || "adventure",
    difficulty: clean(d.difficulty, 16) || "medium",
    count: Math.max(3, Math.min(12, Math.floor(Number(d.count) || 8))),
  }))
  .handler(async ({ data }) => {
    const fallback = localIdeas(data.category, data.count);
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: true as const, source: "local" as const, words: fallback, note: "AI service is not configured; local curated vocabulary was used." };
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 180,
        temperature: 0.5,
        messages: [
          { role: "system", content: "Return ONLY a JSON array of 3-12 common English single-word vocabulary items for a word-search game. A-Z letters only, 3-14 characters, no proper nouns, no profanity, no phrases." },
          { role: "user", content: `Category: ${data.category}. Difficulty: ${data.difficulty}. Count: ${data.count}.` },
        ],
      }),
    });
    if (!res.ok) return { ok: true as const, source: "local" as const, words: fallback, note: "AI service failed; local vocabulary was used instead." };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = body.choices?.[0]?.message?.content?.trim() ?? "";
    try {
      const parsed = JSON.parse(raw);
      const words = Array.isArray(parsed) ? [...new Set(parsed.map((x) => String(x).toUpperCase().replace(/[^A-Z]/g, "")).filter(validWord))].slice(0, data.count) : [];
      if (words.length >= 3) return { ok: true as const, source: "ai" as const, words, note: "AI suggestions validated by the server." };
    } catch { /* fallback below */ }
    return { ok: true as const, source: "local" as const, words: fallback, note: "AI response could not be validated; local vocabulary was used." };
  });
