import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/skills/page.tsx", import.meta.url), "utf8");

test("la bibliothèque Skills montre rapidement le catalogue sur mobile", () => {
  assert.match(page, /Choisis une capacité à renforcer, télécharge-la puis adapte-la à ton projet\./);
  assert.match(page, /href="#catalogue"/);
  assert.match(page, /<div id="catalogue" className="mb-6 flex flex-wrap gap-2 scroll-mt-24">/);

  for (const sectionId of ["methode", "workflow", "mode-emploi"]) {
    assert.match(
      page,
      new RegExp(`<section id="${sectionId}" className="mb-10 scroll-mt-24 hidden md:block">`),
      `${sectionId} doit passer après le catalogue sur mobile`,
    );
  }

  assert.match(page, /<ScrollProgress\s+className="hidden md:block"/);
});
