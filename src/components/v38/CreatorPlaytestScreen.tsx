import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, Timer, Trophy, XCircle } from "lucide-react";
import { Screen } from "@/components/screens/chrome";
import { GridBoard } from "@/components/play/GridBoard";
import { buildPlayablePreview } from "@/lib/v37/preview/playablePreview";
import { listDrafts, type CreatorDraft } from "@/lib/v24/creator/creatorService";
import { matchPlaytestPath, savePlaytestResult, scorePlaytest } from "@/lib/v38/playtest/playtest";
import { useGame } from "@/lib/store";

export function CreatorPlaytestScreen() {
  const go = useGame.getState().go;
  const [drafts] = useState<CreatorDraft[]>(() => listDrafts().filter(d => d.status !== "archived"));
  const [selected, setSelected] = useState(drafts[0]?.id || "");
  const draft = useMemo(() => drafts.find(d => d.id === selected), [drafts, selected]);
  const [puzzle, setPuzzle] = useState(() => draft ? buildPlayablePreview({ words: draft.words, title: draft.title, category: draft.category, seed: hash(draft.id) }).puzzle : null);
  const [found, setFound] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!draft) return;
    const result = buildPlayablePreview({ words: draft.words, title: draft.title, category: draft.category, seed: hash(draft.id) });
    setPuzzle(result.puzzle); setFound([]); setMistakes(0); setDone(false); setStartedAt(Date.now()); setElapsed(0);
  }, [selected]);
  useEffect(() => {
    if (done || !puzzle) return;
    const id = window.setInterval(() => setElapsed(Date.now() - startedAt), 1000);
    return () => window.clearInterval(id);
  }, [done, puzzle, startedAt]);

  const restart = () => { setFound([]); setMistakes(0); setDone(false); setStartedAt(Date.now()); setElapsed(0); };
  const onPath = (letters: string, cells: Array<[number, number]>) => {
    if (!puzzle) return "miss" as const;
    const word = matchPlaytestPath(puzzle, letters, cells, found);
    if (!word) { setMistakes(x => x + 1); return "miss" as const; }
    const next = [...found, word]; setFound(next);
    if (next.length === puzzle.placements.length) {
      const totalMs = Date.now() - startedAt; setElapsed(totalMs); setDone(true);
      savePlaytestResult({ puzzleId: selected, title: draft?.title || "Creator puzzle", completed: true, elapsedMs: totalMs, mistakes: mistakes, found: next, score: scorePlaytest(next.length, totalMs, mistakes), testedAt: Date.now() });
    }
    return "found" as const;
  };
  const remaining = puzzle ? Math.max(0, puzzle.placements.length - found.length) : 0;
  return <Screen title="Creator Playtest"><div className="grid gap-4">
    <section className="panel rounded-2xl p-5"><p className="text-xs uppercase tracking-wider text-primary">V38 creator QA</p><h2 className="font-display mt-1 text-2xl text-fg">Play your puzzle before publishing</h2><p className="mt-2 text-sm text-muted">This is a real interaction test: solve every placed word, measure time and mistakes, and keep a local playtest result.</p></section>
    <section className="panel rounded-2xl p-4"><select value={selected} onChange={e=>setSelected(e.target.value)} className="w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg"><option value="">Choose a Creator draft</option>{drafts.map(d=><option key={d.id} value={d.id}>{d.title} · {d.words.length} words</option>)}</select>{!draft&&<p className="mt-3 text-sm text-muted">Create a playable draft in Creator Studio first.</p>}</section>
    {puzzle&&<section className="panel rounded-2xl p-4"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-display text-xl text-fg">{draft?.title}</h3><p className="text-sm text-muted">{remaining} words remaining · {mistakes} mistakes</p></div><span className="hud-chip flex items-center gap-2 text-fg"><Timer className="size-4"/>{Math.floor(elapsed/60000)}:{String(Math.floor(elapsed/1000)%60).padStart(2,"0")}</span></div><GridBoard puzzle={puzzle} found={found} revealed={[]} tileStyle="carved" disabled={done} onPath={onPath}/><div className="mt-4 flex flex-wrap gap-2">{puzzle.words.map(w=><span key={w} className={`hud-chip ${found.includes(w)?"opacity-50 line-through":""} text-fg`}>{w}</span>)}</div><button onClick={restart} className="mt-4 flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-fg"><RotateCcw className="size-4"/>Restart test</button>{done&&<div className="mt-4 rounded-2xl border border-border p-4"><div className="flex items-center gap-2 text-fg"><Trophy className="size-5 text-primary"/><b>Playtest complete</b><CheckCircle2 className="size-5"/></div><p className="mt-2 text-sm text-muted">Score: {scorePlaytest(found.length, elapsed, mistakes)}/100 · {mistakes} mistakes · {Math.round(elapsed/1000)} seconds</p></div>}</section>}
    <div className="flex flex-wrap gap-4"><button onClick={()=>go("playablePreview")} className="text-sm text-primary">← Playable Preview Studio</button><button onClick={()=>go("creator")} className="text-sm text-primary">Creator Studio →</button></div>
  </div></Screen>;
}
function hash(s:string){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;}
