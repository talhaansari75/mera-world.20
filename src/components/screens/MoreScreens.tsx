import { useEffect, useMemo, useState } from "react";
import { useGame } from "@/lib/store";
import { Screen, useT } from "./chrome";
import { CHAPTERS, WORD_OF_DAY } from "@/lib/game/story";
import { CATEGORIES, CATEGORY_IDS, ALL_WORDS, categoryOf } from "@/lib/game/words";
import { getDailyBoard, getLeaderboard } from "@/lib/server/leaderboard";
import { todayKey } from "@/lib/game/levels";
import { BookOpen, BarChart3, Languages, Map, Scale, Sparkles, Swords, Trophy, User, Wrench, Home, Hammer, MessageCircle, Flag, ScrollText, Users, CalendarDays, Activity, ShieldCheck, CreditCard, Globe2, HardDrive, PenTool, Crown, CalendarRange, LineChart, Accessibility, Smartphone, Bell, BrainCircuit, Gauge, Route, Mic, WandSparkles, Eye, ClipboardCheck, PackageCheck, FileCheck2, Archive } from "lucide-react";

export function MoreScreen() {
  const t = useT();
  const go = useGame.getState().go;
  const items = [
    { id: "profile" as const, label: t("cta.profile"), icon: User },
    { id: "settings" as const, label: t("cta.settings"), icon: Wrench },
    { id: "stats" as const, label: t("cta.stats"), icon: BarChart3 },
    { id: "skills" as const, label: t("cta.skills"), icon: Sparkles },
    { id: "inventory" as const, label: t("cta.inventory"), icon: BookOpen },
    { id: "base" as const, label: "Camp", icon: Home },
    { id: "equipment" as const, label: "Forge", icon: Hammer },
    { id: "combat" as const, label: "Guardians", icon: Swords },
    { id: "worldMap" as const, label: "Atlas", icon: Map },
    { id: "npcs" as const, label: "Travelers", icon: MessageCircle },
    { id: "missions" as const, label: "Missions", icon: Flag },
    { id: "storyQuests" as const, label: "Story quests", icon: ScrollText },
    { id: "dictionary" as const, label: t("cta.dictionary"), icon: Languages },
    { id: "leaderboard" as const, label: t("cta.leaderboard"), icon: Trophy },
    { id: "social" as const, label: "Friends & Clans", icon: Users },
    { id: "multiplayer" as const, label: "Online Multiplayer", icon: Users },
    { id: "liveOps" as const, label: "Events & Challenges", icon: CalendarDays },
    { id: "content" as const, label: "Languages & Content", icon: Globe2 },
    { id: "systems" as const, label: "Systems & Diagnostics", icon: Activity },
    { id: "payments" as const, label: "Purchases & Entitlements", icon: CreditCard },
    { id: "admin" as const, label: "Admin Control", icon: ShieldCheck },
    { id: "saveSlots" as const, label: "Save Slots & Recovery", icon: HardDrive },
    { id: "creator" as const, label: "Creator Studio", icon: PenTool },
    { id: "progression" as const, label: "Mastery & Progression", icon: Crown },
    { id: "seasonProgress" as const, label: "Season Progress", icon: CalendarRange, LineChart },
    { id: "creatorCommunity" as const, label: "Creator Community", icon: PenTool },
    { id: "analytics" as const, label: "Player Analytics", icon: LineChart },
    { id: "accessibility" as const, label: "Accessibility Pro", icon: Accessibility },
    { id: "pwa" as const, label: "Offline, Install & Updates", icon: Smartphone },
    { id: "pushSettings" as const, label: "Push Delivery", icon: Bell },
    { id: "coach" as const, label: "Smart Coach", icon: BrainCircuit },
    { id: "adaptive" as const, label: "Adaptive Challenge", icon: Gauge },
    { id: "journeyPlanner" as const, label: "Journey Planner", icon: Route },
    { id: "voice" as const, label: "Voice Command Center", icon: Mic },
    { id: "aiPuzzleLab" as const, label: "AI Puzzle Lab", icon: WandSparkles },
    { id: "puzzleAudit" as const, label: "Puzzle QA Lab", icon: ShieldCheck },
    { id: "playablePreview" as const, label: "Playable Preview Studio", icon: Eye },
    { id: "creatorPlaytest" as const, label: "Creator Playtest", icon: Trophy },
    { id: "publishReadiness" as const, label: "Publish Readiness", icon: ClipboardCheck },
    { id: "releasePackage" as const, label: "Release Package", icon: PackageCheck },
    { id: "releaseVerifier" as const, label: "Release Verifier", icon: FileCheck2 },
    { id: "releaseArchive" as const, label: "Release Archive", icon: Archive },
    { id: "legal" as const, label: t("cta.legal"), icon: Scale },
  ];
  return (
    <Screen title={t("cta.more")}>
      <div className="flex flex-col gap-2">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            className="panel flex items-center gap-3 rounded-2xl p-4 text-left"
            onClick={() => go(it.id)}
          >
            <it.icon className="size-5 text-primary" />
            <span className="font-semibold text-fg">{it.label}</span>
          </button>
        ))}
      </div>
    </Screen>
  );
}

export function StoryScreen() {
  const t = useT();
  const unlocked = useGame((s) => s.save.unlockedLevel);
  return (
    <Screen title={t("story.title")}>
      <div className="flex flex-col gap-3">
        {CHAPTERS.map((c) => {
          const open = unlocked >= c.unlock;
          return (
            <article key={c.id} className="panel rounded-2xl p-4" style={{ opacity: open ? 1 : 0.45 }}>
              <p className="text-xs uppercase tracking-wider text-gold">Chapter {c.id + 1}</p>
              <h2 className="font-display mt-1 text-xl text-fg">{c.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{open ? c.body : "The page is still bound."}</p>
            </article>
          );
        })}
      </div>
    </Screen>
  );
}

export function DictionaryScreen() {
  const t = useT();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const wod = WORD_OF_DAY[new Date().getDate() % WORD_OF_DAY.length]!;
  const list = useMemo(() => {
    const pool = cat === "all" ? ALL_WORDS : (CATEGORIES[cat] ?? ALL_WORDS);
    const qq = q.trim().toUpperCase();
    return (qq ? pool.filter((w) => w.includes(qq)) : pool).slice(0, 80);
  }, [q, cat]);
  return (
    <Screen title={t("cta.dictionary")}>
      <div className="panel mb-4 rounded-2xl p-4">
        <p className="text-xs uppercase tracking-wider text-gold">Word of the day</p>
        <p className="font-display text-2xl text-fg">{wod.word}</p>
        <p className="text-sm text-muted">{wod.meaning}</p>
      </div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the atlas"
        className="mb-2 w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg"
      />
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        <button type="button" className="hud-chip text-fg" onClick={() => setCat("all")}>
          all
        </button>
        {CATEGORY_IDS.slice(0, 12).map((id) => (
          <button key={id} type="button" className="hud-chip shrink-0 text-fg" onClick={() => setCat(id)}>
            {id}
          </button>
        ))}
      </div>
      <ul className="columns-2 gap-3 text-sm text-fg">
        {list.map((w) => (
          <li key={w} className="mb-1">
            {w}
            <span className="text-muted"> {categoryOf(w)}</span>
          </li>
        ))}
      </ul>
    </Screen>
  );
}

export function LeaderboardScreen() {
  const t = useT();
  const [board, setBoard] = useState<"stars" | "words" | "daily">("stars");
  const [rows, setRows] = useState<Array<{ display_name: string; score: number }>>([]);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        if (board === "daily") {
          const data = await getDailyBoard({ data: todayKey() });
          if (live) setRows(data.map((r) => ({ display_name: r.display_name, score: r.score })));
        } else {
          const data = await getLeaderboard({ data: board });
          if (live) setRows(data);
        }
      } catch {
        if (live) setRows([]);
      }
    })();
    return () => {
      live = false;
    };
  }, [board]);
  return (
    <Screen title={t("cta.leaderboard")}>
      <div className="mb-3 flex gap-2">
        {(["stars", "words", "daily"] as const).map((b) => (
          <button key={b} type="button" className="hud-chip capitalize text-fg" onClick={() => setBoard(b)}>
            {b}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="text-muted">The hall is still quiet. Sign in after a clear to leave a mark.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {rows.map((r, i) => (
            <li key={`${r.display_name}-${i}`} className="panel flex items-center justify-between rounded-xl p-3">
              <span className="text-fg">
                {i + 1}. {r.display_name}
              </span>
              <span className="text-gold">{r.score}</span>
            </li>
          ))}
        </ol>
      )}
    </Screen>
  );
}

export function LegalScreen() {
  const t = useT();
  return (
    <Screen title={t("cta.legal")}>
      <article className="prose-like space-y-4 text-sm leading-relaxed text-muted">
        <h2 className="font-display text-xl text-fg">Terms of travel</h2>
        <p>
          Mera Word Search Journey is a free, ad-free atlas. Play as a guest. Optional sign-in stores a cloud copy of
          your progress and lets you appear on the hall of names. You may export or delete local progress at any time
          from Settings.
        </p>
        <h2 className="font-display text-xl text-fg">Quiet ledger (privacy)</h2>
        <p>
          Offline play stays on this device. If you sign in, we store your save blob, display name, and leaderboard
          scores, scoped to your account. We do not sell data. Optional AI riddles are user-initiated and sent without
          your full save. Account deletion is available through your signed-in profile tools.
        </p>
        <p>No ads. No forced login. Progress is yours to keep, export, or erase.</p>
      </article>
    </Screen>
  );
}
