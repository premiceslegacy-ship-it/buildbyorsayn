import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("chaque marqueur Hermes publié possède une entrée du même type dans le registre", () => {
  const contentDirectory = new URL("../content/hermes/", import.meta.url);
  const published = readdirSync(contentDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .flatMap((filename) => [...readFileSync(new URL(filename, contentDirectory), "utf8").matchAll(/\[\[(schema|maquette):([^\]]+)\]\]/g)])
    .map((match) => ({ kind: match[1], name: match[2] }));
  const registry = read("components/schemas/registry.ts");

  assert.equal(published.length, 84);
  assert.equal(new Set(published.map(({ name }) => name)).size, published.length);
  for (const { kind, name } of published) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(
      registry,
      new RegExp(`\\{ name: "${escapedName}", kind: "${kind}", course: "hermes", component:`),
      `${kind}:${name} doit être enregistré pour Hermes`,
    );
  }
});

test("le lecteur de développement sait cibler un visuel Hermes", () => {
  const page = read("app/dev/lecteur/page.tsx");
  const scroll = read("app/dev/lecteur/DevReaderScroll.tsx");
  assert.match(page, /course === "hermes"/);
  assert.match(page, /HERMES_CHAPTER_PATHS/);
  assert.match(page, /hermesIntroductionMarkdown/);
  assert.match(scroll, /data-reader-visual-name/);
});
