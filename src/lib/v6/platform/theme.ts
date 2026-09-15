/** V6 platform module: platform/theme. */

export type ThemeId = string;

export interface ThemeRecord {
  id: ThemeId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createThemeId(prefix = "theme"): ThemeId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isThemeRecord(value: unknown): value is ThemeRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
