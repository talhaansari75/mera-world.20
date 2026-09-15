export type V14Challenge = {
  id: string;
  cycle: "daily" | "weekly" | "seasonal";
  title: string;
  description: string;
  target: number;
  reward: number;
};

export function dayKey(date = new Date()) {
  return date.toLocaleDateString("en-CA");
}

export function weekKey(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return `week-${dayKey(d)}`;
}

export function seasonKey(date = new Date()) {
  const month = date.getMonth() + 1;
  const quarter = Math.floor((month - 1) / 3) + 1;
  return `${date.getFullYear()}-Q${quarter}`;
}

export function getV14Challenges(date = new Date()): V14Challenge[] {
  const week = weekKey(date);
  const season = seasonKey(date);
  return [
    { id: `v14-daily-words-${dayKey(date)}`, cycle: "daily", title: "Ink Warm-up", description: "Find 5 words today.", target: 5, reward: 75 },
    { id: `v14-daily-clears-${dayKey(date)}`, cycle: "daily", title: "Trailblazer", description: "Clear 3 levels today.", target: 3, reward: 120 },
    { id: `v14-weekly-words-${week}`, cycle: "weekly", title: "Weekly Cartographer", description: "Find 35 words this week.", target: 35, reward: 450 },
    { id: `v14-weekly-clears-${week}`, cycle: "weekly", title: "Seven Pages", description: "Clear 7 levels this week.", target: 7, reward: 600 },
    { id: `v14-seasonal-clears-${season}`, cycle: "seasonal", title: "Season of Discovery", description: "Clear 25 levels this season.", target: 25, reward: 1500 },
  ];
}
