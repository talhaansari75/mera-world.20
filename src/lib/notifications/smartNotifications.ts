export type NotificationCandidate = { id: string; type: 'daily' | 'energy' | 'streak' | 'new_content' | 'event'; priority: number; createdAt: number };
export function chooseNotifications(candidates: NotificationCandidate[], max = 2) {
  return [...candidates].sort((a, b) => b.priority - a.priority || a.createdAt - b.createdAt).slice(0, max);
}
