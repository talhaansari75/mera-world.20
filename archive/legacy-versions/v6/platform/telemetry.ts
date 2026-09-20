/** V6 platform module: platform/telemetry. */

export type TelemetryId = string;

export interface TelemetryRecord {
  id: TelemetryId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createTelemetryId(prefix = "telemetry"): TelemetryId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isTelemetryRecord(value: unknown): value is TelemetryRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
