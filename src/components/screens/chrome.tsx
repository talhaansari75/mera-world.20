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
  const save = useGame((s) => s.save);
  const refilledSave = refillEnergy(save);

  const eta = energyEta(refilledSave);
  const m = Math.floor(eta / 60000);
  const sec = Math.floor((eta % 60000) / 1000);

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Coins */}
      <span className="hud-chip flex items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-base font-extrabold text-white shadow-md backdrop-blur-md">
        <Coins className="size-6 text-yellow-400" />
        {refilledSave.coins}
      </span>

      {/* Diamonds */}
      <span className="hud-chip flex items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-base font-extrabold text-white shadow-md backdrop-blur-md">
        <Gem className="size-6 text-cyan-400" />
        {refilledSave.diamonds}
      </span>

      {/* Stars */}
      <span className="hud-chip flex items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-base font-extrabold text-white shadow-md backdrop-blur-md">
        <Star className="size-6 text-yellow-300" />
        {refilledSave.stars}
      </span>

      {/* Energy */}
      <span className="hud-chip flex items-center gap-1.5 rounded-full bg-black/40 px-4 py-2 text-base font-extrabold text-white shadow-md backdrop-blur-md">
        <Zap className="size-6 text-orange-400" />
        {refilledSave.energy}/{MAX_ENERGY}
        {refilledSave.energy < MAX_ENERGY && (
          <span className="ml-1 text-sm font-normal opacity-90">
            {m}:{String(sec).padStart(2, "0")}
          </span>
        )}
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
