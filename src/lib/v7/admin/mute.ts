/** V7 domain module: admin/mute. */
export type MuteId = string;
export interface MuteRecord { id: MuteId; createdAt: number; version: number }
export function createMute(id: MuteId): MuteRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidMute(value: unknown): value is MuteRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
