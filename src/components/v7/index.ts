export const V7_DOMAINS = [
  "progression","gameplay","economy","content","social","multiplayer","liveops","admin",
  "security","analytics","platform","personalization","creator","notifications","backend"
] as const;
export type V7Domain = typeof V7_DOMAINS[number];
