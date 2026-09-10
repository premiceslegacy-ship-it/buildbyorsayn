// Local rendering lab, not an authenticated route or a storage integration test.
// Run: node --import tsx tests/doctrineRendering.browser.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "@playwright/test";
import { DoctrineMarkdown, chapterTitle } from "../app/doctrine/markdown";

const files = [
  { path: "intro.md", content: "---\nprivate: hidden\n---\n# Comprendre avant de construire\n\nUn texte de lecture avec une **décision explicite**, du `code` et un [chapitre suivant](suite.md).\n\n## Lire et vérifier\n\n- Observer le besoin\n- Vérifier le résultat\n\n| Une décision métier au libellé long | Preuve attendue | Limites |\n| --- | --- | --- |\n| Observer | Résultat documenté | Aucun résultat inventé |" },
  { path: "suite.md", content: "# Mettre en pratique\n\n1. Définir le périmètre\n2. Vérifier les preuves\n\n[Revenir au premier chapitre](intro.md)" },
];
const body = renderToStaticMarkup(h("main", null, h("h1", null, "Doctrine agentique"), h("div", { className: "doctrine-reader" },
  h("nav", { id: "sommaire", className: "doctrine-toc", "aria-label": "Chapitres" }, h("ol", null, files.map((file, i) => h("li", { key: file.path }, h("a", { href: `#chapitre-${i}` }, chapterTitle(file)))))),
  files.map((file, i) => h("section", { key: file.path, id: `chapitre-${i}`, className: "doctrine-chapter", tabIndex: -1 }, h(DoctrineMarkdown, { file, files }))))));
const css = readFileSync(new URL("../app/doctrine/doctrine.css", import.meta.url), "utf8");
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [390, 768, 1280]) {
    const page = await browser.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.setContent(`<!doctype html><html lang="fr"><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#0e0e0f;color:#f0ede8;font-family:system-ui}main{max-width:768px;margin:auto;padding:24px}a{color:inherit}${css}</style><body>${body}</body></html>`);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator("h2").count(), 2);
    assert.equal(await page.locator("table th[scope=col]").count(), 3);
    assert.equal(await page.locator("body").innerText().then(text => text.includes("private: hidden")), false);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `overflow at ${width}`);
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("href")), "#chapitre-0");
    assert.equal(await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle), "solid");
    await page.keyboard.press("Enter");
    assert.equal(await page.evaluate(() => location.hash), "#chapitre-0");
    for (const href of await page.locator("a").evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!))) {
      assert.equal(await page.locator(href).count(), 1, href);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `zoom overflow at ${width}`);
    console.log(`PASS ${width}px: headings, tables, metadata, anchors, keyboard focus, 200% text, reduced-motion`);
  }
} finally { await browser.close(); }
