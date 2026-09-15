import type { ReactNode } from "react";
import { ChevronLeft, Coins, Gem, Star, Zap } from "lucide-react";
import { useGame } from "@/lib/store";
import { t } from "@/lib/game/i18n";
import { energyEta, refillEnergy } from "@/lib/game/economy";
import { MAX_ENERGY } from "@/lib/game/constants";

export function Screen({
  title,
  children,
  onBack,
}: {
  title: string;
  children: ReactNode;
  onBack?: () => void;
}) {
  return (
    <div className="app-shell safe-pad flex h-dvh flex-col">
      <header className="mb-3 flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl panel"
          onClick={onBack ?? (() => useGame.getState().back())}
          aria-label="Back"
        ><ChevronLeft className="size-5" />
        </button>

        <h1 className="font-display text-xl text-fg">{title}</h1>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto pb-8">
        {children}
      </div>
    </div>
  );
}

export function HudChips() {
  // IMPORTANT:
  // Direct save object lo, refillEnergy ko selector ke andar mat chalao.
  const save = useGame((s) => s.save);

  const refilledSave = refillEnergy(save);

  const eta = energyEta(refilledSave);
  const m = Math.floor(eta / 60000);
  const sec = Math.floor((eta % 60000) / 1000);

  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="hud-chip text-fg">
        <Coins className="size-3.5 text-gold" />
        {refilledSave.coins}
      </span>

      <span className="hud-chip text-fg">
        <Gem className="size-3.5 text-accent" />
        {refilledSave.diamonds}
      </span>

      <span className="hud-chip text-fg">
        <Star className="size-3.5 text-gold" />
        {refilledSave.stars}
      </span>

      <span className="hud-chip text-fg">
        <Zap className="size-3.5 text-warning" />
        {refilledSave.energy}/{MAX_ENERGY}
        {refilledSave.energy < MAX_ENERGY
          ? ` · ${m}:${String(sec).padStart(2, "0")}`
          : ""}
      </span>
    </div>
  );
}

export function TileButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="panel flex min-h-20 flex-col items-start justify-between rounded-2xl p-3 text-left transition-transform active:scale-[0.98]"
    >
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-semibold text-fg">{label}</span>
    </button>
  );
}

export function useT() {
  const lang = useGame((s) => s.save.language);
  return (key: string) => t(lang, key);
}
