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
  const [category, setCategory] = useState<string | null>(null);

  const categories = [
    {
      id: "profile",
      title: "Profile",
      description: "Your identity and personal progress",
      icon: User,
      items: [
        { id: "profile" as const, label: t("cta.profile"), icon: User },
        { id: "stats" as const, label: t("cta.stats"), icon: BarChart3 },
        { id: "skills" as const, label: t("cta.skills"), icon: Sparkles },
      ],
    },
    {
      id: "journey",
      title: "Journey",
      description: "Explore, battle and continue your adventure",
      icon: Map,
      items: [
        { id: "base" as const, label: "Camp", icon: Home },
        { id: "worldMap" as const, label: "Atlas", icon: Map },
        { id: "missions" as const, label: "Missions", icon: Flag },
        { id: "storyQuests" as const, label: "Story Quests", icon: ScrollText },
        { id: "npcs" as const, label: "Travelers", icon: MessageCircle },
        { id: "combat" as const, label: "Guardians", icon: Swords },
        { id: "equipment" as const, label: "Forge", icon: Hammer },
        { id: "dictionary" as const, label: t("cta.dictionary"), icon: Languages },
      ],
    },
    {
      id: "progress",
      title: "Progress",
      description: "Achievements, mastery, seasons and rankings",
      icon: Trophy,
      items: [
        { id: "achievements" as const, label: "Achievements", icon: Trophy },
        { id: "progression" as const, label: "Mastery & Progression", icon: Crown },
        { id: "seasonProgress" as const, label: "Season Progress", icon: CalendarRange },
        { id: "liveOps" as const, label: "Events & Challenges", icon: CalendarDays },
        { id: "leaderboard" as const, label: t("cta.leaderboard"), icon: Trophy },
      ],
    },
    {
      id: "collection",
      title: "Collection",
      description: "Items, pets and your in-game resources",
      icon: BookOpen,
      items: [
        { id: "inventory" as const, label: t("cta.inventory"), icon: BookOpen },
        { id: "pets" as const, label: "Pets", icon: Sparkles },
        { id: "shop" as const, label: "Shop", icon: CreditCard },
      ],
    },
    {
      id: "social",
      title: "Social",
      description: "Connect, compete and play together",
      icon: Users,
      items: [
        { id: "social" as const, label: "Friends & Clans", icon: Users },
        { id: "multiplayer" as const, label: "Online Multiplayer", icon: Swords },
      ],
    },
    {
      id: "smart",
      title: "Smart",
      description: "Personalized tools and intelligent gameplay",
      icon: BrainCircuit,
      items: [
        { id: "coach" as const, label: "Smart Coach", icon: BrainCircuit },
        { id: "adaptive" as const, label: "Adaptive Challenge", icon: Gauge },
        { id: "journeyPlanner" as const, label: "Journey Planner", icon: Route },
        { id: "voice" as const, label: "Voice Command Center", icon: Mic },
      ],
    },
    {
      id: "creator",
      title: "Creator",
      description: "Create, test and manage game content",
      icon: PenTool,
      items: [
        { id: "creator" as const, label: "Creator Studio", icon: PenTool },
        { id: "creatorCommunity" as const, label: "Creator Community", icon: Users },
        { id: "aiPuzzleLab" as const, label: "AI Puzzle Lab", icon: WandSparkles },
        { id: "puzzleAudit" as const, label: "Puzzle QA Lab", icon: ShieldCheck },
        { id: "playablePreview" as const, label: "Playable Preview", icon: Eye },
        { id: "creatorPlaytest" as const, label: "Creator Playtest", icon: Trophy },
      ],
    },
    {
      id: "release",
      title: "Release",
      description: "Prepare and verify your releases",
      icon: PackageCheck,
      items: [
        { id: "publishReadiness" as const, label: "Publish Readiness", icon: ClipboardCheck },
        { id: "releasePackage" as const, label: "Release Package", icon: PackageCheck },
        { id: "releaseVerifier" as const, label: "Release Verifier", icon: FileCheck2 },
        { id: "releaseArchive" as const, label: "Release Archive", icon: Archive },
      ],
    },
    {
      id: "settings",
      title: "Settings",
      description: "Customize your game experience",
      icon: Wrench,
      items: [
        { id: "settings" as const, label: t("cta.settings"), icon: Wrench },
        { id: "accessibility" as const, label: "Accessibility", icon: Accessibility },
        { id: "content" as const, label: "Languages & Content", icon: Globe2 },
        { id: "pwa" as const, label: "Offline & Updates", icon: Smartphone },
        { id: "pushSettings" as const, label: "Push Notifications", icon: Bell },
      ],
    },
    {
      id: "account",
      title: "Account",
      description: "Saves, purchases and account data",
      icon: HardDrive,
      items: [
        { id: "saveSlots" as const, label: "Save & Recovery", icon: HardDrive },
        { id: "payments" as const, label: "Purchases & Entitlements", icon: CreditCard },
      ],
    },
    {
      id: "system",
      title: "System",
      description: "Diagnostics, analytics and administration",
      icon: Activity,
      items: [
        { id: "systems" as const, label: "Systems & Diagnostics", icon: Activity },
        { id: "analytics" as const, label: "Player Analytics", icon: LineChart },
        { id: "admin" as const, label: "Admin Control", icon: ShieldCheck },
      ],
    },
    {
      id: "help",
      title: "Help & Legal",
      description: "Terms, privacy and important information",
      icon: Scale,
      items: [
        { id: "legal" as const, label: t("cta.legal"), icon: Scale },
      ],
    },
  ];

  const activeCategory = categories.find((c) => c.id === category);

  return (
    <Screen title={t("cta.more")}>
      {!activeCategory ? (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className="panel group flex min-h-[128px] flex-col items-start justify-between rounded-2xl p-4 text-left transition-transform active:scale-[0.97]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-surface-2">
                <item.icon className="size-5 text-primary" />
              </span>

              <span className="mt-3 min-w-0">
                <span className="block text-sm font-bold text-fg">
                  {item.title}
                </span>
                <span className="mt-1 block text-[11px] leading-snug text-muted">
                  {item.description}
                </span>
              </span>

              <span className="mt-2 text-xs text-muted">
                {item.items.length} features →
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center gap-3">
            <button
              type="button"
              className="hud-chip flex size-10 items-center justify-center p-0 text-lg text-fg"
              onClick={() => setCategory(null)}
              aria-label="Back to More categories"
            >
              ←
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <activeCategory.icon className="size-5 text-primary" />
                <h2 className="text-lg font-bold text-fg">
                  {activeCategory.title}
                </h2>
              </div>

              <p className="mt-1 text-xs text-muted">
                {activeCategory.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {activeCategory.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="panel flex items-center gap-3 rounded-2xl p-3.5 text-left transition-transform active:scale-[0.98]"
                onClick={() => go(item.id)}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-2">
                  <item.icon className="size-5 text-primary" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-fg">
                    {item.label}
                  </span>
                </span>

                <span className="text-lg text-muted">›</span>
              </button>
            ))}
          </div>
        </div>
      )}
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
