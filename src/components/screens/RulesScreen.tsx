import React from "react";
import { Screen } from "./chrome";
import { GAME_RULES } from "@/lib/game/rules";

export function RulesScreen({ onBack }: { onBack: () => void }) {
  return (
    <Screen title="How to Play" onBack={onBack}>
      <div className="space-y-6">
        {GAME_RULES.map((section) => (
          <div key={section.title} className="panel rounded-2xl p-5">
            <h2 className="mb-3 text-lg font-semibold text-fg">{section.title}</h2>
            <ul className="space-y-2">
              {section.points.map((point, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted">
                  <span className="mt-1 text-accent">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Screen>
  );
}
