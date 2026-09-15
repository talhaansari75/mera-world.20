/** V7 domain module: analytics/crash. */
export type CrashId = string;
export interface CrashRecord { id: CrashId; createdAt: number; version: number }
export function createCrash(id: CrashId): CrashRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCrash(value: unknown): value is CrashRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
