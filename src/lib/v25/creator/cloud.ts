import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { generatePuzzle } from "@/lib/game/generator";
import { validatePuzzleQuality } from "@/lib/v16/core/puzzleQuality";

const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const words = (v: unknown) => Array.isArray(v)
  ? [...new Set(v.map(x => String(x).toUpperCase().replace(/[^A-Z]/g, "").slice(0, 14)).filter(x => x.length >= 3))].slice(0, 12)
  : [];

// Creator publishing is now a review workflow. Creators can submit/update a puzzle,
// but only the moderation service can transition approved content to published.
export const publishCreatorPuzzle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; title: string; category: string; words: string[] }) => ({
    id: clean(d.id, 80), title: clean(d.title, 48) || "Untitled Journey",
    category: clean(d.category, 32) || "creator", words: words(d.words),
  }))
  .handler(async ({ context, data }) => {
    if (!data.id || data.words.length < 3) return { ok: false as const, error: "At least 3 valid words are required." };
    const puzzle = generatePuzzle({ seed: 7001 + data.words.length, size: 12, wordCount: data.words.length, minLen: 3, maxLen: 14, dirs: [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]], category: data.category, title: data.title });
    const quality = validatePuzzleQuality(puzzle, true);
    if (!quality.valid) return { ok: false as const, error: `Puzzle quality check failed: ${quality.errors.slice(0, 4).join(", ")}` };
    const db = getPrisma();
    const existing = await db.creatorPuzzle.findUnique({ where: { id: data.id } });
    if (existing && existing.userId !== context.userId) return { ok: false as const, error: "Puzzle belongs to another creator." };
    const row = await db.creatorPuzzle.upsert({
      where: { id: data.id },
      create: { id: data.id, userId: context.userId, title: data.title, category: data.category, wordsJson: data.words, status: "pending_review", version: 1 },
      update: { title: data.title, category: data.category, wordsJson: data.words, status: "pending_review", version: { increment: 1 } },
    });
    return { ok: true as const, id: row.id, status: row.status, message: "Submitted for moderation review." };
  });

export const listMyCreatorPuzzles = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(async ({ context }) => {
  const rows = await getPrisma().creatorPuzzle.findMany({ where: { userId: context.userId }, orderBy: { updatedAt: "desc" }, take: 50 });
  return { ok: true as const, puzzles: rows.map(r => ({ ...r, words: r.wordsJson as string[], wordsJson: undefined })) };
});
