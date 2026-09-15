/** V7 domain module: gameplay/diagonal. */
export type DiagonalId = string;
export interface DiagonalRecord { id: DiagonalId; createdAt: number; version: number }
export function createDiagonal(id: DiagonalId): DiagonalRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidDiagonal(value: unknown): value is DiagonalRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
