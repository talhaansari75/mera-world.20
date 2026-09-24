import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

function collect(dir, predicate) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collect(full, predicate));
    else if (entry.isFile() && predicate(full)) out.push(full);
  }
  return out;
}

const scriptTests = collect(join(root, "scripts"), (p) => p.endsWith(".test.mjs"));
const sourceTests = collect(join(root, "src", "lib"), (p) => p.endsWith(".test.ts"));
const tests = [...scriptTests, ...sourceTests].sort();

if (tests.length === 0) {
  console.error("No test files were discovered.");
  process.exit(1);
}

console.log(`Discovered ${tests.length} test files.`);
for (const file of tests) console.log(`  ✓ ${relative(root, file)}`);

const result = spawnSync(process.execPath, ["--experimental-strip-types", "--test", ...tests], {
  cwd: root,
  stdio: "inherit",
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
