import { useMemo, useState } from "react";
import { Screen } from "@/components/screens/chrome";
import { useGame } from "@/lib/store";
import { applyAccessibilityPreset, accessibilitySummary, type AccessibilityPreset } from "@/lib/v28/accessibility/accessibility";
import { requestNotificationPermission } from "@/lib/v28/notifications/smartNotifications";
import type { GameSettings } from "@/lib/game/types";

export function AccessibilityScreen() {
  const settings = useGame((s) => s.save.settings);
  const setSetting = useGame.getState().setSetting;
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">(
    typeof Notification === "undefined" ? "unsupported" : Notification.permission,
  );
  const summary = useMemo(() => accessibilitySummary(settings), [settings]);
  const toggle = (key: keyof GameSettings) => setSetting(key, !settings[key] as never);
  const preset = (p: AccessibilityPreset) => {
    const next = applyAccessibilityPreset(settings, p);
    (Object.keys(next) as Array<keyof GameSettings>).forEach((key) => {
      if (next[key] !== settings[key]) setSetting(key, next[key] as never);
    });
  };
  return (
    <Screen title="Accessibility Pro">
      <div className="panel rounded-2xl p-4">
        <p className="text-sm font-semibold text-fg">Your current profile</p>
        <p className="mt-1 text-sm text-muted">{summary.length ? summary.join(" · ") : "Standard presentation"}</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(["default", "low-motion", "high-clarity", "focus"] as AccessibilityPreset[]).map((p) => (
          <button key={p} type="button" className="panel rounded-xl p-3 text-left text-sm font-semibold text-fg" onClick={() => preset(p)}>
            {p.replace("-", " ")}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {[
          ["screenReader", "Screen-reader optimized labels"],
          ["dyslexiaFriendly", "Dyslexia-friendly text spacing"],
          ["focusMode", "Focus mode"],
          ["highContrast", "High contrast"],
          ["largeText", "Large text"],
          ["reducedMotion", "Reduced motion"],
          ["colorBlind", "Color-blind support"],
        ].map(([key, label]) => (
          <button key={key} type="button" aria-pressed={Boolean(settings[key as keyof GameSettings])} className="panel flex items-center justify-between rounded-xl p-4 text-left" onClick={() => toggle(key as keyof GameSettings)}>
            <span className="text-sm font-semibold text-fg">{label}</span>
            <span className="hud-chip text-xs text-fg">{settings[key as keyof GameSettings] ? "On" : "Off"}</span>
          </button>
        ))}
      </div>
      <div className="panel mt-3 rounded-2xl p-4">
        <p className="font-semibold text-fg">Smart reminders</p>
        <p className="mt-1 text-sm text-muted">Daily puzzle, low-energy and streak reminders. Notifications stay off until you opt in.</p>
        <button type="button" className="mt-3 hud-chip text-fg" onClick={async () => setPermission(await requestNotificationPermission())}>
          {permission === "granted" ? "Notifications enabled" : permission === "denied" ? "Notifications blocked" : "Enable notifications"}
        </button>
        <button type="button" className="mt-3 ml-2 hud-chip text-fg" onClick={() => toggle("notificationReminders")}>
          {settings.notificationReminders ? "Reminders on" : "Reminders off"}
        </button>
        <label className="mt-3 block text-xs text-muted">Preferred reminder time</label>
        <input type="time" value={settings.notificationTime} onChange={(e) => setSetting("notificationTime", e.target.value)} className="mt-1 rounded-xl border border-border bg-surface px-3 py-2 text-fg" />
      </div>
    </Screen>
  );
}
