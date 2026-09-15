/** V7 domain module: platform/circuit-breaker. */
export type CircuitBreakerId = string;
export interface CircuitBreakerRecord { id: CircuitBreakerId; createdAt: number; version: number }
export function createCircuitBreaker(id: CircuitBreakerId): CircuitBreakerRecord {
  if (!id.trim()) throw new Error("id_required");
  return { id, createdAt: Date.now(), version: 1 };
}
export function isValidCircuitBreaker(value: unknown): value is CircuitBreakerRecord {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && v.id.length > 0 && typeof v.version === "number";
}
