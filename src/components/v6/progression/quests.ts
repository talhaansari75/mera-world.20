/** V6 platform module: progression/quests. */

export type QuestsId = string;

export interface QuestsRecord {
  id: QuestsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createQuestsId(prefix = "quests"): QuestsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isQuestsRecord(value: unknown): value is QuestsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
