/** V6 platform module: social/referrals. */

export type ReferralsId = string;

export interface ReferralsRecord {
  id: ReferralsId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createReferralsId(prefix = "referrals"): ReferralsId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isReferralsRecord(value: unknown): value is ReferralsRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
