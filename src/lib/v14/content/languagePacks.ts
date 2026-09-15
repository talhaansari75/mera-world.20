import type { LangCode } from "@/lib/game/types";

export type LanguagePack = {
  code: LangCode;
  nativeName: string;
  direction: "ltr" | "rtl";
  uiCoverage: "full" | "fallback";
  sampleWords: string[];
  contentMode: "native" | "native-starter" | "shared-offline-fallback";
};

export const LANGUAGE_PACKS: LanguagePack[] = [
  { code: "en", nativeName: "English", direction: "ltr", uiCoverage: "full", contentMode: "native", sampleWords: ["WORD", "SEARCH", "GAME", "JOURNEY", "PUZZLE"] },
  { code: "ur", nativeName: "اردو", direction: "rtl", uiCoverage: "full", contentMode: "native", sampleWords: ["لفظ", "تلاش", "کھیل", "سفر", "پہیلی"] },
  { code: "ur-Latn", nativeName: "Roman Urdu", direction: "rtl", uiCoverage: "full", contentMode: "native", sampleWords: ["LAFZ", "TALAASH", "KHEL", "SAFAR", "PAHELI"] },
  { code: "hi", nativeName: "हिन्दी", direction: "ltr", uiCoverage: "full", contentMode: "native", sampleWords: ["शब्द", "खोज", "खेल", "यात्रा", "पहेली"] },
  { code: "ar", nativeName: "العربية", direction: "rtl", uiCoverage: "full", contentMode: "native", sampleWords: ["كلمة", "بحث", "لعبة", "رحلة", "لغز"] },
  { code: "bn", nativeName: "বাংলা", direction: "ltr", uiCoverage: "full", contentMode: "native-starter", sampleWords: ["শব্দ", "খোঁজ", "খেলা", "যাত্রা", "ধাঁধা"] },
  { code: "pa", nativeName: "ਪੰਜਾਬੀ", direction: "ltr", uiCoverage: "full", contentMode: "native-starter", sampleWords: ["ਸ਼ਬਦ", "ਖੋਜ", "ਖੇਡ", "ਸਫ਼ਰ", "ਬੁਝਾਰਤ"] },
  { code: "sd", nativeName: "سنڌي", direction: "rtl", uiCoverage: "full", contentMode: "native", sampleWords: ["لفظ", "ڳولا", "راند", "سفر", "ڳجهارت"] },
  { code: "ps", nativeName: "پښتو", direction: "rtl", uiCoverage: "full", contentMode: "native", sampleWords: ["کلمه", "لټون", "لوبه", "سفر", "معما"] },
  { code: "tr", nativeName: "Türkçe", direction: "ltr", uiCoverage: "full", contentMode: "native-starter", sampleWords: ["KELİME", "ARAMA", "OYUN", "YOLCULUK", "BULMACA"] },
  { code: "es", nativeName: "Español", direction: "ltr", uiCoverage: "full", contentMode: "native-starter", sampleWords: ["PALABRA", "BUSCAR", "JUEGO", "VIAJE", "ROMPECABEZAS"] },
  { code: "fr", nativeName: "Français", direction: "ltr", uiCoverage: "full", contentMode: "native-starter", sampleWords: ["MOT", "CHERCHE", "JEU", "VOYAGE", "ÉNIGME"] },
  { code: "de", nativeName: "Deutsch", direction: "ltr", uiCoverage: "full", contentMode: "native-starter", sampleWords: ["WORT", "SUCHE", "SPIEL", "REISE", "RÄTSEL"] },
  { code: "zh", nativeName: "中文", direction: "ltr", uiCoverage: "full", contentMode: "native-starter", sampleWords: ["词语", "搜索", "游戏", "旅程", "谜题"] },
  { code: "ja", nativeName: "日本語", direction: "ltr", uiCoverage: "full", contentMode: "native-starter", sampleWords: ["言葉", "検索", "ゲーム", "旅", "パズル"] },
];

export function getLanguagePack(code: LangCode) {
  return LANGUAGE_PACKS.find((pack) => pack.code === code) ?? LANGUAGE_PACKS[0];
}
