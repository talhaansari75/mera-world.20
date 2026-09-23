import { useEffect, useState } from "react";
import { useGame } from "@/lib/store";
import { Screen } from "./chrome";
import { getFeatureTestLabAccess } from "@/lib/server/admin";
import {
  Users, CreditCard, HardDrive, Settings, Accessibility, Globe2, Smartphone, Bell,
  Trophy, Crown, CalendarRange, CalendarDays, UsersRound, PenTool, WandSparkles,
  Mic, BrainCircuit, Route, User, Package, PawPrint, Flag, BookOpen, Languages,
  Trophy as LeaderboardIcon, CheckCircle2, XCircle, RotateCcw
} from "lucide-react";
import type { ScreenId } from "@/lib/game/types";

const FEATURES: Array<{ name: string; screen: ScreenId; icon: any }> = [
  { name: "Multiplayer", screen: "multiplayer", icon: Users },
  { name: "Payments", screen: "payments", icon: CreditCard },
  { name: "Rewarded Ads", screen: "rewardedAds", icon: Smartphone },
  { name: "Save & Recovery", screen: "saveSlots", icon: HardDrive },
  { name: "Settings", screen: "settings", icon: Settings },
  { name: "Accessibility", screen: "accessibility", icon: Accessibility },
  { name: "Languages", screen: "content", icon: Globe2 },
  { name: "Offline/PWA", screen: "pwa", icon: Smartphone },
  { name: "Push Notifications", screen: "pushSettings", icon: Bell },
  { name: "Achievements", screen: "achievements", icon: Trophy },
  { name: "Progression", screen: "progression", icon: Crown },
  { name: "Seasons", screen: "seasonProgress", icon: CalendarRange },
  { name: "Events", screen: "liveOps", icon: CalendarDays },
  { name: "Friends/Clans", screen: "social", icon: UsersRound },
  { name: "Creator", screen: "creator", icon: PenTool },
  { name: "AI Puzzle Lab", screen: "aiPuzzleLab", icon: WandSparkles },
  { name: "Voice", screen: "voice", icon: Mic },
  { name: "Smart Coach", screen: "coach", icon: BrainCircuit },
  { name: "Journey Planner", screen: "journeyPlanner", icon: Route },
  { name: "Profile", screen: "profile", icon: User },
  { name: "Inventory", screen: "inventory", icon: Package },
  { name: "Pets", screen: "pets", icon: PawPrint },
  { name: "Missions", screen: "missions", icon: Flag },
  { name: "Story", screen: "story", icon: BookOpen },
  { name: "Dictionary", screen: "dictionary", icon: Languages },
  { name: "Leaderboard", screen: "leaderboard", icon: LeaderboardIcon },
];

const KEY = "mera-world.feature-test-status";

export function FeatureTestLabScreen() {
  const go = useGame.getState().go;
  const goQa = useGame.getState().goQa;
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let live = true;
    void getFeatureTestLabAccess()
      .then((result) => { if (live) setAuthorized(Boolean(result.allowed)); })
      .catch(() => { if (live) setAuthorized(false); });
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (authorized === false) go("home");
  }, [authorized, go]);

  if (authorized === null) {
    return <Screen title="Feature Test Lab"><div className="panel rounded-2xl p-5 text-sm text-muted">Checking administrator access…</div></Screen>;
  }
  if (!authorized) return null;
  const [status, setStatus] = useState<Record<string, "pass" | "fail">>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
  });

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(status)), [status]);

  const mark = (name: string, value: "pass" | "fail") =>
    setStatus((s) => ({ ...s, [name]: value }));

  const reset = () => { localStorage.removeItem(KEY); setStatus({}); };

  const passed = Object.values(status).filter((v) => v === "pass").length;
  const failed = Object.values(status).filter((v) => v === "fail").length;

  return (
    <Screen title="Feature Test Lab">
      <div className="mb-4 panel rounded-3xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Temporary QA area</p>
            <h2 className="mt-1 font-display text-2xl text-fg">Administrator-only QA: test every player-facing game system (including monetization)</h2>
            <p className="mt-1 text-xs text-muted">Administrator-only testing. Open a feature, test it, then mark Pass or Fail. Results stay on this device until reset.</p>
          </div>
          <button type="button" onClick={reset} className="hud-chip flex items-center gap-1 text-xs text-fg"><RotateCcw className="size-3" /> Reset</button>
        </div>
        <div className="mt-4 flex gap-2 text-xs">
          <span className="rounded-full bg-green-500/15 px-3 py-1 text-green-300">{passed} passed</span>
          <span className="rounded-full bg-red-500/15 px-3 py-1 text-red-300">{failed} failed</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-muted">{FEATURES.length - passed - failed} untested</span>
        </div>
      </div>

      <div className="space-y-2">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          const state = status[feature.name];
          return (
            <div key={feature.name} className="panel rounded-2xl p-3">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-xs font-bold text-muted">{index + 1}</span>
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10"><Icon className="size-4 text-primary" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-fg">{feature.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted">{state || "Not tested"}</span>
                </span>
                <button type="button" className="hud-chip text-xs text-fg" onClick={() => goQa(feature.screen)}>Test</button>
              </div>
              <div className="mt-2 flex gap-2 pl-[6.75rem]">
                <button type="button" onClick={() => mark(feature.name, "pass")} className="flex items-center gap-1 text-xs text-green-300"><CheckCircle2 className="size-3" /> Pass</button>
                <button type="button" onClick={() => mark(feature.name, "fail")} className="flex items-center gap-1 text-xs text-red-300"><XCircle className="size-3" /> Fail</button>
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
