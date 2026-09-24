import { useEffect } from "react";
import { adsEnabled } from "./h5GamesAds";

export function AdSenseBootstrap() {
  useEffect(() => {
    if (!adsEnabled() || document.querySelector('script[data-mwsj-adsense="h5"]')) return;
    const client = import.meta.env.VITE_ADSENSE_PUBLISHER_ID?.trim();
    if (!client) return;

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.mwsjAdsense = "h5";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.onload = () => {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adBreak = window.adConfig = (config: unknown) => {
        window.adsbygoogle?.push(config as never);
      };
      window.adConfig?.({ sound: "on" });
    };
    document.head.appendChild(script);
  }, []);

  return null;
}
