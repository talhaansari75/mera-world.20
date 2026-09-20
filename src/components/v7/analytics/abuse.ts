/** V7 domain module: analytics/abuse. */
export type AbuseId = string;
export interface AbuseRecord { id: AbuseId; createdAt: number; version: number }
export function createAbuse(id: AbuseId): AbuseRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidAbuse(value: unknown): value is AbuseRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
