import { JOURNEY_WORLDS, journeyWorldForLevel } from "./journeyWorlds.ts";

export type BossPhase = 1 | 2 | 3;

export type JourneyBossProfile = {
  id: string;
  name: string;
  title: string;
  world: number;
  level: number;
  phaseThresholds: readonly [number, number];
  mechanic: string;
};

export function journeyBossForLevel(level: number): JourneyBossProfile {
  const world = journeyWorldForLevel(level);
  return {
    id: `journey-boss-${world.world}`,
    name: world.boss,
    title: world.bossTitle,
    world: world.world,
    level: world.to,
    phaseThresholds: [0.66, 0.33],
    mechanic: world.mechanics.join(" + "),
  };
}

export function bossPhase(hp: number, maxHp: number): BossPhase {
  const ratio = maxHp <= 0 ? 0 : hp / maxHp;
  return ratio > 0.66 ? 1 : ratio > 0.33 ? 2 : 3;
}

export function bossPhaseLabel(phase: BossPhase) {
  return phase === 1 ? "Awakened" : phase === 2 ? "Enraged" : "Final Stand";
}

export function allJourneyBosses() {
  return JOURNEY_WORLDS.map((w) => journeyBossForLevel(w.to));
}
