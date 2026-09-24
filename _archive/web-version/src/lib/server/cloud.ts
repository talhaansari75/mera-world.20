import { createServerFn } from "@tanstack/react-start";
import { getPrisma } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { defaultSave } from "@/lib/game/persist";

export const loadCloudSave = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<any> => {
    const row = await getPrisma().playerSave.findUnique({ where: { userId: context.userId } });
    if (!row) return { ok: true as const, save: null, version: 0, revision: 0, updatedAt: null };
    try {
      return {
        ok: true as const,
        save: JSON.parse(row.saveJson) as unknown,
        version: row.version,
        revision: Number(row.revision),
        updatedAt: row.updatedAt.toISOString(),
      };
    } catch {
      return { ok: false as const, error: "Corrupt cloud save" };
    }
  });

export const pushCloudSave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { json: string; expectedRevision?: number }) => ({
    json: String(d.json ?? "").slice(0, 250000),
    expectedRevision: Number.isFinite(d.expectedRevision)
      ? Math.max(0, Math.floor(Number(d.expectedRevision)))
      : undefined,
  }))
  .handler(async ({ context, data }): Promise<any> => {
    let incoming: Record<string, unknown>;
    try {
      const parsed = JSON.parse(data.json);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("save must be an object");
      incoming = parsed as Record<string, unknown>;
    } catch {
      return { ok: false as const, error: "Invalid save" };
    }

    // Client saves are never authoritative for economy/progression. A first sync must
    // start from a clean progression state; subsequent syncs may update presentation
    // and local metadata, but server-owned progression fields are preserved.
    const serverOwned = [
      "xp", "coins", "diamonds", "stars", "energy", "energyAt", "unlockedLevel",
      "results", "achievements", "stats", "claimedAchievements",
      "claimedMissions", "claimedSeasonTiers", "skillPoints", "skills",
      "storyChapter", "materials", "inventory", "ownedThemes", "ownedAvatars",
      "ownedPets", "petLevels", "equippedPet", "equipment", "equippedEquipment",
      "loginDays", "lastDaily", "dailyStreak", "lastSpin", "lastLoginReward", "behaviorProfile", "_serverVerified"
    ] as const;

    const db = getPrisma();
    return db.$transaction(async (tx: any) => {
      const row = await tx.playerSave.findUnique({ where: { userId: context.userId } });
      if (!row) {
        if (data.expectedRevision && data.expectedRevision !== 0) {
          return { ok: false as const, conflict: true as const, error: "Cloud save appeared while syncing" };
        }
        const baseline = defaultSave() as unknown as Record<string, unknown>;
        const suspicious = serverOwned.some((key) => {
          const value = incoming[key];
          if (value == null) return false;
          if (key === "_serverVerified") return value === true;
          const base = baseline[key];
          if (typeof value === "number" && typeof base === "number") return value !== base;
          if (key === "energyAt") return false;
          if (typeof value === "object") return JSON.stringify(value) !== JSON.stringify(base);
          return value !== base;
        });
        if (suspicious) {
          return { ok: false as const, error: "Initial cloud sync cannot establish server-owned progress. Start from a fresh server save." };
        }
        await tx.playerSave.create({
          data: { userId: context.userId, saveJson: data.json, version: 1, revision: 1n },
        });
        return { ok: true as const, revision: 1 };
      }

      const current = Number(row.revision);
      if (data.expectedRevision !== undefined && data.expectedRevision !== current) {
        return { ok: false as const, conflict: true as const, error: "Remote save changed. Pull it before pushing." };
      }
      let existing: Record<string, unknown> = {};
      try { existing = JSON.parse(row.saveJson) as Record<string, unknown>; } catch {
        return { ok: false as const, error: "Corrupt cloud save" };
      }
      const merged = { ...incoming };
      for (const key of serverOwned) if (key in existing) merged[key] = existing[key];
      const mergedJson = JSON.stringify(merged);
      const updated = await tx.playerSave.updateMany({
        where: { userId: context.userId, revision: row.revision },
        data: { saveJson: mergedJson, version: { increment: 1 }, revision: { increment: 1n } },
      });
      if (updated.count !== 1) {
        return { ok: false as const, conflict: true as const, error: "Remote save changed. Pull it before pushing." };
      }
      return { ok: true as const, revision: current + 1 };
    });
  });
