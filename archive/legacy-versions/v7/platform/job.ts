/** V7 domain module: platform/job. */
export type JobId = string;
export interface JobRecord { id: JobId; createdAt: number; version: number }
export function createJob(id: JobId): JobRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidJob(value: unknown): value is JobRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
