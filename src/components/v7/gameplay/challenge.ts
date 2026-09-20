/** V7 domain module: gameplay/challenge. */
export type ChallengeId = string;
export interface ChallengeRecord { id: ChallengeId; createdAt: number; version: number }
export function createChallenge(id: ChallengeId): ChallengeRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidChallenge(value: unknown): value is ChallengeRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
