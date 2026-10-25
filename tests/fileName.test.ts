import assert from "node:assert/strict";
import test from "node:test";
import { titleFromFileName } from "../lib/fileName";

test("le titre par défaut issu d'un nom de fichier est propre", () => {
  assert.equal(titleFromFileName("Capture d\u2019écran 2026-10-25 à\u202f01.35.44.png"), "Capture d'écran 2026-10-25 à 01.35.44");
  assert.equal(titleFromFileName("  épisode\u00a01.mov "), "épisode 1");
});
