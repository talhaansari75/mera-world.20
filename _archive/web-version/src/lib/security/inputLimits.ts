export const LIMITS = Object.freeze({ displayName: 40, roomId: 64, sessionId: 128, telemetryBatch: 100, reportDetails: 1000 });
export function boundedText(value: unknown, max: number) { return String(value ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").slice(0, max); }
