import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useGame } from "@/lib/store";
import { WORLDS, isBoss, worldOf } from "@/lib/game/levels";
import { Screen, useT } from "./chrome";
import { ADVANCED_MODE_CATALOG } from "@/lib/game/core/modeRules";

const PAGE = 40;

export function WorldsScreen() {
  const t = useT();
  const save = useGame((s) => s.save);
  const [worldId, setWorldId] = useState(() => worldOf(save.unlockedLevel).id);
  const [page, setPage] = useState(0);
  const world = WORLDS.find((w) => w.id === worldId) ?? WORLDS[0]!;
  const levels = useMemo(() => {
    const all: number[] = [];
    for (let i = world.from; i <= world.to; i++) all.push(i);
    return all;
  }, [world]);
  const pages = Math.max(1, Math.ceil(levels.length / PAGE));
  const safePage = Math.min(page, pages - 1);
  const slice = levels.slice(safePage * PAGE, safePage * PAGE + PAGE);

  return (
    <Screen title={t("cta.worlds")}>
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
        {WORLDS.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => {
              setWorldId(w.id);
              setPage(0);
            }}
            className="hud-chip shrink-0 text-fg"
            style={w.id === worldId ? { borderColor: "var(--color-primary)" } : undefined}
          >
            {w.name}
          </button>
        ))}
      </div>
      <p className="mb-3 text-sm text-muted">{world.blurb}</p>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
        {slice.map((n) => {
          const locked = n > save.unlockedLevel;
          const res = save.results[String(n)];
          return (
            <button
              key={n}
              type="button"
              disabled={locked}
              onClick={() => useGame.getState().startLevel(n)}
              className="panel relative flex aspect-square flex-col items-center justify-center rounded-xl text-xs font-semibold text-fg disabled:opacity-40"
            >
              {locked ? <Lock className="size-3.5 text-muted" /> : n}
              {isBoss(n) && <span className="absolute right-1 top-1 size-1.5 rounded-full bg-gold" />}
              {res && <span className="text-[10px] text-gold">{res.stars}★</span>}
            </button>
          );
        })}
      </div>
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl panel"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="text-sm text-muted">
            {safePage + 1} / {pages}
          </span>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl panel"
            disabled={safePage >= pages - 1}
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            aria-label="Next page"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </Screen>
  );
}

export function ModesScreen() {
  const t = useT();
  const level = useGame((s) => s.save.unlockedLevel);
  return (
    <Screen title={t("cta.modes")}>
      <div className="flex flex-col gap-2">
        {ADVANCED_MODE_CATALOG.map((m) => (
          <button
            key={m.id}
            type="button"
            className="panel rounded-2xl p-4 text-left transition-transform active:scale-[0.99]"
            onClick={() => {
              if (m.id === "endless") useGame.getState().startEndless();
              else useGame.getState().startLevel(level, m.id);
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-fg">{m.name}</p>
              <span className="hud-chip text-[10px] text-gold">
                {m.difficulty === 0 ? "FREE" : `★ ${m.difficulty}`}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{m.description}</p>
          </button>
        ))}
      </div>
    </Screen>
  );
}
