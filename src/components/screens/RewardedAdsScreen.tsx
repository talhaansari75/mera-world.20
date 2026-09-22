import { useEffect, useState } from "react";
import { Screen } from "./chrome";
import { useGame } from "@/lib/store";

const DAILY_CAP = 3;
const REWARD_COINS = 50;

function today() { return new Date().toISOString().slice(0, 10); }

export function RewardedAdsScreen() {
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState("");
  const [watched, setWatched] = useState(() => {
    try { return Number(localStorage.getItem("mera-world.rewardedAds." + today()) || 0); } catch { return 0; }
  });
  const [adFinished, setAdFinished] = useState(false);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  useEffect(() => {
    if (seconds === 0 && adFinished) setMessage("Test ad completed. Claim your reward.");
  }, [seconds, adFinished]);

  const start = () => {
    if (watched >= DAILY_CAP) {
      setMessage("Daily rewarded-ad limit reached.");
      return;
    }
    setAdFinished(true);
    setMessage("Test ad is playing. Production will connect this slot to a rewarded-ad provider.");
    setSeconds(10);
  };

  const claim = () => {
    if (seconds !== 0 || !adFinished || watched >= DAILY_CAP) return;
    const next = watched + 1;
    setWatched(next);
    try { localStorage.setItem("mera-world.rewardedAds." + today(), String(next)); } catch {}
    useGame.getState().patchSave((s) => ({ ...s, coins: s.coins + REWARD_COINS, stats: { ...s.stats, coinsEarned: s.stats.coinsEarned + REWARD_COINS } }));
    setAdFinished(false);
    setMessage("+" + REWARD_COINS + " coins added. " + (DAILY_CAP - next) + " rewarded ads left today.");
  };

  return (
    <Screen title="Rewarded Ads">
      <div className="mx-auto max-w-md space-y-4">
        <section className="panel rounded-3xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Test / Monetization</p>
          <h2 className="mt-1 font-display text-2xl text-fg">Watch & Earn</h2>
          <p className="mt-2 text-sm text-muted">A player voluntarily watches a rewarded ad and receives an in-game reward. This test slot simulates the ad; a real ad network must be connected before production.</p>
          <div className="mt-4 rounded-2xl bg-surface-2 p-4">
            <p className="text-xs text-muted">Reward</p>
            <p className="mt-1 text-2xl font-bold text-gold">+50 Coins</p>
            <p className="mt-1 text-xs text-muted">{String(Math.max(0, DAILY_CAP - watched))} watches remaining today</p>
          </div>
        </section>

        <button type="button" className="btn-primary w-full py-4 font-semibold" disabled={seconds > 0 || watched >= DAILY_CAP} onClick={start}>
          {seconds > 0 ? "Test ad playing… " + seconds + "s" : watched >= DAILY_CAP ? "Daily limit reached" : "Watch rewarded ad"}
        </button>

        {seconds === 0 && adFinished && (
          <button type="button" className="hud-chip w-full py-3 text-fg" onClick={claim}>Claim reward</button>
        )}

        {message && <div className="panel rounded-2xl p-3 text-sm text-muted">{message}</div>}
      </div>
    </Screen>
  );
}
