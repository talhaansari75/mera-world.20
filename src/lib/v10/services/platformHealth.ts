export type HealthCheck = { id: string; label: string; status: 'ready' | 'local-only' | 'needs-config' };
export function getPlatformHealth(): HealthCheck[] { return [
  { id: 'game', label: 'Local gameplay engine', status: 'ready' },
  { id: 'save', label: 'Local save storage', status: 'ready' },
  { id: 'offline', label: 'Offline queue', status: 'ready' },
  { id: 'cloud', label: 'Cloud sync provider', status: 'needs-config' },
  { id: 'payments', label: 'Payment provider', status: 'needs-config' },
  { id: 'push', label: 'Push notifications', status: 'needs-config' },
  { id: 'multiplayer', label: 'Multiplayer transport', status: 'needs-config' },
]; }
