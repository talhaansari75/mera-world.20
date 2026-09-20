/** V7 domain module: security/anti-cheat. */
export type AntiCheatId = string;
export interface AntiCheatRecord { id: AntiCheatId; createdAt: number; version: number }
export function createAntiCheat(id: AntiCheatId): AntiCheatRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidAntiCheat(value: unknown): value is AntiCheatRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
