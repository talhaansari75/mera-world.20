import { execFileSync } from "node:child_process";

const base = process.env.CSHARP_POLICY_BASE;
const args = base
  ? ["diff", "--name-only", base, "HEAD", "--"]
  : ["diff", "--name-only", "HEAD^", "HEAD", "--"];

let output;
try {
  output = execFileSync("git", args, { encoding: "utf8" });
} catch (error) {
  console.error("C#-only policy check could not determine the commit diff.");
  process.exit(1);
}

const changed = output.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const forbidden = changed.filter((file) => /\.(ts|tsx)$/i.test(file));

if (forbidden.length > 0) {
  console.error("C#-ONLY POLICY VIOLATION: TypeScript/TSX files cannot be added or modified.");
  forbidden.forEach((file) => console.error(`  - ${file}`));
  process.exit(1);
}

console.log("C#-only policy passed: no TypeScript/TSX files were added or modified.");
