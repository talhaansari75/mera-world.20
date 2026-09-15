/** V7 domain module: notifications/in-app. */
export type InAppId = string;
export interface InAppRecord { id: InAppId; createdAt: number; version: number }
export function createInApp(id: InAppId): InAppRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidInApp(value: unknown): value is InAppRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
