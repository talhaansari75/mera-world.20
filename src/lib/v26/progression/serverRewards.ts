export const seasonKey = () => "v26_current_season";

export async function claimAchievementServer(_args?: { data?: { id?: string } }) {
  return { ok: true as const, reward: 0 };
}
export async function claimMissionServer(_args?: { data?: { id?: string } }) {
  return { ok: true as const, reward: 0 };
}
export async function claimSeasonTierServer(_args?: { data?: { level?: number } }) {
  return { ok: true as const, reward: 0 };
}

export async function fetchCommunityPuzzles() { return []; }
export async function publishCommunityPuzzle() { return null; }
export async function processPaymentServer() { return { success: true }; }
export async function syncCreatorDraft() { return null; }
