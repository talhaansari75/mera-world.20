export const AD_FREE_PRODUCT_ID = "ad_free";
const AD_COOLDOWN_MS = 120_000;
const LAST_AD_KEY = "mwsj:last-h5-ad";

type AdBreakConfig = {
  type: "next";
  name: string;
  beforeAd?: () => void;
  afterAd?: () => void;
  adBreakDone?: (info: { breakStatus?: string; breakFormat?: string }) => void;
};

declare global {
  interface Window {
    adBreak?: (config: AdBreakConfig) => void;
    adConfig?: (config: { sound?: "on" | "off" }) => void;
    adsbygoogle?: unknown[];
  }
}

export function adsEnabled(): boolean {
  return Boolean(import.meta.env.VITE_ADSENSE_PUBLISHER_ID?.trim());
}

export function canShowH5Ad(): boolean {
  if (typeof window === "undefined" || !adsEnabled() || typeof window.adBreak !== "function") return false;
  const last = Number(window.localStorage.getItem(LAST_AD_KEY) ?? 0);
  return !Number.isFinite(last) || Date.now() - last >= AD_COOLDOWN_MS;
}

export function showH5Interstitial(name: string, onDone?: () => void): boolean {
  if (!canShowH5Ad()) return false;
  try {
    window.localStorage.setItem(LAST_AD_KEY, String(Date.now()));
    window.adBreak?.({ type: "next", name, adBreakDone: () => onDone?.() });
    return true;
  } catch {
    return false;
  }
}
