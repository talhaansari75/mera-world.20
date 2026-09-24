export type Versioned<T> = { value: T; version: number; updatedAt: number };
export function lastWriteWins<T>(local: Versioned<T>, remote: Versioned<T>): Versioned<T> { return remote.updatedAt > local.updatedAt || (remote.updatedAt === local.updatedAt && remote.version > local.version) ? remote : local; }
export function mergeMaps<T>(local: Record<string,T>, remote: Record<string,T>): Record<string,T> { return { ...local, ...remote }; }
