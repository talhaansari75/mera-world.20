import type { TelemetryEvent } from './telemetry';
export type FunnelStep = { name: string; count: number; conversion: number };
export function funnel(events: readonly TelemetryEvent[], steps: readonly string[]): FunnelStep[] {
  let previous = Math.max(1, events.filter(e => e.name === steps[0]).length);
  return steps.map((name, i) => { const count = events.filter(e => e.name === name).length; const conversion = i === 0 ? 1 : count / previous; previous = Math.max(1, count); return { name, count, conversion }; });
}
