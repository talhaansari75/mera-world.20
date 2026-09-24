export type GameEventMap = {
  "level:start": { level: number; mode: string; seed: number };
  "word:found": { word: string; index: number; combo: number };
  "word:miss": { letters: string };
  "level:complete": { level: number; stars: number; timeMs: number };
  "level:fail": { level: number; reason: string };
  "save:changed": { version: number };
};

type Listener<T> = (payload: T) => void;

export class EventBus<Events extends Record<string, unknown>> {
  private listeners = new Map<keyof Events, Set<Listener<any>>>();

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(listener);
    return () => this.off(event, listener);
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    this.listeners.get(event)?.delete(listener);
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    for (const listener of this.listeners.get(event) ?? []) listener(payload);
  }

  clear() {
    this.listeners.clear();
  }
}

export const gameEvents = new EventBus<GameEventMap>();
