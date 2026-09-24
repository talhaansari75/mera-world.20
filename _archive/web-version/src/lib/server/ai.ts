import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

export const askSmartHint = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { word: string; category: string }) => ({
    word: String(d.word ?? "").slice(0, 24),
    category: String(d.category ?? "mixed").slice(0, 32),
  }))
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "AI is not available right now." };
    const word = data.word.toUpperCase();
    if (!/^[A-Z]{3,14}$/.test(word) && !/^[\u0600-\u06FF]{2,10}$/.test(data.word)) {
      return { ok: false as const, error: "Invalid word" };
    }
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 80,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You write one short riddle-style hint for a word-search game. Never say the target word, never spell it, never give the first letter. One or two sentences, warm and literary. English.",
          },
          {
            role: "user",
            content: `Category: ${data.category}. Target word length: ${word.length}. Hint for the hidden word (do not name it).`,
          },
        ],
      }),
    });
    if (!res.ok) return { ok: false as const, error: `xAI error ${res.status}` };
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = body.choices?.[0]?.message?.content?.trim() ?? "";
    if (!text) return { ok: false as const, error: "Empty hint" };
    return { ok: true as const, text };
  });
