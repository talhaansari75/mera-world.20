/** V6 platform module: admin/config. */

export type ConfigId = string;

export interface ConfigRecord {
  id: ConfigId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createConfigId(prefix = "config"): ConfigId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isConfigRecord(value: unknown): value is ConfigRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
