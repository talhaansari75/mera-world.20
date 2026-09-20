/** V6 platform module: multiplayer/anti-cheat. */

export type AntiCheatId = string;

export interface AntiCheatRecord {
  id: AntiCheatId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createAntiCheatId(prefix = "anti_cheat"): AntiCheatId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isAntiCheatRecord(value: unknown): value is AntiCheatRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
