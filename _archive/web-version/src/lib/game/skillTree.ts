export type SkillId = "speed" | "vision" | "luck";

export const SKILL_TREE: Record<SkillId, {
  name: string;
  description: string;
  max: number;
  costs: number[];
}> = {
  speed: {
    name: "Quick Hands",
    description: "Improves speed-oriented play and timed rounds.",
    max: 10,
    costs: [1,2,2,3,3,4,4,5,6,7],
  },
  vision: {
    name: "Sharp Vision",
    description: "Starts difficult rounds with extra information.",
    max: 10,
    costs: [1,2,2,3,3,4,4,5,6,7],
  },
  luck: {
    name: "Fortune",
    description: "Improves bonus reward chances.",
    max: 10,
    costs: [1,2,2,3,3,4,4,5,6,7],
  },
};

export function nextSkillCost(skill: SkillId, current: number) {
  const node = SKILL_TREE[skill];
  return current >= node.max ? null : node.costs[current] ?? null;
}
