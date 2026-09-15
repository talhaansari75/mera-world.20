import fs from 'node:fs';
const required = [
  'src/lib/v10/social/socialService.ts',
  'src/lib/v10/liveops/liveOpsService.ts',
  'src/lib/v10/liveops/liveOpsBridge.ts',
  'src/components/v10/SocialScreen.tsx',
  'src/components/v10/LiveOpsScreen.tsx',
];
for (const file of required) if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
const app = fs.readFileSync('src/components/app/GameApp.tsx','utf8');
if (!app.includes('installLiveOpsBridge') || !app.includes('<SocialScreen />')) throw new Error('V10 app wiring missing');
console.log('V10 integration check: PASS');
