import { useState } from "react";
import { CalendarDays, CheckCircle2, Gift, Sparkles } from "lucide-react";
import { Screen } from "@/components/screens/chrome";
import { useGame } from "@/lib/store";
import { claimV14Challenge, getV14ChallengesNow, getV14State } from "@/lib/v14/liveops/liveOpsService";
import { getLanguagePack } from "@/lib/v14/content/languagePacks";

export function V14LiveOpsScreen() {
  const [state, setState] = useState(getV14State());
  const lang = useGame((s) => s.save.language);
  const patchSave = useGame((s) => s.patchSave);
  const challenges = getV14ChallengesNow();
  const refresh = () => setState(getV14State());
  return <Screen title="Events & Challenges">
    <div className="panel rounded-2xl p-4">
      <div className="flex items-center gap-2"><CalendarDays className="size-5 text-primary" /><span className="font-semibold text-fg">Daily · Weekly · Seasonal</span></div>
      <p className="mt-1 text-sm text-muted">Challenges progress offline and reset automatically at the start of each local cycle.</p>
      <p className="mt-2 text-xs text-muted"><Sparkles className="mr-1 inline size-3" />Content locale: {getLanguagePack(lang).nativeName}</p>
    </div>
    <div className="mt-3 flex flex-col gap-3">{challenges.map((c) => {
      const bucket = c.cycle === "daily" ? state.day : c.cycle === "weekly" ? state.week : state.season;
      const progress = Math.min(c.target, bucket.progress[c.id] ?? 0); const claimed = bucket.claimed.includes(c.id);
      return <article key={c.id} className="panel rounded-2xl p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-wider text-gold">{c.cycle}</p><h2 className="font-display text-lg text-fg">{c.title}</h2><p className="text-sm text-muted">{c.description}</p></div><span className="text-gold">+{c.reward}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full bg-primary" style={{ width: `${(progress / c.target) * 100}%` }} /></div><div className="mt-2 flex items-center justify-between text-xs text-muted"><span>{progress}/{c.target}</span>{claimed ? <span className="text-primary"><CheckCircle2 className="mr-1 inline size-4" />Claimed</span> : <button disabled={progress < c.target} className="hud-chip text-fg disabled:opacity-40" onClick={() => { const reward = claimV14Challenge(c.id); if (reward) patchSave((s) => ({ ...s, coins: s.coins + reward, stats: { ...s.stats, coinsEarned: s.stats.coinsEarned + reward } })); refresh(); }}><Gift className="mr-1 inline size-4" />Claim</button>}</div></article>;
    })}</div>
  </Screen>;
}
