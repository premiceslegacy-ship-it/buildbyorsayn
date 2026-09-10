import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { DoctrineMarkdown, chapterTitle, doctrineHref, stripFrontmatter } from "../app/doctrine/markdown";

test("links only to verified chapters or safe external URLs; raw HTML stays text", () => {
  const html = render('[local](./intro.md#detail) [web](https://example.com) [bad](javascript:alert) [data](data:text/html,evil) [relative](missing.md) [traversal](../intro.md) [protocol](//evil.test) <script>alert(1)</script>');
  assert.match(html, /href="#chapitre-0"/);
  assert.match(html, /href="https:\/\/example.com"/);
  assert.equal((html.match(/<a /g) || []).length, 2);
  assert.doesNotMatch(html, /<script|href="(?:javascript|data|\/\/|\.\.)/);
  assert.match(html, /&lt;script&gt;/);
});

test("renders corpus tables with accessible headers and fenced code as literal text", () => {
  const html = render('# Chapitre\n\n| Notion | Usage |\n| --- | --- |\n| **Preuve** | [Lire](intro.md) |\n\n```html\n<script>danger()</script>\n```');
  assert.match(html, /<table>/);
  assert.match(html, /<th scope="col">Notion<\/th>/);
  assert.match(html, /<td><strong>Preuve<\/strong><\/td>/);
  assert.match(html, /<pre><code>&lt;script&gt;danger\(\)&lt;\/script&gt;<\/code><\/pre>/);
});

test("page uses a server-only renderer after authorization and verified storage", () => {
  const page = readFileSync(new URL("../app/doctrine/page.tsx", import.meta.url), "utf8");
  assert.match(page, /import "server-only"/);
  assert.match(page, /<DoctrineContent files=\{files\}/);
  assert.doesNotMatch(page, /<pre|use client|dangerouslySetInnerHTML/);
  assert.ok(page.indexOf("await doctrineAccessStatus()") < page.indexOf("await readPublishedDoctrine()"));
  const content = readFileSync(new URL("../app/doctrine/DoctrineContent.tsx", import.meta.url), "utf8");
  assert.match(content, /import "server-only"/);
  assert.doesNotMatch(content, /use client|dangerouslySetInnerHTML/);
});

test("malformed metadata stays hidden and encoded dangerous links are inert", () => {
  assert.equal(stripFrontmatter("\uFEFF---\r\nsecret: hidden\r\n"), "");
  for (const href of ["java\\nscript:alert(1)", "javascript&#58;alert", "%2e%2e/intro.md", "%2f%2fevil.md", "https://user:pass@example.com", "https://", "file:///tmp/a", "%ZZ", "https://evil\\\\host"]) {
    assert.equal(doctrineHref(href, files[0], files), undefined, href);
  }
});

const corpusDirectory = process.env.DOCTRINE_RENDER_CORPUS;
test("real nine-file corpus: all 17 links render to existing chapter anchors", { skip: !corpusDirectory && "Set DOCTRINE_RENDER_CORPUS to the private corpus directory" }, () => {
  const corpus = readdirSync(corpusDirectory!).filter(name => name.endsWith(".md")).sort().map(path => ({ path, content: readFileSync(join(corpusDirectory!, path), "utf8") }));
  assert.equal(corpus.length, 9);
  let count = 0;
  const ids = new Set(corpus.map((_, index) => `#chapitre-${index}`));
  for (const file of corpus) {
    const html = renderToStaticMarkup(createElement(DoctrineMarkdown, { file, files: corpus }));
    const links = [...stripFrontmatter(file.content).matchAll(/\]\(([^)]+\.md(?:#[^)]*)?)\)/g)];
    const rendered = [...html.matchAll(/href="(#chapitre-\d+)"/g)].map(match => match[1]);
    assert.equal(rendered.length, links.length, file.path);
    for (const [index, link] of links.entries()) {
      const target = doctrineHref(link[1], file, corpus);
      assert.ok(target && ids.has(target), file.path);
      assert.equal(rendered[index], target);
      count++;
    }
    assert.doesNotMatch(html, /build-tier:|<h1|dangerouslySetInnerHTML/);
    assert.match(html, /<h2/);
  }
  assert.equal(count, 17);
});

const files = [{ path: "intro.md", content: "---\nprivate: hidden\n---\n# Introduction\n\nUn **texte** avec `code`.\n\n- Premier\n- Second\n\n1. Suite\n2. Fin" }];
const render = (content: string) => renderToStaticMarkup(createElement(DoctrineMarkdown, { file: { ...files[0], content }, files }));
test("renders semantic chapter headings, paragraphs, lists and hides frontmatter", () => {
  const html = render(files[0].content);
  assert.match(html, /<h2[^>]*>Introduction<\/h2>/);
  assert.match(html, /<p>Un <strong>texte<\/strong> avec <code>code<\/code>\.<\/p>/);
  assert.match(html, /<ul><li>Premier<\/li><li>Second<\/li><\/ul>/);
  assert.match(html, /<ol start="1"><li>Suite<\/li><li>Fin<\/li><\/ol>/);
  assert.doesNotMatch(html, /private|hidden|---/);
  assert.equal(chapterTitle(files[0]), "Introduction");
});
