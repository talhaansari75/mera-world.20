/** V7 domain module: gameplay/mirror. */
export type MirrorId = string;
export interface MirrorRecord { id: MirrorId; createdAt: number; version: number }
export function createMirror(id: MirrorId): MirrorRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidMirror(value: unknown): value is MirrorRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
