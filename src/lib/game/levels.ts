export function puzzleForSeed(level: number, mode: GameMode = "classic", seed: number, language: LangCode = "en") {
  const spec = modeMods(mode, specFor(level));
  const rng = mulberry32(seed >>> 0);
  const category = CATEGORY_IDS[Math.abs(level) % CATEGORY_IDS.length]!;
  const dirs = weightedDirs(spec, rng);
  const world = worldOf(level);
  return generatePuzzle({ seed: seed >>> 0, size: spec.size, wordCount: spec.wordCount, minLen: spec.minLen, maxLen: spec.maxLen, dirs, category: pickCategory(rng, category), title: isBoss(level) ? `Boss ${level}` : `${world.name} ${level}`, language, script: ["ur","sd","ps"].includes(language) ? "urdu" : "latin" });
}
