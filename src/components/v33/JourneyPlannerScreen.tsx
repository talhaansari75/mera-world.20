import { useMemo } from 'react';
import { Screen } from '@/components/screens/chrome';
import { useGame } from '@/lib/store';
import { buildJourneyPlan } from '@/lib/v33/planner/sessionPlanner';

export function JourneyPlannerScreen() {
  const stats = useGame(s => s.save.stats);
  const unlocked = useGame(s => s.save.unlockedLevel);
  const results = useGame(s => s.save.results);
  const go = useGame.getState().go;
  const plan = useMemo(() => buildJourneyPlan(stats, unlocked, results), [stats, unlocked, results]);
  return <Screen title="Journey Planner"><div className="flex flex-col gap-4">
    <section className="panel rounded-2xl p-4"><p className="text-xs uppercase tracking-wider text-primary">Personal session plan</p><h2 className="font-display mt-1 text-2xl text-fg">{plan.focus} · {plan.score}/100</h2><p className="mt-2 text-sm text-muted">{plan.summary}</p></section>
    <section className="grid gap-3">
      {plan.steps.map((step, i) => <article key={step.title} className="panel rounded-2xl p-4">
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-wider text-primary">Step {i + 1} · {step.minutes} min</p><h3 className="mt-1 font-semibold text-fg">{step.title}</h3></div><span className="rounded-full bg-surface px-3 py-1 text-xs text-muted">Lv {step.level}</span></div>
        <p className="mt-2 text-sm capitalize text-fg">{step.mode.replaceAll('_', ' ')}</p><p className="mt-1 text-sm text-muted">{step.goal}</p>
        <button type="button" className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground" onClick={() => go('modes')}>Choose mode</button>
      </article>)}
    </section>
  </div></Screen>;
}
