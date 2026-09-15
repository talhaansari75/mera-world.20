/** V6 platform module: content/moderation. */

export type ModerationId = string;

export interface ModerationRecord {
  id: ModerationId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createModerationId(prefix = "moderation"): ModerationId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isModerationRecord(value: unknown): value is ModerationRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
