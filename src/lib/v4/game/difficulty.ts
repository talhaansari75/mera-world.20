export type Difficulty='easy'|'normal'|'hard'|'expert'|'nightmare';
export const difficultyScale:Record<Difficulty,number>={easy:.7,normal:1,hard:1.25,expert:1.55,nightmare:2};
export function scoreMultiplier(d:Difficulty){return difficultyScale[d]}
