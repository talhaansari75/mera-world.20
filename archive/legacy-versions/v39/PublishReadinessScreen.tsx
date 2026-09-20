import { useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, ClipboardCheck, RotateCcw, ShieldCheck } from "lucide-react";
import { Screen } from "@/components/screens/chrome";
import { evaluatePublishReadiness, listPublishCandidates } from "@/lib/v39/publish/readiness";
import { useGame } from "@/lib/store";

export function PublishReadinessScreen() {
  const go = useGame.getState().go;
  const candidates = useMemo(() => listPublishCandidates(), []);
  const [selected, setSelected] = useState(candidates[0]?.draft.id || "");
  const [refresh, setRefresh] = useState(0);
  const result = useMemo(() => evaluatePublishReadiness(selected), [selected, refresh]);
  return <Screen title="Publish Readiness"><div className="grid gap-4">
    <section className="panel rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-primary">V39 creator release gate</p>
      <h2 className="font-display mt-1 text-2xl text-fg">Know when your puzzle is ready</h2>
      <p className="mt-2 text-sm text-muted">Combines Puzzle QA and real creator playtest results into one offline release check. This gate does not publish anything automatically.</p>
    </section>
    <section className="panel rounded-2xl p-4">
      <select value={selected} onChange={e => setSelected(e.target.value)} className="w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg">
        <option value="">Choose a Creator draft</option>{candidates.map(x => <option key={x.draft.id} value={x.draft.id}>{x.draft.title} · {x.score}/100</option>)}
      </select>
      {!result && <p className="mt-3 text-sm text-muted">Create a Creator draft first.</p>}
    </section>
    {result && <>
      <section className="panel rounded-2xl p-5">
        <div className="flex items-center justify-between gap-3"><div><p className="text-sm text-muted">{result.draft.category} · {result.draft.words.length} words</p><h3 className="font-display text-2xl text-fg">{result.draft.title}</h3></div><div className="hud-chip text-fg">{result.score}/100</div></div>
        <div className="mt-4 flex items-center gap-2 text-fg">{result.ready ? <CheckCircle2 className="size-5 text-primary"/> : <CircleAlert className="size-5"/>}<b>{result.ready ? "Ready for publish" : "Needs another pass"}</b></div>
      </section>
      <section className="panel rounded-2xl p-4 grid gap-3">
        <div className="flex items-center gap-2 text-fg"><ShieldCheck className="size-5"/><b>Quality gate</b><span className="ml-auto text-sm text-muted">{result.audit.score}/100</span></div>
        {result.audit.issues.length ? result.audit.issues.map(x => <p key={x} className="text-sm text-muted">• {x}</p>) : <p className="text-sm text-muted">No structural blockers from the local QA audit.</p>}
        <div className="flex items-center gap-2 text-fg"><ClipboardCheck className="size-5"/><b>Playtest</b><span className="ml-auto text-sm text-muted">{result.latest ? `${result.latest.score}/100 · ${result.latest.mistakes} mistakes` : "Not completed"}</span></div>
      </section>
      {result.blockers.length > 0 && <section className="panel rounded-2xl p-4"><b className="text-fg">Blockers</b>{result.blockers.map(x => <p key={x} className="mt-2 text-sm text-muted">• {x}</p>)}</section>}
      {result.recommendations.length > 0 && <section className="panel rounded-2xl p-4"><b className="text-fg">Recommendations</b>{result.recommendations.map(x => <p key={x} className="mt-2 text-sm text-muted">• {x}</p>)}</section>}
      <button onClick={() => setRefresh(x => x + 1)} className="flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-fg"><RotateCcw className="size-4"/>Re-check readiness</button>
    </>}
    <div className="flex flex-wrap gap-4"><button onClick={() => go("creatorPlaytest")} className="text-sm text-primary">Creator Playtest →</button><button onClick={() => go("creator")} className="text-sm text-primary">Creator Studio →</button><button onClick={() => go("more")} className="text-sm text-muted">Back to More</button></div>
  </div></Screen>;
}
