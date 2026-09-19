import { useState } from "react";
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
import { buildingUpgradeCost } from "@/lib/game/baseCrafting";
import { loadCloudSave, pushCloudSave } from "@/lib/server/cloud";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { Link } from "@tanstack/react-router";
import { BUILDINGS } from "@/lib/game/baseCrafting";

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
  const lv = playerLevel(save.xp);
  const next = xpForLevel(lv + 1);
  return (
    <Screen title={t("profile.title")}>
      <div className="panel rounded-2xl p-4">
        <label className="text-xs text-muted">Name</label>
        <input
          className="mt-1 w-full rounded-xl border border-border bg-surface-2 px-3 py-2 text-fg"
          value={save.playerName}
          maxLength={24}
          onChange={(e) => useGame.getState().setName(e.target.value)}
        />
        <p className="mt-3 text-sm text-muted">
          Rank {lv} · {save.xp} xp · next {next}
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full bg-primary" style={{ width: `${Math.min(100, (save.xp / Math.max(1, next)) * 100)}%` }} />
        </div>
      </div>
      <p className="mt-4 text-xs uppercase tracking-wider text-muted">Class</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {CLASSES.map((c) => {
          const selected = save.classId === c.id;
          return (
          <button
            key={c.id}
            type="button"
            className="panel rounded-2xl p-3 text-left"
            onClick={() => useGame.getState().patchSave((s) => ({ ...s, classId: c.id }))}
            style={selected ? { outline: "2px solid var(--color-primary)" } : undefined}
          >
            <p className="font-semibold text-fg">{c.name}{selected ? " ✓" : ""}</p>
            <p className="text-xs text-muted">{c.blurb}</p>
          </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs uppercase tracking-wider text-muted">Avatar</p>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {AVATARS.map((a) => {
          const icons: Record<string, string> = {
            "ink-1": "🪶",
            "ink-2": "🏮",
            "ink-3": "🧭",
            "ink-4": "⚓",
            "ink-5": "🦅",
            "ink-6": "🪷",
            "ink-7": "🌙",
            "ink-8": "⛰️",
            "ink-9": "🌊",
            "ink-10": "⭐",
            "ink-11": "🍃",
            "ink-12": "🔥",
          };
          const selected = save.avatarId === a.id;
          return (
          <button
            key={a.id}
            type="button"
            onClick={() => useGame.getState().setAvatar(a.id)}
            className="panel flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-semibold text-fg"
            style={selected ? { outline: "2px solid var(--color-primary)" } : undefined}
            aria-label={a.label}
          >
            <span className="text-2xl leading-none" aria-hidden="true">{icons[a.id] ?? "✨"}</span>
            <span className="text-[10px] opacity-80">{a.label}</span>
          </button>
          );
        })}
      </div>
      <div className="mt-6 flex items-center justify-between">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link to="/login" className="btn-primary max-w-xs">
            {t("cta.signIn")}
          </Link>
        </SignedOut>
      </div>
      <CloudRow />
    </Screen>
  );
}

function CloudRow() {
  const [msg, setMsg] = useState<string | null>(null);
  return (
    <div className="mt-4 flex flex-col gap-2">
      <button
        type="button"
        className="btn-ghost"
        onClick={async () => {
          try {
            const remote = await loadCloudSave();
            if (!remote.ok) {
              setMsg(remote.error);
              return;
            }
            if (remote.save && typeof remote.save === "object") {
              useGame.getState().applyCloud(remote.save as never);
            } else setMsg("No cloud save yet.");
          } catch {
            setMsg("Sign in to sync.");
          }
        }}
      >
        Pull cloud save
      </button>
      <button
        type="button"
        className="btn-ghost"
        onClick={async () => {
          try {
            await pushCloudSave({ data: { json: useGame.getState().exportJson() } });
            setMsg("Saved to cloud.");
          } catch {
            setMsg("Sign in to sync.");
          }
        }}
      >
        Push cloud save
      </button>
      {msg && <p className="text-sm text-muted">{msg}</p>}
    </div>
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
  const rows: Array<[string, string | number]> = [
    ["Clears", st.gamesWon],
    ["Played", st.gamesPlayed],
    ["Words", st.wordsFound],
    ["Hints", st.hintsUsed],
    ["Streak", st.currentStreak],
    ["Best streak", st.bestStreak],
    ["Perfect", st.perfectClears],
    ["Coins earned", st.coinsEarned],
    ["Dailies", st.dailyCompleted],
    ["Bosses", st.bossesDefeated],
    ["Hours", (st.playTimeMs / 3600000).toFixed(1)],
  ];
  return (
    <Screen title={t("cta.stats")}>
      <div className="grid grid-cols-2 gap-2">
        {rows.map(([k, v]) => (
          <div key={k} className="panel rounded-2xl p-4">
            <p className="text-xs text-muted">{k}</p>
            <p className="font-display text-2xl text-fg">{v}</p>
          </div>
        ))}
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
          {inv.map((id) => (
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
  return (
    <Screen title="Forge & Equipment">
      <div className="grid grid-cols-3 gap-2">
        {(["weapon","armor","charm"] as const).map((slot) => (
          <button key={slot} type="button" className="hud-chip" onClick={() => craft(slot)}>Craft {slot}</button>
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        {save.equipment.length === 0 ? (
          <div className="panel rounded-2xl p-4 text-sm text-muted">No equipment yet. Craft your first item.</div>
        ) : save.equipment.map((e) => {
          const active = save.equippedEquipment[e.slot] === e.id;
          return (
            <button key={e.id} type="button" className="panel flex items-center justify-between rounded-2xl p-4 text-left" onClick={() => equip(e.id)}>
              <span><span className="block font-semibold text-fg">{e.name}</span><span className="text-xs text-muted">{e.slot} · Power {e.power} · Lv {e.level}</span></span>
              <span className="text-xs text-accent">{active ? "EQUIPPED" : e.rarity.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    </Screen>
  );
}
