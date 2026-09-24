import { telemetry } from '../../platform/analytics/telemetry';
import { gameEvents } from '../core/eventBus';
let wired = false;
export function wireGameTelemetry(): void { if (wired) return; wired = true; gameEvents.on('level:start', e => telemetry.track('level_start', e)); gameEvents.on('word:found', e => telemetry.track('word_found', e)); gameEvents.on('word:miss', e => telemetry.track('word_miss', e)); gameEvents.on('level:complete', e => telemetry.track('level_complete', e)); gameEvents.on('level:fail', e => telemetry.track('level_fail', e)); gameEvents.on('save:changed', e => telemetry.track('save_changed', e)); }
