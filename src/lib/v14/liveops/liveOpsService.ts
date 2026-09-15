import type { V14Challenge } from "./seasonal";
import { dayKey, getV14Challenges, seasonKey, weekKey } from "./seasonal";

const KEY = "mwjs:v14:liveops";
type CycleState = { key: string; progress: Record<string, number>; claimed: string[] };
type State = { day: CycleState; week: CycleState; season: CycleState };

function fresh(): State {
  return {
    day: { key: dayKey(), progress: {}, claimed: [] },
    week: { key: weekKey(), progress: {}, claimed: [] },
    season: { key: seasonKey(), progress: {}, claimed: [] },
  };
}
function load(): State {
  const base = fresh();
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<State> | null;
    for (const cycle of ["day", "week", "season"] as const) {
      const key = base[cycle].key;
      if (parsed?.[cycle]?.key === key) base[cycle] = { ...base[cycle], ...parsed[cycle] };
    }
  } catch {}
  return base;
}
function save(state: State) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} }
function cycleOf(c: V14Challenge): "day" | "week" | "season" { return c.cycle === "daily" ? "day" : c.cycle === "weekly" ? "week" : "season"; }

export function getV14State() { return load(); }
export function getV14ChallengesNow() { return getV14Challenges(); }
export function incrementV14Progress(kind: "words" | "clears", amount = 1) {
  const state = load();
  const challenges = getV14Challenges();
  const add = Math.max(0, Math.floor(amount));
  for (const challenge of challenges) {
    const applies = kind === "words" ? challenge.id.includes("words") : challenge.id.includes("clears");
    if (!applies) continue;
    const cycle = cycleOf(challenge);
    state[cycle].progress[challenge.id] = (state[cycle].progress[challenge.id] ?? 0) + add;
  }
  save(state);
  return state;
}
export function claimV14Challenge(id: string): number {
  const state = load();
  const challenge = getV14Challenges().find((x) => x.id === id);
  if (!challenge) return 0;
  const cycle = cycleOf(challenge);
  const bucket = state[cycle];
  if (bucket.claimed.includes(id) || (bucket.progress[id] ?? 0) < challenge.target) return 0;
  bucket.claimed.push(id); save(state); return challenge.reward;
}
