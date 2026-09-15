export type Cell = [number, number];

/** Canonicalizes a path so forward/reverse submissions share one identity. */
export function canonicalPath(cells: Cell[]): string {
  const forward = JSON.stringify(cells);
  const reverse = JSON.stringify([...cells].reverse());
  return forward <= reverse ? forward : reverse;
}

export function bonusSubmissionKey(word: string, cells: Cell[]): string {
  return `${word.toUpperCase()}:${canonicalPath(cells)}`;
}

export function bossRewardKey(userId: string, bossLevel: number): string {
  return `boss-reward:${userId}:${bossLevel}`;
}
