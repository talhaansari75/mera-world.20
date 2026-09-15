import fs from 'node:fs';
const must = [
  'src/components/v28/AccessibilityScreen.tsx',
  'src/lib/v28/accessibility/accessibility.ts',
  'src/lib/v28/notifications/smartNotifications.ts',
  'V28_ACCESSIBILITY_NOTIFICATIONS.md',
];
for (const f of must) if (!fs.existsSync(f)) throw new Error(`missing ${f}`);
const types = fs.readFileSync('src/lib/game/types.ts','utf8');
for (const x of ['screenReader','dyslexiaFriendly','focusMode','notificationReminders','notificationTime']) if (!types.includes(x)) throw new Error(`missing ${x}`);
const app = fs.readFileSync('src/components/app/GameApp.tsx','utf8');
if (!app.includes('case "accessibility"')) throw new Error('route missing');
const more = fs.readFileSync('src/components/screens/MoreScreens.tsx','utf8');
if (!more.includes('Accessibility Pro')) throw new Error('menu missing');
console.log('V28 integration check: PASS');
