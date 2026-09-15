export type GameEventMap = {
  'level.started': { levelId: string; mode: string; seed: number };
  'level.completed': { levelId: string; timeMs: number; stars: number };
  'level.failed': { levelId: string; reason: string };
  'economy.changed': { currency: string; delta: number; reason: string };
  'network.changed': { online: boolean; quality: 'offline' | 'poor' | 'good' | 'excellent' };
  'sync.completed': { revision: number; conflicts: number };
  'security.flag': { type: string; score: number; details?: string };
};

type Listener<T> = (payload: T) => void;

export class EventBus<M extends Record<string, unknown>> {
  private listeners = new Map<keyof M, Set<Listener<never>>>();
  on<K extends keyof M>(event: K, listener: Listener<M[K]>) {
    const set = this.listeners.get(event) ?? new Set<Listener<never>>();
    set.add(listener as Listener<never>);
    this.listeners.set(event, set);
    return () => set.delete(listener as Listener<never>);
  }
  emit<K extends keyof M>(event: K, payload: M[K]) {
    this.listeners.get(event)?.forEach((listener) => listener(payload as never));
  }
  clear() { this.listeners.clear(); }
}

export const gameEvents = new EventBus<GameEventMap>();
