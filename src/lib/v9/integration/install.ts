import { installGameplayBridge } from './gameplayBridge';
let cleanup: (() => void) | null = null;
export function installV9Integrations() { if (!cleanup) cleanup = installGameplayBridge(); return cleanup; }
