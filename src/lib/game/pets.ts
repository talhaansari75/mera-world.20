import type { PetId } from "./types.ts";

export const PETS: Array<{
  id: PetId;
  name: string;
  role: string;
  blurb: string;
  coins: number;
  diamonds: number;
  perk: string;
}> = [
  { id: "dog", name: "Inkhound", role: "Hints", blurb: "Noses the first letter once per puzzle.", coins: 0, diamonds: 0, perk: "hint" },
  { id: "cat", name: "Margin Cat", role: "Speed", blurb: "Trims a few seconds off the clock.", coins: 240, diamonds: 0, perk: "speed" },
  { id: "eagle", name: "Ridge Eagle", role: "Vision", blurb: "Reveals a distant cell at the start.", coins: 280, diamonds: 0, perk: "vision" },
  { id: "dragon", name: "Ember Drake", role: "Fire", blurb: "Bonus coins on perfect clears.", coins: 0, diamonds: 4, perk: "coins" },
  { id: "unicorn", name: "Luckhorn", role: "Luck", blurb: "Richer lucky-spin table.", coins: 360, diamonds: 0, perk: "luck" },
  { id: "wolf", name: "Pack Wolf", role: "Streak", blurb: "Streaks last through one miss.", coins: 300, diamonds: 0, perk: "streak" },
  { id: "fox", name: "Cipher Fox", role: "Smart", blurb: "Cheaper letter hints.", coins: 320, diamonds: 0, perk: "cheap" },
  { id: "turtle", name: "Quiet Turtle", role: "Zen", blurb: "Extra time in timed modes.", coins: 200, diamonds: 0, perk: "time" },
  { id: "owl", name: "Night Owl", role: "Night", blurb: "Fog mode is a little clearer.", coins: 260, diamonds: 0, perk: "fog" },
  { id: "dolphin", name: "Tide Dolphin", role: "Flow", blurb: "Energy refills a touch faster.", coins: 0, diamonds: 3, perk: "energy" },
];

export function petById(id: PetId) {
  return PETS.find((p) => p.id === id)!;
}
