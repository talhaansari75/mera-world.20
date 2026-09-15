const PREFIX = 'mwsj:v9:';
export function readJson<T>(key: string): T | null { try { const raw = localStorage.getItem(PREFIX + key); return raw ? JSON.parse(raw) as T : null; } catch { return null; } }
export function writeJson<T>(key: string, value: T): void { try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* storage is optional */ } }
export function removeJson(key: string): void { try { localStorage.removeItem(PREFIX + key); } catch { /* storage is optional */ } }
