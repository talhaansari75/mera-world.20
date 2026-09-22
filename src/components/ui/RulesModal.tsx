import React from "react";
import { GAME_RULES } from "../../lib/game/rules";
import { BookOpen, X } from "lucide-react";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="panel max-w-md w-full rounded-2xl p-6 bg-bg text-fg shadow-xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-fg p-1 rounded-full"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="size-6 text-accent" />
          <h2 className="text-xl font-bold">How to Play</h2>
        </div>

        <ul className="space-y-3 text-sm text-muted">
          {GAME_RULES.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold text-xs">
                {idx + 1}
              </span>
              <span>{typeof rule === "string" ? rule : `${rule.title}: ${rule.points.join(" · ")}`}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-accent text-accent-fg font-semibold hover:brightness-110 active:scale-[0.98] transition"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
