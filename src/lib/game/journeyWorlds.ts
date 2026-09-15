import type { PlayerSave } from "./types.ts";

export type JourneyWorld = {
  id: string;
  world: number;
  name: string;
  subtitle: string;
  from: number;
  to: number;
  story: string;
  hero: string;
  boss: string;
  bossTitle: string;
  chestCoins: number;
  chestDiamonds: number;
  theme: string;
  mechanics: string[];
};

export const JOURNEY_WORLDS: readonly JourneyWorld[] = [
  { id:"green-meadows", world:1, name:"Green Meadows", subtitle:"Where the first words awaken", from:1, to:333, story:"Mira discovers a living trail of words. Restore the meadow's lost ink and follow it toward the first gate.", hero:"Mira the Archivist", boss:"The Ink Stag", bossTitle:"Guardian of the First Trail", chestCoins:300, chestDiamonds:2, theme:"meadow", mechanics:["Combo", "Golden Words"] },
  { id:"crystal-caves", world:2, name:"Crystal Caves", subtitle:"Echoes beneath the earth", from:334, to:666, story:"The trail descends into crystal halls where every echo hides a forgotten word. Light the cave beacons to continue.", hero:"Rowan the Ranger", boss:"The Crystal Wyrm", bossTitle:"Keeper of the Echo Vault", chestCoins:550, chestDiamonds:3, theme:"crystal", mechanics:["Ice Tiles", "Locked Tiles"] },
  { id:"ancient-desert", world:3, name:"Ancient Desert", subtitle:"The atlas buried in gold", from:667, to:999, story:"A buried atlas points across the dunes. Decode its ancient vocabulary before the sandstorm erases the trail.", hero:"Safa the Cartographer", boss:"The Sand Colossus", bossTitle:"Warden of the Lost Atlas", chestCoins:800, chestDiamonds:4, theme:"desert", mechanics:["Bomb Tiles", "Timed Challenges"] },
  { id:"frozen-kingdom", world:4, name:"Frozen Kingdom", subtitle:"Break the silence of the ice", from:1000, to:1333, story:"A frozen kingdom has forgotten its own name. Melt the word seals and restore the royal archive.", hero:"Orin the Climber", boss:"The Frost Queen", bossTitle:"Sovereign of Silent Words", chestCoins:1100, chestDiamonds:5, theme:"arctic", mechanics:["Ice Chains", "Moving Obstacles"] },
  { id:"shadow-forest", world:5, name:"Shadow Forest", subtitle:"Where hidden words move", from:1334, to:1666, story:"The forest rearranges itself whenever a word is found. Track the moving trail and defeat the shadow that feeds on forgotten words.", hero:"Lyra the Stargazer", boss:"The Shadow Beast", bossTitle:"Devourer of Lost Words", chestCoins:1500, chestDiamonds:6, theme:"forest", mechanics:["Moving Obstacles", "Hidden Words"] },
  { id:"sky-islands", world:6, name:"Sky Islands", subtitle:"The final archive above the clouds", from:1667, to:2000, story:"The final fragments float above the clouds. Rebuild the Sky Archive and confront the guardian of the complete word atlas.", hero:"Aero the Keeper", boss:"Atlas Prime", bossTitle:"Guardian of the Final Archive", chestCoins:2200, chestDiamonds:10, theme:"sky", mechanics:["Mixed Hazards", "Boss Rules"] },
] as const;

export function journeyWorldForLevel(level: number): JourneyWorld {
  return JOURNEY_WORLDS.find(w => level >= w.from && level <= w.to) ?? JOURNEY_WORLDS[0]!;
}

export function journeyWorldProgress(save: PlayerSave, world: JourneyWorld) {
  const completed = Math.max(0, Math.min(world.to - world.from + 1, save.unlockedLevel - world.from));
  const total = world.to - world.from + 1;
  return Math.round((completed / total) * 100);
}

export function isJourneyBoss(level: number) {
  return JOURNEY_WORLDS.some(w => level === w.to);
}

export function chestKey(world: number) { return `journey-chest-${world}`; }
export function chestClaimed(save: PlayerSave, world: number) { return save.inventory.includes(chestKey(world)); }


/** Pure, idempotent chest transition used by the store and progression simulations. */
export function claimJourneyChest(save: PlayerSave, world: number): PlayerSave | null {
  const target = JOURNEY_WORLDS.find(w => w.world === world);
  if (!target || !save.results[String(target.to)] || chestClaimed(save, world)) return null;
  return {
    ...save,
    coins: save.coins + target.chestCoins,
    diamonds: save.diamonds + target.chestDiamonds,
    inventory: [...save.inventory, chestKey(world)],
  };
}
