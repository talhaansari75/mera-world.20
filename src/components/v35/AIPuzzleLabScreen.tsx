import { useState } from "react";
import { Sparkles, WandSparkles } from "lucide-react";
import { Screen } from "@/components/screens/chrome";
import { generateCreatorIdeas } from "@/lib/v35/ai/creatorIdeas";
import { useGame } from "@/lib/store";

export function AIPuzzleLabScreen() {
  const go = useGame.getState().go;
  const [category, setCategory] = useState("adventure");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(8);
  const [words, setWords] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true); setNote("");
    try { const r = await generateCreatorIdeas({ data: { category, difficulty, count } }); setWords(r.ok ? r.words : []); setNote(r.ok ? `${r.source === "ai" ? "AI" : "Local"} suggestions ready. ${r.note}` : r.error); }
    catch { setNote("Sign in or enable the server AI boundary to generate suggestions."); }
    finally { setBusy(false); }
  };
  return <Screen title="AI Puzzle Lab"><div className="grid gap-4">
    <section className="panel rounded-2xl p-5"><div className="flex items-center gap-3"><Sparkles className="size-6 text-primary"/><div><p className="text-xs uppercase tracking-wider text-primary">Creator intelligence</p><h2 className="font-display text-2xl text-fg">Build a word set faster</h2></div></div><p className="mt-2 text-sm text-muted">Generate a validated word list for Creator Studio. The AI key stays server-side; when AI is unavailable, the app falls back to local vocabulary.</p></section>
    <div className="panel grid gap-3 rounded-2xl p-4"><input value={category} onChange={e=>setCategory(e.target.value)} placeholder="Category" className="w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg"/><select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg"><option>easy</option><option>medium</option><option>hard</option><option>expert</option></select><label className="text-sm text-muted">Words: {count}<input type="range" min={3} max={12} value={count} onChange={e=>setCount(Number(e.target.value))} className="mt-2 w-full"/></label><button disabled={busy} onClick={run} className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-semibold text-primary-foreground disabled:opacity-50"><WandSparkles className="size-5"/>{busy ? "Generating…" : "Generate word set"}</button>{note&&<p className="text-sm text-muted">{note}</p>}</div>
    {words.length>0&&<section className="panel rounded-2xl p-4"><h3 className="font-semibold text-fg">Validated words</h3><div className="mt-3 flex flex-wrap gap-2">{words.map(w=><span key={w} className="hud-chip text-fg">{w}</span>)}</div><div className="mt-4 flex flex-wrap gap-4"><button onClick={()=>go("creator")} className="text-sm text-primary">Open Creator Studio →</button><button onClick={()=>go("puzzleAudit")} className="text-sm text-primary">Run Puzzle QA →</button></div></section>}
    <button onClick={()=>go("more")} className="text-sm text-muted">Back to More</button>
  </div></Screen>;
}
