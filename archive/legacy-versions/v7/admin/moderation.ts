/** V7 domain module: admin/moderation. */
export type ModerationId = string;
export interface ModerationRecord { id: ModerationId; createdAt: number; version: number }
export function createModeration(id: ModerationId): ModerationRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidModeration(value: unknown): value is ModerationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
