export type Friend = { id: string; name: string; online: boolean; score: number };
export type Clan = { id: string; name: string; members: number; weeklyScore: number };
const FRIENDS_KEY = 'mwjs:v10:friends';
const CLAN_KEY = 'mwjs:v10:clan';
const defaultFriends: Friend[] = [
  { id: 'atlas', name: 'Atlas', online: true, score: 12840 },
  { id: 'noor', name: 'Noor', online: false, score: 10420 },
  { id: 'mika', name: 'Mika', online: true, score: 8730 },
];
function load<T>(key: string, fallback: T): T { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }
function save<T>(key: string, value: T) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private browsing */ } }
export function listFriends(): Friend[] { return load(FRIENDS_KEY, defaultFriends); }
export function addFriend(name: string): Friend | null {
  const clean = name.trim().replace(/[^\p{L}\p{N} _-]/gu, '').slice(0, 24);
  if (!clean) return null;
  const friends = listFriends();
  if (friends.some((f) => f.name.toLowerCase() === clean.toLowerCase())) return null;
  const friend = { id: `${Date.now()}`, name: clean, online: false, score: 0 };
  save(FRIENDS_KEY, [friend, ...friends]); return friend;
}
export function removeFriend(id: string) { save(FRIENDS_KEY, listFriends().filter((f) => f.id !== id)); }
export function getClan(): Clan | null { return load<Clan | null>(CLAN_KEY, null); }
export function joinClan(name: string): Clan | null {
  const clean = name.trim().slice(0, 32); if (!clean) return null;
  const clan = { id: `clan-${Date.now()}`, name: clean, members: 1, weeklyScore: 0 }; save(CLAN_KEY, clan); return clan;
}
export function leaveClan() { try { localStorage.removeItem(CLAN_KEY); } catch { /* ignore */ } }
