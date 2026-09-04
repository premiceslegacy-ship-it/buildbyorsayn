import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("verify:release composes every mandatory release gate in fail-fast order", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
    scripts?: Record<string, string>;
  };
  const release = packageJson.scripts?.["verify:release"];
  assert.equal(typeof release, "string");

  const commands = release!.split(/\s*&&\s*/);
  assert.deepEqual(commands, [
    "npm test",
    "npm run lint",
    "npm audit --omit=dev --audit-level=high",
    "npm run knowledge:sync",
    "npm run test:mcp-postgres",
    "npm run test:mcp-postgres",
    "npm run test:mcp-access",
    "npm run test:mcp-e2e",
    "git diff --check",
  ]);
  assert.equal(commands.filter((command) => command === "npm run test:mcp-postgres").length, 2);
  assert.doesNotMatch(release!, /knowledge:sync:apply|deploy|vercel/);
});
