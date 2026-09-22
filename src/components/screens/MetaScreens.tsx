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
  const featured = SHOP.filter((item) => item.kind === "coins" || item.kind === "energy").slice(0, 6);
  const cosmetics = SHOP.filter((item) => item.kind === "theme");
  return (
    <Screen title={t("shop.title")}>
      <HudChips />
      <section className="arcade-shop-hero mt-4">
        <div><span className="dashboard-kicker text-yellow-200">DAILY MARKET</span><h2>Power up your journey</h2><p>Coins, energy, hints and colorful themes — all earned or bought inside the game.</p></div>
        <span className="arcade-shop-gem">✦</span>
      </section>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {featured.map((item, index) => (
          <button key={item.id} type="button" className={`arcade-shop-card shop-card-${index % 3}`} onClick={() => useGame.getState().buy(item.id)}>
            <span className="arcade-shop-icon">{item.kind === "energy" ? "ϟ" : "◈"}</span>
            <b>{item.name}</b>
            <small>{item.kind === "energy" ? `+${item.amount} energy` : `+${item.amount} coins`}</small>
            <strong>{item.coins ? `${item.coins} coins` : `${item.diamonds} diamonds`}</strong>
          </button>
        ))}
      </div>
      <section className="mt-5">
        <div className="mb-2 flex items-end justify-between"><div><span className="dashboard-kicker">COSMETICS</span><h3 className="font-display text-2xl text-fg">World themes</h3></div><span className="text-xs text-muted">{cosmetics.length} styles</span></div>
        <div className="grid gap-2">
          {cosmetics.map((item) => (
            <button key={item.id} type="button" className="arcade-theme-row" onClick={() => useGame.getState().buy(item.id)}>
              <span className="arcade-theme-swatch" />
              <span className="min-w-0 flex-1 text-left"><b>{item.name}</b><small>{item.theme && owned.includes(item.theme as ThemeId) ? "OWNED" : "Unlock a new visual world"}</small></span>
              <strong>{item.coins ? `${item.coins}c` : `${item.diamonds}d`}</strong>
            </button>
          ))}
        </div>
      </section>
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
  const games = Math.max(1, save.stats.gamesPlayed);
  const winRate = Math.round((save.stats.gamesWon / games) * 100);
  const rank = lv >= 20 ? "Word Master" : lv >= 10 ? "Journey Expert" : lv >= 5 ? "Explorer" : "Beginner";
  const streak = Math.max(save.dailyStreak, save.stats.currentStreak);

  return (
    <Screen title={t("profile.title")}>
      <div className="arcade-profile-page">
        <section className="arcade-profile-hero">
          <div className="arcade-profile-avatar-wrap"><div className="arcade-profile-avatar">{save.avatarId === "ink-1" ? "🪶" : save.avatarId === "ink-2" ? "🏮" : save.avatarId === "ink-3" ? "🧭" : "✨"}</div><span>★</span></div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><span className="arcade-mini-badge">COUNTRY</span><span className="arcade-rank-badge">{rank}</span></div>
            <h2 className="mt-2 truncate font-display text-2xl font-black text-white">{save.playerName || "Traveler"}</h2>
            <p className="truncate text-xs font-semibold text-white/65">ID: {user?.username || user?.displayName || save.playerName || "traveler"}</p>
            <div className="mt-3 flex items-center gap-2"><span className="text-xs font-black uppercase tracking-wider text-white/60">Level</span><b className="text-2xl text-yellow-200">{lv}</b></div>
            <div className="mt-2 arcade-xp-track"><span style={{ width: progress + "%" }} /></div>
            <p className="mt-1 text-right text-[10px] font-bold text-white/55">{Math.round(progress)}% XP</p>
          </div>
        </section>

        <section className="arcade-profile-tabs"><span className="active">INFO</span><button type="button" onClick={() => useGame.getState().go("inventory")}>AVATARS</button><button type="button" onClick={() => useGame.getState().go("settings")}>FRAMES</button></section>

        <section className="arcade-profile-club"><span className="arcade-club-icon">◇</span><div><b>NO CLUB</b><small>Join friends and build your word-search crew.</small></div><button type="button" onClick={() => useGame.getState().go("social")}>SOCIAL</button></section>

        <section className="grid gap-3 sm:grid-cols-2">
          <div className="arcade-loadout-card"><div className="arcade-loadout-art">✦</div><div><b>Blaze</b><small>STANDARD FRAME</small><span><i /> Force <i /> Aim <i /> Time</span></div></div>
          <div className="arcade-loadout-card dark"><div className="arcade-loadout-art">◉</div><div><b>Black</b><small>STANDARD STYLE</small><span>● ● ● ● ●</span></div></div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="arcade-collection-card"><b>MEDALS</b><span>⊘</span><small>{save.stats.perfectClears} perfect clears</small></div>
          <div className="arcade-collection-card"><b>ALBUM TOKENS</b><span>⊘</span><small>{save.inventory.length} collected</small></div>
        </section>

        <div className="arcade-winnings"><span>TOTAL WINNINGS</span><b>{save.stats.coinsEarned.toLocaleString()}</b><em>◈</em></div>

        <section className="arcade-profile-stats">
          <p>Games Won: <b>{save.stats.gamesWon} out of {save.stats.gamesPlayed}</b></p>
          <p>Win Rate: <b>{winRate}%</b></p>
          <p>Current Win Streak: <b>{streak}</b></p>
          <p>Best Win Streak: <b>{save.stats.bestStreak}</b></p>
          <p>World Rank Record: <b>—</b></p>
          <p>Country Rank Record: <b>—</b></p>
        </section>

        <section className="arcade-profile-actions">
          <SignedIn><UserButton /></SignedIn>
          <SignedOut><Link to="/login" className="arcade-primary-cta">SIGN IN</Link></SignedOut>
          <button type="button" className="arcade-secondary-cta" onClick={() => useGame.getState().go("stats")}>VIEW FULL STATS</button>
        </section>
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
    <Screen title={t("settings.title")}>
      {category ? renderCategory() : (
        <div className="arcade-settings-page">
          <section className="arcade-settings-ribbon"><span>⚙</span><div><b>GAME SETTINGS</b><small>Customize your Mera World experience</small></div></section>

          <section className="arcade-settings-section">
            <h2>ACCOUNT</h2>
            <div className="arcade-settings-row">
              <span className="arcade-settings-icon">👤</span><span className="flex-1"><b>Player Account</b><small>{useGame.getState().save.playerName || "Traveler"}</small></span>
              <SignedIn><UserButton /></SignedIn>
              <SignedOut><Link to="/login" className="arcade-settings-action blue">LOGIN</Link></SignedOut>
            </div>
            <button type="button" className="arcade-settings-row" onClick={() => useGame.getState().go("profile")}><span className="arcade-settings-icon">🏆</span><span className="flex-1"><b>Profile & Progress</b><small>Rank, streaks, medals and stats</small></span><strong>VIEW</strong></button>
          </section>

          <section className="arcade-settings-section">
            <h2>SOCIAL</h2>
            <button type="button" className="arcade-settings-row" onClick={() => useGame.getState().go("social")}><span className="arcade-settings-icon">👥</span><span className="flex-1"><b>Friends & Clans</b><small>Connect with your word-search friends</small></span><strong>VIEW</strong></button>
            <button type="button" className="arcade-settings-row" onClick={() => useGame.getState().go("multiplayer")}><span className="arcade-settings-icon">⚔️</span><span className="flex-1"><b>Online Arena</b><small>2-player live match with bot fallback</small></span><strong>PLAY</strong></button>
          </section>

          <section className="arcade-settings-section">
            <h2>GAME OPTIONS</h2>
            <ToggleRow label="Sound Effects" on={s.sfx} onClick={() => toggle("sfx")} />
            <ToggleRow label="Music" on={s.music} onClick={() => toggle("music")} />
            <ToggleRow label="Haptics" on={s.haptics} onClick={() => toggle("haptics")} />
            <ToggleRow label="Show Timer" on={s.showTimer} onClick={() => toggle("showTimer")} />
            <ToggleRow label="Personalized Gameplay" on={s.personalization} onClick={() => toggle("personalization")} />
          </section>

          <section className="arcade-settings-section">
            <h2>QUICK SETTINGS</h2>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="arcade-settings-tile" onClick={() => setCategory("appearance")}><span>🎨</span><b>Appearance</b><small>Theme & tiles</small></button>
              <button type="button" className="arcade-settings-tile" onClick={() => setCategory("accessibility")}><span>♿</span><b>Accessibility</b><small>Motion & text</small></button>
              <button type="button" className="arcade-settings-tile" onClick={() => setCategory("language")}><span>🌐</span><b>Language</b><small>{lang.toUpperCase()}</small></button>
              <button type="button" className="arcade-settings-tile" onClick={() => setCategory("data")}><span>💾</span><b>Save & Data</b><small>Backup & reset</small></button>
            </div>
          </section>

          <section className="arcade-settings-section">
            <h2>INFO</h2>
            <button type="button" className="arcade-settings-row" onClick={() => useGame.getState().go("legal")}><span className="arcade-settings-icon">📜</span><span className="flex-1"><b>Terms & Privacy</b><small>Game rules and privacy information</small></span><strong>VIEW</strong></button>
            <button type="button" className="arcade-settings-row" onClick={() => useGame.getState().go("more")}><span className="arcade-settings-icon">ℹ️</span><span className="flex-1"><b>Help & Support</b><small>Guides, systems and game information</small></span><strong>VIEW</strong></button>
            <div className="arcade-version-row"><span>VERSION</span><b>Mera World · Arcade UI v1</b></div>
          </section>
        </div>
      )}
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
              const active = save.equippedEquipment[item.slot] === item.id;
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


