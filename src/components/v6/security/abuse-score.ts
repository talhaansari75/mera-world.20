/** V6 platform module: security/abuse-score. */

export type AbuseScoreId = string;

export interface AbuseScoreRecord {
  id: AbuseScoreId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createAbuseScoreId(prefix = "abuse_score"): AbuseScoreId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isAbuseScoreRecord(value: unknown): value is AbuseScoreRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
