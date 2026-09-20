import { Globe2, Languages, CheckCircle2 } from "lucide-react";
import { Screen } from "@/components/screens/chrome";
import { useGame } from "@/lib/store";
import { LANGUAGE_PACKS, getLanguagePack } from "@/lib/v14/content/languagePacks";
import { nativeWordCount } from "@/lib/game/languageWords";

export function ContentLanguagesScreen() {
  const lang = useGame((s) => s.save.language);
  const current = getLanguagePack(lang);
  return (
    <Screen title="Languages & Content">
      <div className="panel rounded-2xl p-4">
        <div className="flex items-center gap-2"><Globe2 className="size-5 text-primary" /><span className="font-semibold text-fg">15-language content matrix</span></div>
        <p className="mt-1 text-sm text-muted">UI localization is available across all 15 supported languages. Word-grid content uses native packs where available and a shared offline fallback elsewhere.</p>
        <div className="mt-3 flex items-center gap-2 text-sm text-fg"><Languages className="size-4" /> Current: <strong>{current.nativeName}</strong></div>
      </div>
      <div className="mt-3 grid gap-2">
        {LANGUAGE_PACKS.map((pack) => (
          <button key={pack.code} type="button" className="panel flex items-center justify-between rounded-2xl p-3 text-left" onClick={() => useGame.getState().setLang(pack.code)}>
            <span><span className="block font-semibold text-fg">{pack.nativeName}</span><span className="text-xs text-muted">{pack.code} · {pack.direction.toUpperCase()} · {nativeWordCount(pack.code)} native words · {pack.contentMode === "native" ? "native bank" : "native starter + offline fallback"}</span></span>
            {lang === pack.code && <CheckCircle2 className="size-5 text-primary" />}
          </button>
        ))}
      </div>
      <div className="panel mt-3 rounded-2xl p-4"><p className="text-xs uppercase tracking-wider text-gold">Sample vocabulary</p><p className="mt-2 text-sm text-fg">{current.sampleWords.join(" · ")}</p></div>
    </Screen>
  );
}
