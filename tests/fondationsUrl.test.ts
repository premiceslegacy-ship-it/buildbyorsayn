import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (relativePath: string) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");

test("le Bloc 10 enseigne les parcours réels sans imposer un générateur no-code", () => {
  const source = read("app/beginner/sections/Section4.tsx");

  assert.match(source, />10</);
  assert.doesNotMatch(source, /<ul|<li|•/);
  assert.match(source, /Antigravity/);
  assert.match(source, /Open Folder/);
  assert.match(source, /Clone Repository/);
  assert.match(source, /Codex CLI/);
  assert.match(source, /Claude Code/);
  assert.match(source, /Lovable/);
  assert.match(source, /GitHub/);
  assert.match(source, /npm install/);
  assert.match(source, /npm run dev/);
  assert.match(source, /Vercel/);
  assert.match(source, /Cloudflare/);
  assert.match(source, /Netlify/);
  assert.match(source, /GitHub Pages/);
  assert.match(source, /Sanity/);
  assert.match(source, /CMS/);
  assert.doesNotMatch(source, /no-code[^.]{0,80}bloquent/i);
});

test("la navigation Fondations contient onze blocs correctement numérotés", () => {
  const data = read("app/beginner/sections.data.ts");
  const landing = read("app/beginner/page.tsx");

  assert.match(data, /id: "site-web"[\s\S]*num: "09"/);
  assert.match(data, /id: "url"[\s\S]*num: "10"/);
  assert.match(data, /ANGLE_MORT[\s\S]*num: "11"/);
  assert.match(landing, /Les onze blocs/);
});
