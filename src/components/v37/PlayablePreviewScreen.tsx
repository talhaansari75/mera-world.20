import { useState } from "react";
import { Eye, RotateCcw, Save } from "lucide-react";
import { Screen } from "@/components/screens/chrome";
import { buildPlayablePreview, type PreviewResult } from "@/lib/v37/preview/playablePreview";
import { newDraft, saveDraft } from "@/lib/v24/creator/creatorService";
import { useGame } from "@/lib/store";

export function PlayablePreviewScreen() {
  const go = useGame.getState().go;
  const [raw, setRaw] = useState("ADVENTURE, DISCOVER, JOURNEY, TREASURE, COMPASS, MYSTERY");
  const [title, setTitle] = useState("My Journey Preview");
  const [category, setCategory] = useState("adventure");
  const [result, setResult] = useState<PreviewResult | null>(null);
  const [message, setMessage] = useState("");
  const run = () => {
    setMessage("");
    const words = raw.split(/[\s,;\n]+/).filter(Boolean);
    const r = buildPlayablePreview({ words, title, category, seed: Date.now() & 0xffffffff });
    setResult(r);
    if (!r.valid) setMessage(r.errors[0] || "Preview needs more work.");
  };
  const save = () => {
    if (!result?.valid) return;
    const d = newDraft(title, result.puzzle.words, category);
    saveDraft(d);
    setMessage("Playable preview saved as a Creator draft.");
  };
  return <Screen title="Playable Preview Studio"><div className="grid gap-4">
    <section className="panel rounded-2xl p-5"><div className="flex items-center gap-3"><Eye className="size-6 text-primary"/><div><p className="text-xs uppercase tracking-wider text-primary">V37 creator pipeline</p><h2 className="font-display text-2xl text-fg">Turn words into a playable puzzle</h2></div></div><p className="mt-2 text-sm text-muted">Generate a deterministic local grid from your word set, validate it, preview the board, and save a playable Creator draft.</p></section>
    <section className="panel grid gap-3 rounded-2xl p-4"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Puzzle title" className="w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg"/><input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" className="w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg"/><textarea value={raw} onChange={e=>setRaw(e.target.value)} rows={5} className="w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg"/><button onClick={run} className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-semibold text-primary-foreground"><RotateCcw className="size-5"/>Generate playable preview</button></section>
    {result && <section className="panel rounded-2xl p-4"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wider text-muted">Quality gate</p><p className="font-display text-3xl text-fg">{result.quality}<span className="text-sm text-muted">/100</span></p></div><span className="hud-chip text-fg">{result.valid ? "Playable" : "Needs fixes"}</span></div><div className="mx-auto mt-4 w-fit overflow-hidden rounded-xl border border-border"><div className="grid" style={{gridTemplateColumns:`repeat(${result.puzzle.size}, minmax(20px, 1fr))`}}>{result.puzzle.grid.flatMap((row,r)=>row.map((cell,c)=><span key={`${r}-${c}`} className="flex h-7 w-7 items-center justify-center border border-border/40 text-[10px] font-bold text-fg">{cell}</span>))}</div></div><div className="mt-4 flex flex-wrap gap-2">{result.puzzle.words.map(w=><span key={w} className="hud-chip text-fg">{w}</span>)}</div>{result.valid&&<button onClick={save} className="mt-4 flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-fg"><Save className="size-4"/>Save as Creator draft</button>}{message&&<p className="mt-3 text-sm text-muted">{message}</p>}</section>}
    <div className="flex flex-wrap gap-4"><button onClick={()=>go("puzzleAudit")} className="text-sm text-primary">← Puzzle QA Lab</button><button onClick={()=>go("creator")} className="text-sm text-primary">Creator Studio →</button></div>
  </div></Screen>;
}
