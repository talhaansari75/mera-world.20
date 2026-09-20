import { useMemo } from "react";
import { Screen } from "@/components/screens/chrome";
import { useGame } from "@/lib/store";
import { buildCoachInsights, recommendedModes } from "@/lib/v31/personalization/coach";

export function CoachScreen() {
  const stats = useGame(s => s.save.stats);
  const unlocked = useGame(s => s.save.unlockedLevel);
  const go = useGame.getState().go;
  const insights = useMemo(() => buildCoachInsights(stats, unlocked), [stats, unlocked]);
  const modes = useMemo(() => recommendedModes(stats), [stats]);
  return <Screen title="Smart Coach">
    <div className="flex flex-col gap-4">
      <section className="panel rounded-2xl p-4">
        <p className="text-xs uppercase tracking-wider text-primary">Personalized</p>
        <h2 className="font-display mt-1 text-2xl text-fg">Your next best move</h2>
        <p className="mt-2 text-sm text-muted">Recommendations are generated locally from your gameplay stats. No extra profile data is sent anywhere.</p>
      </section>
      <section className="grid gap-3 sm:grid-cols-3">
        {modes.map(mode => <button key={mode} type="button" className="panel rounded-2xl p-4 text-left" onClick={() => go("modes")}><div className="text-xs uppercase tracking-wider text-muted">Recommended</div><div className="mt-1 font-semibold text-fg">{mode.replaceAll("_"," ")}</div></button>)}
      </section>
      <section className="flex flex-col gap-3">
        {insights.length ? insights.map(item => <article key={item.id} className="panel rounded-2xl p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-fg">{item.title}</h3><span className="text-xs uppercase tracking-wider text-primary">{item.priority}</span></div><p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>{item.action && <p className="mt-3 text-xs font-semibold text-fg">Suggested: {item.action}</p>}</article>) : <article className="panel rounded-2xl p-4 text-sm text-muted">Play a few boards and your personalized coaching insights will appear here.</article>}
      </section>
    </div>
  </Screen>;
}
