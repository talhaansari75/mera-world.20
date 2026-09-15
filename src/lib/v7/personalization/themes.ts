/** V7 domain module: personalization/themes. */
export type ThemesId = string;
export interface ThemesRecord { id: ThemesId; createdAt: number; version: number }
export function createThemes(id: ThemesId): ThemesRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidThemes(value: unknown): value is ThemesRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
