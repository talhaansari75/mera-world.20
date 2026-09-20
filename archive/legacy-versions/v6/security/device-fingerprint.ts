/** V6 platform module: security/device-fingerprint. */

export type DeviceFingerprintId = string;

export interface DeviceFingerprintRecord {
  id: DeviceFingerprintId;
  createdAt: number;
  updatedAt: number;
  version: number;
}

export function createDeviceFingerprintId(prefix = "device_fingerprint"): DeviceFingerprintId {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isDeviceFingerprintRecord(value: unknown): value is DeviceFingerprintRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.createdAt === "number" && typeof v.updatedAt === "number" && typeof v.version === "number";
}
