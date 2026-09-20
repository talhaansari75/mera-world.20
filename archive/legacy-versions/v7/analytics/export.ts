/** V7 domain module: analytics/export. */
export type ExportId = string;
export interface ExportRecord { id: ExportId; createdAt: number; version: number }
export function createExport(id: ExportId): ExportRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidExport(value: unknown): value is ExportRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
