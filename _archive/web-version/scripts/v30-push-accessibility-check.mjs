import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const must = [
  'src/lib/v30/push/push.ts',
  'src/lib/v30/push/client.ts',
  'src/components/v30/PushSettingsScreen.tsx',
  'migrations/0008_v30_push_subscriptions.sql',
  'src/lib/game/types.ts',
  'src/components/app/GameApp.tsx',
  'src/components/screens/MoreScreens.tsx',
];
for (const f of must) if (!fs.existsSync(path.join(root,f))) throw new Error(`missing ${f}`);
const server = fs.readFileSync(path.join(root,'src/lib/v30/push/push.ts'),'utf8');
if (!server.includes('authMiddleware')) throw new Error('push server functions must be authenticated');
if (!server.includes('user_id')) throw new Error('push subscriptions must be user scoped');
const migration = fs.readFileSync(path.join(root,'migrations/0008_v30_push_subscriptions.sql'),'utf8');
if (!migration.includes('primary key (user_id, endpoint)')) throw new Error('subscription uniqueness missing');
const board = fs.readFileSync(path.join(root,'src/components/play/GridBoard.tsx'),'utf8');
for (const token of ['role="grid"','aria-activedescendant','ArrowUp','ArrowDown','ArrowLeft','ArrowRight']) if (!board.includes(token)) throw new Error(`accessibility board token missing: ${token}`);
console.log('V30 push/accessibility integration check: PASS');
