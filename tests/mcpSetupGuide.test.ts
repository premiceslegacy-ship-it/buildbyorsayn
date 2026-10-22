import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";


test("the public BUILD favicon is a valid multi-size ICO asset", async () => {
  const bytes = await readFile("app/favicon.ico");

  assert.deepEqual(Array.from(bytes.slice(0, 4)), [0, 0, 1, 0]);
  assert.equal(bytes.readUInt16LE(4), 3);
  assert.ok(bytes.byteLength > 1_000);
});
