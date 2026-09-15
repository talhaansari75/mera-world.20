import { useState } from 'react';
import { CalendarDays, Gift, CheckCircle2 } from 'lucide-react';
import { Screen } from '@/components/screens/chrome';
import { useGame } from '@/lib/store';
import { claimLiveChallenge, getLiveChallenges, getLiveState } from '@/lib/v10/liveops/liveOpsService';
export function LiveOpsScreen() {
  const [state, setState] = useState(getLiveState()); const patchSave = useGame((s) => s.patchSave);
  const refresh = () => setState(getLiveState());
  return <Screen title="Events & Challenges">
    <div className="panel rounded-2xl p-4"><div className="flex items-center gap-2"><CalendarDays className="size-5 text-primary"/><span className="font-semibold text-fg">Today’s live challenges</span></div><p className="mt-1 text-sm text-muted">Progress is stored locally and resets with the daily cycle.</p></div>
    <div className="mt-3 flex flex-col gap-3">{getLiveChallenges().map((c) => { const progress = Math.min(c.target, state.progress[c.id] ?? 0); const claimed = state.claimed.includes(c.id); return <article key={c.id} className="panel rounded-2xl p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-display text-lg text-fg">{c.title}</h2><p className="text-sm text-muted">{c.description}</p></div><span className="text-gold">+{c.reward}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full bg-primary" style={{ width: `${(progress/c.target)*100}%` }}/></div><div className="mt-2 flex items-center justify-between text-xs text-muted"><span>{progress}/{c.target}</span>{claimed ? <span className="text-primary"><CheckCircle2 className="mr-1 inline size-4"/>Claimed</span> : <button disabled={progress < c.target} className="hud-chip text-fg disabled:opacity-40" onClick={() => { const reward = claimLiveChallenge(c.id); if (reward) patchSave((s) => ({ ...s, coins: s.coins + reward, stats: { ...s.stats, coinsEarned: s.stats.coinsEarned + reward } })); refresh(); }}><Gift className="mr-1 inline size-4"/>Claim</button>}</div></article>; })}</div>
  </Screen>;
}
