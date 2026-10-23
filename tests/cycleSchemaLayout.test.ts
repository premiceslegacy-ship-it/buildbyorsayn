import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../components/schemas/kit/kit.module.css", import.meta.url), "utf8");

test("Cycle masque sa liste compacte en large malgré les styles de listes du lecteur", () => {
  assert.match(css, /\.cycleCompact\s*\{\s*display:\s*none\s*!important;/);
  assert.match(css, /\.cycleCompact\s*\{[^}]*display:\s*grid\s*!important;/s);
});
