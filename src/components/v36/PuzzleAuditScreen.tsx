import { useState } from "react";
import { ShieldCheck, ScanSearch } from "lucide-react";
import { Screen } from "@/components/screens/chrome";
import { auditPuzzleWords, type PuzzleAudit } from "@/lib/v36_puzzleAudit";
import { useGame } from "@/lib/store";

export function PuzzleAuditScreen() {
  const go = useGame.getState().go;
  const [input, setInput] = useState("ADVENTURE, DISCOVER, JOURNEY, TREASURE, COMPASS, MYSTERY");
  const [result, setResult] = useState<PuzzleAudit | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try {
      const words = input.split(/[\s,;]+/).filter(Boolean);
      setResult(await auditPuzzleWords({ data: { words } }));
    } finally { setBusy(false); }
  };
  return <Screen title="Puzzle QA Lab"><div className="grid gap-4">
    <section className="panel rounded-2xl p-5"><div className="flex items-center gap-3"><ShieldCheck className="size-6 text-primary"/><div><p className="text-xs uppercase tracking-wider text-primary">V36 quality gate</p><h2 className="font-display text-2xl text-fg">Audit before publishing</h2></div></div><p className="mt-2 text-sm text-muted">Check a Creator word set for structural balance before turning it into a playable puzzle. AI review is server-side optional; deterministic QA remains available offline.</p></section>
    <section className="panel grid gap-3 rounded-2xl p-4"><label className="text-sm font-medium text-fg">Words</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={5} className="w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg"/><button disabled={busy} onClick={run} className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-semibold text-primary-foreground disabled:opacity-50"><ScanSearch className="size-5"/>{busy ? "Auditing…" : "Run quality audit"}</button></section>
    {result && <section className="panel rounded-2xl p-4"><div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-wider text-muted">Quality score</p><p className="font-display text-4xl text-fg">{result.score}<span className="text-base text-muted">/100</span></p></div><span className="hud-chip text-fg">{result.source === "ai" ? "AI + QA" : "Local QA"}</span></div><p className="mt-4 text-sm font-semibold text-fg">{result.words.length} validated words</p>{result.issues.length > 0 && <div className="mt-3"><h3 className="text-sm font-semibold text-fg">Issues</h3><ul className="mt-2 list-disc pl-5 text-sm text-muted">{result.issues.map((x,i)=><li key={i}>{x}</li>)}</ul></div>}<div className="mt-3"><h3 className="text-sm font-semibold text-fg">Suggestions</h3><ul className="mt-2 list-disc pl-5 text-sm text-muted">{result.suggestions.map((x,i)=><li key={i}>{x}</li>)}</ul></div></section>}
    <div className="flex flex-wrap gap-4"><button onClick={()=>go("aiPuzzleLab")} className="text-sm text-primary">← Back to AI Puzzle Lab</button><button onClick={()=>go("playablePreview")} className="text-sm text-primary">Build Playable Preview →</button></div>
  </div></Screen>;
}
