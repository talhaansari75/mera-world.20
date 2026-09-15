export type LiveChallenge = { id: string; title: string; description: string; target: number; reward: number };
const challenges: LiveChallenge[] = [
  { id: 'first-words', title: 'Ink Warm-up', description: 'Find 5 words today.', target: 5, reward: 75 },
  { id: 'three-clears', title: 'Trailblazer', description: 'Clear 3 levels today.', target: 3, reward: 120 },
  { id: 'daily-clear', title: 'Daily Pilgrimage', description: 'Complete the daily puzzle.', target: 1, reward: 180 },
];
const KEY = 'mwjs:v10:liveops';
type State = { day: string; progress: Record<string, number>; claimed: string[] };
function dayKey() { return new Date().toISOString().slice(0, 10); }
function load(): State { try { const raw = localStorage.getItem(KEY); const s = raw ? JSON.parse(raw) as State : null; if (s?.day === dayKey()) return s; } catch {} return { day: dayKey(), progress: {}, claimed: [] }; }
function save(s: State) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} }
export function getLiveChallenges() { return challenges; }
export function getLiveState() { return load(); }
export function incrementLiveProgress(id: string, amount = 1) { const s = load(); s.progress[id] = (s.progress[id] ?? 0) + Math.max(0, Math.floor(amount)); save(s); return s; }
export function claimLiveChallenge(id: string): number {
  const s = load(); const c = challenges.find((x) => x.id === id); if (!c || s.claimed.includes(id) || (s.progress[id] ?? 0) < c.target) return 0;
  s.claimed.push(id); save(s); return c.reward;
}
