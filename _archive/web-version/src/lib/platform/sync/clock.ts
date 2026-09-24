export type ClockSample = { serverNow: number; clientSentAt: number; clientReceivedAt: number };
export function estimateClockOffset(sample: ClockSample): number {
  const midpoint = (sample.clientSentAt + sample.clientReceivedAt) / 2;
  return Math.round(sample.serverNow - midpoint);
}
export function trustedNow(offsetMs = 0): number { return Date.now() + offsetMs; }
export function clampClientDuration(startAt: number, endAt: number, maxMs: number): number {
  return Math.max(0, Math.min(maxMs, endAt - startAt));
}
