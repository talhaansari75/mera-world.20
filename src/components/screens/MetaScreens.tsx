import { useState } from "react";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useGame, playerLevel, xpForLevel } from "@/lib/store";
import { Screen, HudChips, useT } from "./chrome";
import { SHOP, SPIN_TABLE } from "@/lib/game/economy";
import { PETS } from "@/lib/game/pets";
import { THEMES, AVATARS, CLASSES } from "@/lib/game/themes";
import { ACHIEVEMENTS, achievementProgress } from "@/lib/game/achievements";
import { LANGS, t as tr } from "@/lib/game/i18n";
import { applyVolumes, startMusic, stopMusic } from "@/lib/game/audio";
import { todayKey } from "@/lib/game/levels";
import { dailyChallengeFor } from "@/lib/game/dailyChallenges";
import { MAX_ENERGY } from "@/lib/game/constants";
import type { GameSettings, PetId, ThemeId } from "@/lib/game/types";
import type { EquipmentSlot } from "@/lib/game/baseCrafting";
import { buildingUpgradeCost } from "@/lib/game/baseCrafting";
import { loadCloudSave, pushCloudSave } from "@/lib/server/cloud";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { Link } from "@tanstack/react-router";
import { BUILDINGS } from "@/lib/game/baseCrafting";

function CloudRow() {
  const signedIn = Boolean(useCurrentUser()?.id);
  return <div className="panel rounded-2xl p-4 text-sm text-muted">{signedIn ? "Cloud account connected." : "Sign in to enable cloud save."}</div>;
}

export function ShopScreen() {
  const t = useT();
  const owned = useGame((s) => s.save.ownedThemes);
  return (
    <Screen title={t("shop.title")}>
      <HudChips />
      <div className="mt-4 flex flex-col gap-2">
        {SHOP.map((item) => (
          <button
            key={item.id}
            type="button"
            className="panel flex items-center justify-between rounded-2xl p-4 text-left"
            onClick={() => useGame.getState().buy(item.id)}
          >
            <span>
              <span className="block font-semibold text-fg">{item.name}</span>
              <span className="text-xs text-muted">
                {"theme" in item && item.theme && owned.includes(item.theme as ThemeId) ? "Owned" : item.kind}
              </span>
            </span>
            <span className="text-sm font-semibold text-gold">
              {item.coins ? `${item.coins}c` : ""}
              {item.diamonds ? `${item.diamonds}d` : ""}
            </span>
          </button>
        ))}
      </div>
    </Screen>
  );
}

export function PetsScreen() {
  const t = useT();
  const save = useGame((s) => s.save);
  return (
    <Screen title={t("pets.title")}>
      <div className="flex flex-col gap-2">
        {PETS.map((p) => {
          const owned = save.ownedPets.includes(p.id);
          const on = save.equippedPet === p.id;
          return (
            <div key={p.id} className="panel rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-fg">{p.name}</p>
                  <p className="text-xs uppercase tracking-wider text-accent">{p.role}</p>
                  <p className="mt-1 text-sm text-muted">{p.blurb}</p>
                </div>
                {owned ? (
                  <div className="flex flex-col items-end gap-2">
                    <button type="button" className="hud-chip text-fg" onClick={() => useGame.getState().equipPet(p.id as PetId)}>
                      {on ? "With you" : "Travel"}
                    </button>
                    <button
                      type="button"
                      className="hud-chip text-gold"
                      onClick={() => useGame.getState().upgradePet(p.id as PetId)}
                    >
                      Lv {save.petLevels[p.id] ?? 1} · Upgrade
                    </button>
                  </div>
                ) : (
                  <button type="button" className="hud-chip text-gold" onClick={() => useGame.getState().buyPet(p.id)}>
                    {p.coins ? `${p.coins}c` : `${p.diamonds}d`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}

export function ProfileScreen() {
  const t = useT();
  const save = useGame((s) => s.save);
  const user = useCurrentUser();
  const lv = playerLevel(save.xp);
  const next = xpForLevel(lv + 1);
  const xpBase = xpForLevel(lv);
  const progress = Math.min(100, Math.max(0, ((save.xp - xpBase) / Math.max(1, next - xpBase)) * 100));

  return (
    <Screen title={t("profile.title")}>
      <div className="space-y-4 pb-8">
        <section className="panel overflow-hidden rounded-3xl p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="grid size-20 shrink-0 place-items-center rounded-3xl bg-primary/15 text-4xl">
              {save.avatarId === "ink-1" ? "🪶" : save.avatarId === "ink-2" ? "🏮" : save.avatarId === "ink-3" ? "🧭" : "✨"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.18em] text-accent">Traveler Profile</p>
              <h2 className="mt-1 truncate font-display text-2xl text-fg">{save.playerName || "Traveler"}</h2>
              <p className="mt-1 truncate text-sm text-muted">@{user?.username || user?.displayName || save.playerName || "traveler"}</p>
              {user?.primaryEmail && <p className="mt-0.5 truncate text-xs text-muted">{user.primaryEmail}</p>}
            </div>
            <div className="rounded-2xl bg-surface-2 px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted">Level</p>
              <p className="font-display text-2xl text-fg">{lv}</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-1 flex justify-between text-xs text-muted">
              <span>{save.xp} XP</span><span>{next} XP</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              ["Words", save.stats.wordsFound],
              ["Games", save.stats.gamesPlayed],
              ["Wins", save.stats.gamesWon],
              ["Hours", (save.stats.playTimeMs / 3600000).toFixed(1)],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl bg-surface-2 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
                <p className="mt-1 text-lg font-bold text-fg">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-wider text-accent">Identity</p>
          <label className="mt-3 block text-xs text-muted">Display name</label>
          <input
            className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-3 text-fg"
            value={save.playerName}
            maxLength={24}
            onChange={(e) => useGame.getState().setName(e.target.value)}
          />
          <div className="mt-3 grid gap-2 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 p-3">
              <span className="text-muted">Account</span><span className="max-w-[65%] truncate text-fg">{user?.primaryEmail || "Local profile"}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-2 p-3">
              <span className="text-muted">Class</span><span className="capitalize text-fg">{save.classId}</span>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">Choose your class</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CLASSES.map((c) => {
              const selected = save.classId === c.id;
              return (
                <button key={c.id} type="button" className="panel rounded-2xl p-4 text-left" onClick={() => useGame.getState().patchSave((s: any) => ({ ...s, classId: c.id }))} style={selected ? { outline: "2px solid var(--color-primary)" } : undefined}>
                  <p className="font-semibold text-fg">{c.name}{selected ? " ✓" : ""}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{c.blurb}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">Avatar</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {AVATARS.map((a) => {
              const icons: Record<string, string> = {"ink-1":"🪶","ink-2":"🏮","ink-3":"🧭","ink-4":"⚓","ink-5":"🦅","ink-6":"🪷","ink-7":"🌙","ink-8":"⛰️","ink-9":"🌊","ink-10":"⭐","ink-11":"🍃","ink-12":"🔥"};
              const selected = save.avatarId === a.id;
              return <button key={a.id} type="button" onClick={() => useGame.getState().setAvatar(a.id)} className="panel flex aspect-square flex-col items-center justify-center rounded-2xl text-xs text-fg" style={selected ? { outline: "2px solid var(--color-primary)" } : undefined}><span className="text-2xl">{icons[a.id] ?? "✨"}</span><span className="mt-1 text-[10px] opacity-80">{a.label}</span></button>;
            })}
          </div>
        </section>

        <div className="flex items-center justify-between gap-3">
          <SignedIn><UserButton /></SignedIn>
          <SignedOut><Link to="/login" className="btn-primary max-w-xs">{t("cta.signIn")}</Link></SignedOut>
        </div>
        <CloudRow />
      </div>
    </Screen>
  );
}

export function SettingsScreen() {
  const t = useT();
  const s = useGame((s) => s.save.settings);
  const lang = useGame((s) => s.save.language);
  const set = useGame.getState().setSetting;
  const [category, setCategory] = useState<string | null>(null);

  const toggle = (k: keyof GameSettings) => {
    const next = !s[k];
    set(k, next as never);

    if (k === "music") {
      applyVolumes({ musicOn: next });
      if (next) startMusic();
      else stopMusic();
    }

    if (k === "sfx") applyVolumes({ sfxOn: next });
  };

  const categories = [
    {
      id: "gameplay",
      icon: "🎮",
      title: "Gameplay",
      description: "Game behavior and play options",
    },
    {
      id: "audio",
      icon: "🔊",
      title: "Audio",
      description: "Music, sound effects and haptics",
    },
    {
      id: "appearance",
      icon: "🎨",
      title: "Appearance",
      description: "Theme and tile style",
    },
    {
      id: "accessibility",
      icon: "♿",
      title: "Accessibility",
      description: "Display, motion and reading options",
    },
    {
      id: "language",
      icon: "🌐",
      title: "Language",
      description: "Choose your language",
    },
    {
      id: "data",
      icon: "💾",
      title: "Data",
      description: "Export, import or reset your save",
    },
  ];

  const renderCategory = () => {
    switch (category) {
      case "gameplay":
        return (
          <>
            <SettingHeader title="Gameplay" onBack={() => setCategory(null)} />
            <ToggleRow
              label="Personalized gameplay"
              on={s.personalization}
              onClick={() => toggle("personalization")}
            />
            <p className="-mt-1 mb-3 text-xs text-muted">
              Uses only in-game behavior such as pace, hints, combos, pets and challenges.
            </p>
            <ToggleRow label="Show timer" on={s.showTimer} onClick={() => toggle("showTimer")} />
            <ToggleRow label="Grid lines" on={s.gridLines} onClick={() => toggle("gridLines")} />
          </>
        );

      case "audio":
        return (
          <>
            <SettingHeader title="Audio" onBack={() => setCategory(null)} />
            <ToggleRow label="Sound effects" on={s.sfx} onClick={() => toggle("sfx")} />
            <ToggleRow label="Music" on={s.music} onClick={() => toggle("music")} />
            <ToggleRow label="Haptics" on={s.haptics} onClick={() => toggle("haptics")} />
          </>
        );

      case "appearance":
        return (
          <>
            <SettingHeader title="Appearance" onBack={() => setCategory(null)} />

            <p className="text-xs text-muted">Tile style</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["carved", "ink", "neon"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  className="hud-chip text-fg capitalize"
                  onClick={() => set("tileStyle", st)}
                >
                  {st}
                </button>
              ))}
            </div>

            <p className="mt-5 text-xs text-muted">Theme</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  type="button"
                  className="panel rounded-xl p-3 text-left"
                  onClick={() => useGame.getState().equipTheme(th.id as ThemeId)}
                >
                  <span className="block text-sm font-semibold text-fg">{th.name}</span>
                </button>
              ))}
            </div>
          </>
        );

      case "accessibility":
        return (
          <>
            <SettingHeader title="Accessibility" onBack={() => setCategory(null)} />
            <ToggleRow label="Reduced motion" on={s.reducedMotion} onClick={() => toggle("reducedMotion")} />
            <ToggleRow label="High contrast" on={s.highContrast} onClick={() => toggle("highContrast")} />
            <ToggleRow label="Larger type" on={s.largeText} onClick={() => toggle("largeText")} />
            <ToggleRow label="Force RTL" on={s.rtlForce} onClick={() => toggle("rtlForce")} />
          </>
        );

      case "language":
        return (
          <>
            <SettingHeader title="Language" onBack={() => setCategory(null)} />
            <label className="text-xs text-muted">App language</label>
            <select
              className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-3 text-fg"
              value={lang}
              onChange={(e) => useGame.getState().setLang(e.target.value as typeof lang)}
            >
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {tr(l, `lang.${l}`)}
                </option>
              ))}
            </select>
          </>
        );

      case "data":
        return (
          <>
            <SettingHeader title="Data" onBack={() => setCategory(null)} />

            <button
              type="button"
              className="btn-ghost"
              onClick={() => {
                const blob = new Blob([useGame.getState().exportJson()], {
                  type: "application/json",
                });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "mera-word-search.json";
                a.click();
              }}
            >
              Export save
            </button>

            <label className="btn-ghost mt-2">
              Import save
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  useGame.getState().importJson(await file.text());
                }}
              />
            </label>

            <button
              type="button"
              className="btn-ghost mt-2 text-danger"
              onClick={() => useGame.getState().resetProgress()}
            >
              Reset progress
            </button>
          </>
        );

      default:
        return (
          <div className="mt-4 flex flex-col gap-3">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className="panel flex items-center gap-4 rounded-2xl p-4 text-left"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-fg">{item.title}</span>
                  <span className="mt-1 block text-xs text-muted">{item.description}</span>
                </span>
                <span className="text-lg text-muted">›</span>
              </button>
            ))}
          </div>
        );
    }
  };

  return (
    <Screen title={t("settings.title")}>
      {renderCategory()}
    </Screen>
  );
}

function SettingHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <button type="button" className="hud-chip text-fg" onClick={onBack}>
        ←
      </button>
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
    </div>
  );
}

function ToggleRow({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between py-3 text-fg">
      <span>{label}</span>
      <span className="hud-chip">{on ? "On" : "Off"}</span>
    </button>
  );
}

export function AchievementsScreen() {
  const t = useT();
  const save = useGame((s) => s.save);
  return (
    <Screen title={t("cta.achievements")}>
      <div className="flex flex-col gap-2">
        {ACHIEVEMENTS.map((a) => {
          const p = achievementProgress(a, save.stats);
          const claimed = save.claimedAchievements.includes(a.id);
          return (
            <div key={a.id} className="panel rounded-2xl p-4" style={{ opacity: p.done ? 1 : 0.55 }}>
              <p className="font-semibold text-fg">{a.title}</p>
              <p className="text-sm text-muted">{a.description}</p>
              <p className="mt-1 text-xs text-muted">
                {p.value}/{a.target} · +{a.reward} coins
              </p>
              {p.done && (
                <button
                  type="button"
                  className="hud-chip mt-2 text-fg"
                  disabled={claimed}
                  onClick={() => useGame.getState().claimAchievement(a.id)}
                >
                  {claimed ? "Claimed" : "Claim reward"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Screen>
  );
}

export function StatsScreen() {
  const t = useT();
  const st = useGame((s) => s.save.stats);
  const save = useGame((s) => s.save);
  const rows: Array<[string, string | number]> = [
    ["Games played", st.gamesPlayed],
    ["Games won", st.gamesWon],
    ["Words found", st.wordsFound],
    ["Hints used", st.hintsUsed],
    ["Current streak", st.currentStreak],
    ["Best streak", st.bestStreak],
    ["Perfect clears", st.perfectClears],
    ["Coins earned", st.coinsEarned],
    ["Daily challenges", st.dailyCompleted],
    ["Bosses defeated", st.bossesDefeated],
  ];
  return (
    <Screen title="Player Ledger">
      <div className="space-y-4 pb-8">
        <section className="panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-accent">Journey ledger</p>
          <h2 className="mt-1 font-display text-2xl text-fg">{save.playerName}</h2>
          <p className="mt-1 text-sm text-muted">Your recorded progress, milestones and play history.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-2xl bg-surface-2 p-3"><p className="text-xs text-muted">Level</p><p className="text-xl font-bold text-fg">{playerLevel(save.xp)}</p></div>
            <div className="rounded-2xl bg-surface-2 p-3"><p className="text-xs text-muted">XP</p><p className="text-xl font-bold text-fg">{save.xp}</p></div>
            <div className="rounded-2xl bg-surface-2 p-3"><p className="text-xs text-muted">Play time</p><p className="text-xl font-bold text-fg">{(st.playTimeMs / 3600000).toFixed(1)}h</p></div>
            <div className="rounded-2xl bg-surface-2 p-3"><p className="text-xs text-muted">Levels</p><p className="text-xl font-bold text-fg">{st.levelsCompleted}</p></div>
          </div>
        </section>
        <section className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {rows.map(([label, value]) => <div key={label} className="panel rounded-2xl p-4"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-2xl font-display text-fg">{value}</p></div>)}
        </section>
      </div>
    </Screen>
  );
}

export function SkillsScreen() {
  const t = useT();
  const save = useGame((s) => s.save);
  return (
    <Screen title={t("cta.skills")}>
      <p className="mb-3 text-sm text-muted">{save.skillPoints} points to spend</p>
      {(["speed", "vision", "luck"] as const).map((k) => (
        <div key={k} className="panel mb-2 flex items-center justify-between rounded-2xl p-4">
          <div>
            <p className="capitalize font-semibold text-fg">{k}</p>
            <p className="text-sm text-muted">{save.skills[k]} / 10</p>
          </div>
          <button type="button" className="hud-chip text-fg" onClick={() => useGame.getState().spendSkill(k)}>
            Train
          </button>
        </div>
      ))}
    </Screen>
  );
}

export function InventoryScreen() {
  const t = useT();
  const inv = useGame((s) => s.save.inventory);
  return (
    <Screen title={t("cta.inventory")}>
      {inv.length === 0 ? (
        <p className="text-muted">The satchel is light.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {inv.map((id: any) => (
            <li key={id} className="panel rounded-xl p-3 text-fg">
              {id}
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}

export function SpinScreen() {
  const t = useT();
  const last = useGame((s) => s.save.lastSpin);
  const [result, setResult] = useState<string | null>(null);
  const free = last !== todayKey();
  return (
    <Screen title={t("spin.title")}>
      <p className="text-sm text-muted">{free ? "First spin today is free." : "Further spins cost 25 coins."}</p>
      <button
        type="button"
        className="btn-primary mt-6"
        onClick={() => setResult(useGame.getState().spin())}
      >
        {t("cta.spinNow")}
      </button>
      {result && <p className="mt-4 text-center font-display text-2xl text-gold">{result}</p>}
      <ul className="mt-6 space-y-1 text-sm text-muted">
        {SPIN_TABLE.map((r) => (
          <li key={r.label}>
            {r.label} · weight {r.w}
          </li>
        ))}
      </ul>
    </Screen>
  );
}

export function DailyScreen() {
  const t = useT();
  const day = todayKey();
  const done = useGame((s) => s.save.lastDaily === day);
  const challenge = dailyChallengeFor(day);
  return (
    <Screen title={t("daily.title")}>
      <p className="text-sm text-muted">A seeded 12×12 for {day}. One proud clear per day.</p>
      <div className="panel mt-4 rounded-2xl p-4">
        <div className="text-xs uppercase tracking-[0.16em] text-gold">Today’s variation</div>
        <div className="mt-1 text-lg font-semibold text-fg">{challenge.icon} {challenge.title}</div>
        <p className="mt-1 text-sm text-muted">{challenge.description}</p>
        <div className="mt-2 text-xs text-accent">Reward boost up to +{Math.round((challenge.rewardMultiplier - 1) * 100)}%</div>
      </div>
      <button
        type="button"
        className="btn-primary mt-6"
        disabled={done}
        onClick={() => useGame.getState().startDaily()}
      >
        {done ? "Already inked" : t("cta.start")}
      </button>
    </Screen>
  );
}


export function BaseScreen() {
  const save = useGame((s) => s.save);
  const upgrade = useGame((s) => s.upgradeBuilding);
  return (
    <Screen title="Journey Base">
      <HudChips />
      <div className="mt-4 grid gap-3">
        {Object.entries(BUILDINGS).map(([id, b]) => {
          const key = id as import("@/lib/game/baseCrafting").BuildingId;
          const level = save.baseBuildings[key] ?? 1;
          const cost = buildingUpgradeCost(key, level);
          return (
            <div key={id} className="panel rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-fg">{b.name} · Lv {level}</p>
                  <p className="text-xs text-muted">{b.effect}</p>
                </div>
                <button type="button" className="hud-chip text-gold" disabled={cost == null} onClick={() => upgrade(key)}>
                  {cost == null ? "MAX" : `${cost}c`}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="panel mt-3 rounded-2xl p-4">
        <p className="font-semibold text-fg">Materials</p>
        <p className="mt-2 text-sm text-muted">{Object.entries(save.materials).map(([k,v]) => `${k}: ${v}`).join(" · ")}</p>
      </div>
    </Screen>
  );
}

export function EquipmentScreen() {
  const save = useGame((s) => s.save);
  const craft = useGame((s) => s.craft);
  const equip = useGame((s) => s.equipEquipment);
  const slots = ["weapon", "armor", "charm"] as const;
  return (
    <Screen title="Forge & Equipment">
      <div className="space-y-4 pb-8">
        <section className="panel rounded-3xl p-5">
          <p className="text-xs uppercase tracking-wider text-accent">Forge</p>
          <h2 className="mt-1 font-display text-2xl text-fg">Craft your gear</h2>
          <p className="mt-1 text-sm text-muted">Use your collected materials to create stronger equipment.</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button key={slot} type="button" className="panel rounded-2xl p-3 text-center" onClick={() => craft(slot)}>
                <span className="block text-lg">{slot === "weapon" ? "⚔️" : slot === "armor" ? "🛡️" : "💠"}</span>
                <span className="mt-1 block text-xs font-semibold capitalize text-fg">{slot}</span>
                <span className="mt-1 block text-[10px] text-muted">Craft</span>
              </button>
            ))}
          </div>
        </section>
        <section className="panel rounded-3xl p-5">
          <div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-wider text-muted">Materials</p><p className="mt-1 text-sm text-fg">{Object.entries(save.materials).map(([k,v]) => `${k}: ${v}`).join(" · ")}</p></div><span className="text-2xl">🔨</span></div>
        </section>
        <section>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">Your equipment</p>
          <div className="grid gap-3">
            {save.equipment.length === 0 ? (
              <div className="panel rounded-2xl p-5 text-sm text-muted">No equipment yet. Gather materials, then craft your first item.</div>
            ) : save.equipment.map((item: any) => {
              const active = save.equippedEquipment[item.slot as EquipmentSlot] === item.id;
              return (
                <button key={item.id} type="button" className="panel flex items-center gap-3 rounded-2xl p-4 text-left" onClick={() => equip(item.id)}>
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface-2 text-xl">{item.slot === "weapon" ? "⚔️" : item.slot === "armor" ? "🛡️" : "💠"}</span>
                  <span className="min-w-0 flex-1"><span className="block font-semibold text-fg">{item.name}</span><span className="mt-1 block text-xs capitalize text-muted">{item.slot} · Level {item.level} · Power {item.power}</span></span>
                  <span className="text-xs font-bold text-accent">{active ? "EQUIPPED" : item.rarity.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </Screen>
  );
}


