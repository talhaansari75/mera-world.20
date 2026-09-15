/** V7 domain module: liveops/status. */
export type StatusId = string;
export interface StatusRecord { id: StatusId; createdAt: number; version: number }
export function createStatus(id: StatusId): StatusRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidStatus(value: unknown): value is StatusRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
