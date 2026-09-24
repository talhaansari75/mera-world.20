import type { ThemeId } from "./types.ts";

export const THEMES: Array<{
  id: ThemeId;
  name: string;
  bg: string;
  fg: string;
  tile: string;
  accent: string;
}> = [
  { id: "midnight", name: "Midnight Ink", bg: "#0b0f18", fg: "#ece8dc", tile: "#1c2436", accent: "#667eea" },
  { id: "parchment", name: "Parchment", bg: "#e8dcc8", fg: "#2a2418", tile: "#f4efe2", accent: "#6b4f2a" },
  { id: "ocean", name: "Tidepool", bg: "#07161c", fg: "#d7f0ea", tile: "#123039", accent: "#3dba9a" },
  { id: "forest", name: "Canopy", bg: "#10160f", fg: "#e6edd8", tile: "#1c2a18", accent: "#7aa35a" },
  { id: "ember", name: "Hearth", bg: "#1a0f0c", fg: "#f3e2d4", tile: "#2c1812", accent: "#e07a4c" },
  { id: "orchid", name: "Orchid", bg: "#140e18", fg: "#f0e4f2", tile: "#26182c", accent: "#b07ad4" },
  { id: "arctic", name: "Arctic", bg: "#0e1418", fg: "#e8eef3", tile: "#1a2630", accent: "#8eb4d4" },
  { id: "sakura", name: "Sakura", bg: "#181014", fg: "#f6e8ea", tile: "#2a1820", accent: "#e08aa0" },
];

export const AVATARS = [
  { id: "ink-1", label: "Quill" },
  { id: "ink-2", label: "Lantern" },
  { id: "ink-3", label: "Compass" },
  { id: "ink-4", label: "Anchor" },
  { id: "ink-5", label: "Falcon" },
  { id: "ink-6", label: "Lotus" },
  { id: "ink-7", label: "Crescent" },
  { id: "ink-8", label: "Mountain" },
  { id: "ink-9", label: "Wave" },
  { id: "ink-10", label: "Star" },
  { id: "ink-11", label: "Leaf" },
  { id: "ink-12", label: "Flame" },
];

export const CLASSES = [
  { id: "detective", name: "Detective", blurb: "Sees one extra first-letter hint." },
  { id: "scholar", name: "Scholar", blurb: "Dictionary entries unlock earlier." },
  { id: "explorer", name: "Explorer", blurb: "Starts with the Inkhound companion." },
  { id: "warrior", name: "Warrior", blurb: "Boss timers are a little kinder." },
] as const;
