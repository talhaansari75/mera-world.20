import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const required = [
 "migrations/0006_v13_cloud_payments_admin.sql",
 "src/lib/v13/admin/access.ts",
 "src/lib/v13/admin/server.ts",
 "src/lib/v13/payments/server.ts",
 "src/lib/v13/cloud/server.ts",
 "src/components/v13/AdminScreen.tsx",
 "src/components/v13/PaymentsScreen.tsx",
 "V13_REAL_CLOUD_PAYMENTS_ADMIN.md",
];
const missing=required.filter(x=>!fs.existsSync(path.join(root,x)));
const game=fs.readFileSync(path.join(root,"src/components/app/GameApp.tsx"),"utf8");
const more=fs.readFileSync(path.join(root,"src/components/screens/MoreScreens.tsx"),"utf8");
const cloud=fs.readFileSync(path.join(root,"src/components/screens/CloudSyncScreen.tsx"),"utf8");
const checks=[['GameApp routes admin/payments',game.includes('case "admin"')&&game.includes('case "payments"')],['More menu entries',more.includes('id: "admin"')&&more.includes('id: "payments"')],['Cloud optimistic push',cloud.includes('expectedRevision')],['Server admin gate',fs.readFileSync(path.join(root,'src/lib/v13/admin/access.ts'),'utf8').includes('ADMIN_USER_IDS')]];
if(missing.length||checks.some(([,ok])=>!ok)){console.error(JSON.stringify({missing,checks},null,2));process.exit(1)}
console.log('V13 integration check: PASS');
