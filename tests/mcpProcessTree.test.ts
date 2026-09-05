import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, unlink } from "node:fs/promises";
import test from "node:test";
import { isProcessGroupAlive, signalProcessTree } from "../scripts/mcp-process-tree.ts";
import { MAX_CHILD_OUTPUT_CHARS, appendBoundedOutput } from "../scripts/mcp-output-buffer.ts";

const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitFor(
  predicate: () => boolean | Promise<boolean>,
  timeoutMs = 2_000
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!(await predicate())) {
    if (Date.now() >= deadline) throw new Error("Timed out waiting for the process group.");
    await delay(20);
  }
}

test("bounded child output rejects overflow without growing the buffer", () => {
  const bounded = appendBoundedOutput("x".repeat(MAX_CHILD_OUTPUT_CHARS - 1), "YZ");
  assert.equal(bounded.overflow, true);
  assert.equal(bounded.output.length, MAX_CHILD_OUTPUT_CHARS);

  const alreadyFull = appendBoundedOutput(bounded.output, "more");
  assert.equal(alreadyFull.overflow, true);
  assert.equal(alreadyFull.output.length, MAX_CHILD_OUTPUT_CHARS);
});

test("POSIX process-tree signaling fails closed instead of downgrading to a child kill", async () => {
  const source = await readFile("scripts/mcp-process-tree.ts", "utf8");
  assert.match(source, /process\.platform === "win32"/);
  assert.match(source, /throw new Error/);
  assert.doesNotMatch(source, /child\.kill\(signal\)/);
});

test(
  "process-tree termination reaps a descendant after the direct child closes",
  { skip: process.platform === "win32" },
  async () => {
  const marker = `/tmp/mcp-process-tree-test-${process.pid}.txt`;
  const nestedSource = 'process.on("SIGTERM", () => {}); setInterval(() => {}, 1000);';
  const childSource = `
    import { spawn } from "node:child_process";
    import { writeFileSync } from "node:fs";
    const nested = spawn(process.execPath, ["-e", ${JSON.stringify(nestedSource)}], { stdio: "ignore" });
    writeFileSync(${JSON.stringify(marker)}, String(nested.pid));
    setTimeout(() => process.exit(0), 100);
  `;
  const child = spawn(process.execPath, ["--input-type=module", "-e", childSource], {
    detached: true,
    stdio: "ignore",
  });

  try {
    await waitFor(async () => {
      try {
        await readFile(marker, "utf8");
        return true;
      } catch {
        return false;
      }
    });
    await new Promise<void>((resolveClose) => child.once("close", () => resolveClose()));
    assert.equal(isProcessGroupAlive(child.pid), true);

    signalProcessTree(child, "SIGTERM");
    await delay(100);
    assert.equal(isProcessGroupAlive(child.pid), true);

    signalProcessTree(child, "SIGKILL");
    await waitFor(() => !isProcessGroupAlive(child.pid));
    assert.equal(isProcessGroupAlive(child.pid), false);
  } finally {
    if (isProcessGroupAlive(child.pid)) signalProcessTree(child, "SIGKILL");
    await unlink(marker).catch(() => {});
  }
});
