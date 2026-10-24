import assert from "node:assert/strict";
import test from "node:test";
import { chapterSummary } from "@/components/reader/readerModel";

test("le résumé d'un chapitre ignore l'en-tête technique du fichier", () => {
  const content = "---\nid: b5-s1\ntitre: L'orientation client\nordre: 1\n---\n\n## Le client ne vient pas admirer ta stack\n\nIl vient pour un résultat. Le reste suit.";
  const summary = chapterSummary(content);
  assert.doesNotMatch(summary, /\bid:|titre:|ordre:|b5-s1/);
  assert.equal(summary, "Il vient pour un résultat.");
});

test("le résumé reprend la première phrase du texte, pas le titre de section collé à elle", () => {
  const summary = chapterSummary("---\nid: b5-s1\n---\n\n## Le client ne vient pas admirer ta stack\n\nJeudi, rendez-vous chez un client. La suite arrive.");
  assert.equal(summary, "Jeudi, rendez-vous chez un client.");
});

test("un chapitre fait uniquement de titres garde le titre comme résumé", () => {
  assert.equal(chapterSummary("## Seul le titre"), "Seul le titre");
});
