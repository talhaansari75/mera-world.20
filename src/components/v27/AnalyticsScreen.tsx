import { useMemo } from "react";
import { Download, Eye, ShieldCheck, Sparkles } from "lucide-react";
import { useGame } from "@/lib/store";
import { Screen } from "@/components/screens/chrome";
import { analyticsCsv, buildAnalytics } from "@/lib/v27/analytics/analyticsEngine";

export function AnalyticsScreen() {
  const save = useGame((s) => s.save);
  const snapshot = useMemo(() => buildAnalytics(save), [save]);
  const exportCsv = () => {
    const blob = new Blob([analyticsCsv(snapshot)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mera-word-search-analytics.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const cards = [
    ["Win rate", `${snapshot.winRate}%`], ["Perfect clears", `${snapshot.perfectRate}%`],
    ["Words / game", snapshot.wordsPerGame], ["Avg. session", `${snapshot.averagePlayMinutes} min`],
    ["Hints / game", snapshot.hintsPerGame], ["Levels", snapshot.levelsCompleted],
    ["Bosses", snapshot.bossWins], ["Best streak", snapshot.bestStreak],
  ];
  return (
    <Screen title="Player Analytics">
      <div className="panel mb-4 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-fg"><Eye className="size-5 text-primary" /><strong>Private by default</strong></div>
        <p className="mt-2 text-sm text-muted">These insights are calculated from your local save. No raw gameplay history is uploaded by this dashboard.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {cards.map(([label, value]) => <div key={String(label)} className="panel rounded-2xl p-3"><p className="text-xs text-muted">{label}</p><p className="mt-1 font-display text-xl text-fg">{value}</p></div>)}
      </div>
      <div className="panel mt-3 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-fg"><Sparkles className="size-5 text-gold" /><strong>Journey signals</strong></div>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>• {snapshot.gamesPlayed} recorded game sessions</li>
          <li>• {snapshot.dailyCompletions} daily challenges completed</li>
          <li>• Current streak: {snapshot.currentStreak} days</li>
          <li>• Average session: {snapshot.averagePlayMinutes} minutes</li>
        </ul>
      </div>
      <button type="button" onClick={exportCsv} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 font-semibold text-primary-foreground"><Download className="size-4" /> Export analytics CSV</button>
      <div className="mt-3 flex items-start gap-2 rounded-2xl border border-border p-3 text-xs text-muted"><ShieldCheck className="mt-0.5 size-4 shrink-0" /> Export contains aggregated counters only, not puzzle text, account credentials, or secrets.</div>
    </Screen>
  );
}
