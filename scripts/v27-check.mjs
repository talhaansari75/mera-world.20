import fs from 'node:fs';
const required = [
  'src/lib/v27/analytics/analyticsEngine.ts',
  'src/components/v27/AnalyticsScreen.tsx',
  'V27_ANALYTICS_PRIVACY.md',
];
for (const f of required) if (!fs.existsSync(f)) throw new Error(`missing ${f}`);
const types = fs.readFileSync('src/lib/game/types.ts','utf8');
if (!types.includes('| "analytics"')) throw new Error('analytics ScreenId missing');
const app = fs.readFileSync('src/components/app/GameApp.tsx','utf8');
if (!app.includes('<AnalyticsScreen />')) throw new Error('analytics route missing');
const menu = fs.readFileSync('src/components/screens/MoreScreens.tsx','utf8');
if (!menu.includes('Player Analytics')) throw new Error('menu entry missing');
const engine = fs.readFileSync('src/lib/v27/analytics/analyticsEngine.ts','utf8');
for (const token of ['winRate','perfectRate','analyticsCsv']) if (!engine.includes(token)) throw new Error(`analytics token missing: ${token}`);
console.log('V27 analytics/privacy integration check: PASS');
