export type TelemetryEvent = { name: string; at: number; sessionId: string; properties?: Record<string, string | number | boolean> };

const sessionId = globalThis.crypto?.randomUUID?.() ?? `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const buffer: TelemetryEvent[] = [];

export function track(name: string, properties?: TelemetryEvent['properties']) {
  buffer.push({ name, at: Date.now(), sessionId, properties });
  if (buffer.length > 500) buffer.shift();
}

export function drainTelemetry() { return buffer.splice(0, buffer.length); }
export function currentSessionId() { return sessionId; }
