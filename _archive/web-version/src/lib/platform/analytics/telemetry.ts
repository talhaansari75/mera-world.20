export type TelemetryEvent = { name: string; at: number; sessionId?: string; userId?: string; props?: Record<string, string | number | boolean | null> };
export class TelemetryBuffer {
  private readonly events: TelemetryEvent[] = [];
  constructor(private readonly max = 500) {}
  track(name: string, props?: TelemetryEvent['props'], context?: Pick<TelemetryEvent,'sessionId'|'userId'>): void { if (!name) return; this.events.push({ name, at: Date.now(), props, ...context }); if (this.events.length > this.max) this.events.splice(0, this.events.length - this.max); }
  drain(): TelemetryEvent[] { return this.events.splice(0); }
  snapshot(): readonly TelemetryEvent[] { return this.events.slice(); }
}
export const telemetry = new TelemetryBuffer();
