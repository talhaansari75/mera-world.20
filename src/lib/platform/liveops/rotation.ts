export type Rotation<T> = { id: string; startsAt: number; endsAt: number; payload: T };
export function activeRotation<T>(items: readonly Rotation<T>[], now = Date.now()): Rotation<T> | null { return items.filter(x => x.startsAt <= now && now < x.endsAt).sort((a,b) => b.startsAt - a.startsAt)[0] ?? null; }
