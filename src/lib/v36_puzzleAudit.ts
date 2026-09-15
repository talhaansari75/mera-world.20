import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export type PuzzleAudit = {
  score: number;
  words: string[];
  issues: string[];
  suggestions: string[];
  source: "local" | "ai";
};

const cleanWords = (input: unknown) => {
  if (!Array.isArray(input)) return [] as string[];
  return [...new Set(input.map((v) => String(v).trim().toUpperCase()).filter((v) => /^[A-Z]{3,14}$/.test(v)))].slice(0, 20);
};

export function auditPuzzleWordsLocal(words: string[]): PuzzleAudit {
  const issues: string[] = [];
  const suggestions: string[] = [];
  if (words.length < 3) issues.push("Add at least 3 valid words.");
  const short = words.filter((w) => w.length <= 3);
  const long = words.filter((w) => w.length >= 10);
  const uniqueLengths = new Set(words.map((w) => w.length)).size;
  const vowelSparse = words.filter((w) => !/[AEIOU]/.test(w));
  if (short.length > Math.ceil(words.length * 0.5)) issues.push("The set is dominated by very short words.");
  if (uniqueLengths < 2 && words.length >= 5) issues.push("Word lengths lack variety.");
  if (vowelSparse.length > 0) suggestions.push("Consider replacing vowel-sparse words with more recognizable vocabulary.");
  if (long.length === 0 && words.length >= 6) suggestions.push("Add one or two longer words for challenge variety.");
  if (words.length >= 8 && uniqueLengths >= 3) suggestions.push("Length distribution looks suitable for a mixed-difficulty puzzle.");
  if (!issues.length) suggestions.push("No structural issues detected. Generate a puzzle and run gameplay QA next.");
  const balance = Math.min(100, Math.max(0, 55 + words.length * 4 + uniqueLengths * 7 - short.length * 5 - issues.length * 10));
  return { score: Math.round(balance), words, issues, suggestions, source: "local" };
}

export const auditPuzzleWords = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { words: unknown }) => ({ words: cleanWords(d.words) }))
  .handler(async ({ data }) => {
    const fallback = auditPuzzleWordsLocal(data.words);
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return fallback;
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 260,
          temperature: 0.2,
          messages: [
            { role: "system", content: "Audit a word-search word list. Return ONLY JSON: {score:number,issues:string[],suggestions:string[]}. Score 0-100. Check duplicates, length variety, recognizability, spelling-like validity, and game balance. Never invent replacement words." },
            { role: "user", content: JSON.stringify({ words: data.words }) },
          ],
        }),
      });
      if (!res.ok) return fallback;
      const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const raw = body.choices?.[0]?.message?.content?.trim() ?? "";
      const parsed = JSON.parse(raw) as { score?: number; issues?: unknown; suggestions?: unknown };
      const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score))));
      const issues = Array.isArray(parsed.issues) ? parsed.issues.map(String).slice(0, 6) : [];
      const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.map(String).slice(0, 6) : [];
      if (!Number.isFinite(score)) return fallback;
      return { score, words: data.words, issues, suggestions, source: "ai" as const };
    } catch {
      return fallback;
    }
  });
