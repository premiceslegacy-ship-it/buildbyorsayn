import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("la navigation BUILD reste compacte sur tablette", async () => {
  const nav = await readFile("components/NavBar.tsx", "utf8");
  const styles = await readFile("app/da-app.css", "utf8");

  assert.match(nav, /className="navbar__nav"/);
  assert.match(nav, /className="tabbar"/);
  assert.match(styles, /@media \(min-width: 735px\)[^}]*navbar__nav \{ display: flex; \}/);
  assert.match(styles, /@media \(min-width: 735px\)[^}]*tabbar \{ display: none; \}/);
  assert.match(styles, /width: min\(402px, calc\(100% - 32px\)\)/);
});
