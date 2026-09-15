#!/usr/bin/env node
import { spawnSync } from "node:child_process";
const npx=process.platform==="win32"?"npx.cmd":"npx";
const r=spawnSync(npx,["prisma","migrate","resolve","--applied","20260915020000_prisma_baseline"],{stdio:"inherit"});
process.exit(r.status??1);
