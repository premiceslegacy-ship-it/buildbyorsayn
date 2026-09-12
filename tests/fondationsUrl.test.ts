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
  assert.match(source, /application Codex/);
  assert.match(source, /application Claude Code/);
  assert.match(source, /Lovable/);
  assert.match(source, /GitHub/);
  assert.match(source, /npm install/);
  assert.match(source, /npm run dev/);
  assert.match(source, /git init/);
  assert.match(source, /git remote add origin/);
  assert.match(source, /git branch -M main/);
  assert.match(source, /git push -u origin main/);
  assert.match(source, /\.gitignore/);
  assert.doesNotMatch(source, /<Command>git add \.<\/Command>/);
  assert.match(source, /Vercel/);
  assert.match(source, /Cloudflare/);
  assert.match(source, /Netlify/);
  assert.match(source, /GitHub Pages/);
  assert.match(source, /Railway/);
  assert.match(source, /Connect GitHub/);
  assert.match(source, /branche de production/);
  assert.match(source, /Deploy/);
  assert.match(source, /logs? de build/i);
  assert.match(source, /adresse publique/i);
  assert.match(source, /redéploie automatiquement/i);
  assert.match(source, /Sanity/);
  assert.match(source, /CMS/);
  assert.match(source, /Google Search Console/);
  assert.match(source, /Plausible/);
  assert.match(source, /PostHog/);
  assert.match(source, /Le vibe coding, c&apos;est simplement coder avec l&apos;IA/);
  assert.doesNotMatch(source, /Les cinq maisons|photographie son état|histoire locale/);
  assert.doesNotMatch(source, /no-code[^.]{0,80}bloquent/i);
});

test("le Bloc 10 montre les logos des outils à chaque étape", () => {
  const source = read("app/beginner/sections/Section4.tsx");
  for (const logo of [
    "codex.svg",
    "claude-code.svg",
    "antigravity.svg",
    "github.svg",
    "vercel.svg",
    "cloudflare.svg",
    "netlify.svg",
    "railway.svg",
    "sanity.svg",
    "googlesearchconsole.svg",
    "lovable.svg",
  ]) {
    assert.ok(source.includes(logo), `logo absent du Bloc 10: ${logo}`);
  }
});

test("tous les logos cités par les Blocs 09 et 10 existent réellement", () => {
  for (const logo of [
    "codex.svg", "claude-code.svg", "antigravity.svg", "github.svg",
    "lovable.svg", "vercel.svg", "cloudflare.svg", "netlify.svg",
    "railway.svg", "sanity.svg", "googlesearchconsole.svg",
    "plausibleanalytics.svg", "posthog.svg", "pagespeedinsights.svg",
  ]) {
    assert.doesNotThrow(() => read(`public/brand-logos/${logo}`), `fichier logo absent: ${logo}`);
  }
});

test("la navigation Fondations contient onze blocs correctement numérotés", () => {
  const data = read("app/beginner/sections.data.ts");
  const landing = read("app/beginner/page.tsx");

  assert.match(data, /id: "site-web"[\s\S]*num: "09"/);
  assert.match(data, /id: "url"[\s\S]*num: "10"/);
  assert.match(data, /ANGLE_MORT[\s\S]*num: "11"/);
  assert.match(landing, /Les onze blocs/);
});
