import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  parseBeforeAfterPairs,
  parseReaderDirective,
  splitExampleContent,
} from "../components/reader/readerRichMarkdown";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

async function bundledReaderProse(): Promise<ComponentType<{ section: { content: string } }>> {
  const result = await build({
    entryPoints: [fileURLToPath(new URL("../components/reader/ReaderProse.tsx", import.meta.url))],
    bundle: true,
    write: false,
    platform: "node",
    format: "cjs",
    jsx: "automatic",
    external: ["react", "react/jsx-runtime"],
    logLevel: "silent",
    plugins: [{
      name: "reader-css-module-stub",
      setup(context) {
        context.onLoad({ filter: /\.module\.css$/ }, () => ({
          contents: "const styles = new Proxy({}, { get: (_, key) => String(key) }); export default styles;",
          loader: "js",
        }));
      },
    }],
  });
  const loaded = { exports: {} as { ReaderProse?: ComponentType<{ section: { content: string } }> } };
  const execute = Function("module", "exports", "require", result.outputFiles[0].text) as (
    module: typeof loaded,
    exports: typeof loaded.exports,
    require: NodeJS.Require,
  ) => void;
  execute(loaded, loaded.exports, createRequire(import.meta.url));
  if (!loaded.exports.ReaderProse) throw new Error("ReaderProse absent du bundle de test");
  return loaded.exports.ReaderProse;
}

const ReaderProse = await bundledReaderProse();
const render = (content: string) => renderToStaticMarkup(createElement(ReaderProse, { section: { content } }));

test("les cartes riches lisent leur contenu normal sans perdre la fermeture", () => {
  const lines = [":::retiens", "Une phrase simple.", ":::", "Après la carte."];
  assert.deepEqual(parseReaderDirective(lines, 0), {
    kind: "retiens",
    content: "Une phrase simple.",
    endIndex: 2,
    title: undefined,
  });

  const example = splitExampleContent("Métier : Plaquiste\nKarim rappelle son client.");
  assert.deepEqual(example, { profession: "Plaquiste", body: "Karim rappelle son client." });
});

test("une directive imbriquée appartient à la carte extérieure", () => {
  const lines = [
    ":::retiens",
    "Garde cette idée.",
    ":::exemple Karim",
    "Métier : Plaquiste",
    "Il répond au devis.",
    ":::",
    "Fin de la carte.",
    ":::",
  ];
  const outer = parseReaderDirective(lines, 0);
  assert.equal(outer?.endIndex, 7);
  assert.match(outer?.content ?? "", /:::exemple Karim[\s\S]*Il répond au devis\.[\s\S]*:::/);
  const innerLines = outer?.content.split("\n") ?? [];
  assert.equal(parseReaderDirective(innerLines, 1)?.title, "Karim");

  const html = render(lines.join("\n"));
  assert.match(html, /data-reader-card="retiens"/);
  assert.match(html, /data-reader-card="exemple"/);
  assert.match(html, /<h3>Karim<\/h3>/);
});

test("une directive mal fermée reste un contenu lisible au lieu d'avaler le chapitre", () => {
  assert.equal(parseReaderDirective([":::retiens", "Le texte reste visible."], 0), null);
  const html = render(":::retiens\nLe texte reste visible.");
  assert.doesNotMatch(html, /:::retiens/);
  assert.match(html, /Le texte reste visible\./);
});

test("plusieurs paires avant et après forment une galerie structurée", () => {
  assert.deepEqual(parseBeforeAfterPairs(`Avant : Gagner du temps avec l'IA.
Après : Chaque devis reçoit un responsable avant 18 h.
Pourquoi : La scène et le résultat sont visibles.

Avant : Cliquez ici.
Après : Voir les créneaux disponibles.
Pourquoi : Le bouton annonce le résultat.`), [
    {
      before: "Gagner du temps avec l'IA.",
      after: "Chaque devis reçoit un responsable avant 18 h.",
      why: "La scène et le résultat sont visibles.",
    },
    {
      before: "Cliquez ici.",
      after: "Voir les créneaux disponibles.",
      why: "Le bouton annonce le résultat.",
    },
  ]);
});

test("le rendu produit les cartes, la paire, le surlignage, le schéma et la maquette", () => {
  const html = render(`==Une phrase forte.==

:::retiens
À garder.
:::

:::exemple Un devis concret
Métier : Plaquiste
Karim rappelle son client.
:::

:::avant-apres
Avant : Une offre floue.
Après : Un devis envoyé avant 18 h.
Pourquoi : Le résultat est visible.
:::

> Une citation sans bande.

[[schema:ParcoursClair]]

[[maquette:PageOffreAnnotee]]`);
  for (const marker of ["data-reader-highlight", "data-reader-card", "data-reader-before-after", "data-reader-visual"]) {
    assert.match(html, new RegExp(marker));
  }
  assert.match(html, /<del>Une offre floue\.<\/del>/);
  assert.match(html, /Plaquiste/);
  assert.match(html, /data-schema-container="true"/);
  assert.match(html, /data-reader-mockup="true"/);
  assert.match(html, /<blockquote>Une citation sans bande\.<\/blockquote>/);
});

test("un visuel inconnu avertit en test et ne casse pas le rendu", () => {
  const messages: string[] = [];
  const originalWarn = console.warn;
  console.warn = (message) => messages.push(String(message));
  try {
    const html = render("Avant.\n\n[[schema:Inconnu]]\n\nAprès.");
    assert.match(html, /<p>Avant\.<\/p>/);
    assert.match(html, /<p>Après\.<\/p>/);
    assert.doesNotMatch(html, /data-reader-visual/);
    assert.deepEqual(messages, ["[reader] schema inconnu : Inconnu"]);
  } finally {
    console.warn = originalWarn;
  }

  const registry = read("components/schemas/registry.ts");
  assert.match(registry, /process\.env\.NODE_ENV !== "production"/);
});
