import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("la navigation BUILD reste compacte sur tablette", async () => {
  const nav = await readFile("components/NavBar.tsx", "utf8");

  assert.match(nav, /hidden xl:flex items-center gap-6 text-sm/);
  assert.match(nav, /flex xl:hidden items-center gap-3/);
  assert.doesNotMatch(nav, /hidden md:flex items-center gap-6 text-sm/);
  assert.match(nav, /md:px-8 xl:px-12 xl:py-6/);
});
