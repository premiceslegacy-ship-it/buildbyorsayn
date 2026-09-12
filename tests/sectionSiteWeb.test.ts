import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const componentPath = new URL(
  "../app/beginner/sections/SectionSiteWeb.tsx",
  import.meta.url
);

test("le bloc 09 couvre le parcours éditorial complet avec les primitives BUILD", () => {
  assert.equal(
    existsSync(componentPath),
    true,
    "SectionSiteWeb.tsx doit exister"
  );

  const source = readFileSync(componentPath, "utf8");

  for (const requiredImport of [
    "SectionReveal",
    "LiquidCard",
    "MarkdownFilePreview",
  ]) {
    assert.match(source, new RegExp(`import \\{ ${requiredImport} \\}`));
  }

  for (const requiredContent of [
    "Construire un site web avec l&apos;IA",
    "La structure d&apos;une page qui vend",
    "Navbar",
    "Hero section",
    "proposition de valeur",
    "H1",
    "Sous-titre",
    "CTA principal",
    "Réponse en 24 h",
    "Le copywriting",
    "les mots de tes clients",
    "Fonctionnalité",
    "Bénéfice",
    "L&apos;ordre des sections",
    "Construire une vraie identité",
    "AI slop",
    "Glassmorphism",
    "Liquid Glass",
    "Skeuomorphism",
    "Néo-brutalisme",
    "Minimalisme",
    "Swiss design",
    "Maximalisme",
    "Rétro-futurisme",
    "Éditorial",
    "Brutalisme",
    "Dither",
    "deep-research-vertical",
    "oracle-site-web",
    "/skills#skill-oracle-site-web",
    "ux-ui-design",
    "Skills Apple",
    "backend-orsayn",
    "Codex",
    "Claude Code",
    "Antigravity",
    "GitHub",
    "Google Search Console",
    "impressions",
    "clics",
    "requêtes",
    "position moyenne",
    "Plausible",
    "PostHog",
    "visiteurs",
    "formulaire commencé",
    "formulaire envoyé",
    "PageSpeed Insights",
    "libellé visible",
    "obligatoire ou facultatif",
    "message d&apos;erreur près du champ",
    "confirmation claire",
    "où arrive la demande",
    "utilisation de ses données",
  ]) {
    assert.ok(source.includes(requiredContent), `contenu absent: ${requiredContent}`);
  }

  for (const artifact of [
    "SITEMAP.md",
    "PAGE-BLUEPRINT.md",
    "COPY-DECK.md",
    "DESIGN-SYSTEM.md",
    "QA-REPORT.md",
  ]) {
    assert.ok(source.includes(artifact), `artefact absent: ${artifact}`);
  }

  assert.equal(source.includes(String.fromCodePoint(0x2014)), false);
  for (const forbiddenCopy of [
    "Noyau éprouvé",
    "Construire par artefacts validés",
    "tokens sémantiques",
    "requalifié",
    "Une direction artistique n&apos;est pas une humeur",
  ]) {
    assert.equal(
      source.includes(forbiddenCopy),
      false,
      `formulation trop abstraite encore présente: ${forbiddenCopy}`
    );
  }
  assert.ok(
    (source.match(/<LiquidCard/g) ?? []).length <= 3,
    "LiquidCard doit rester rare pour éviter un mur de cartes"
  );
});

test("le Bloc 09 montre les logos des outils cités", () => {
  const source = readFileSync(componentPath, "utf8");
  for (const logo of [
    "codex.svg",
    "claude-code.svg",
    "antigravity.svg",
    "github.svg",
    "googlesearchconsole.svg",
    "plausibleanalytics.svg",
    "posthog.svg",
    "pagespeedinsights.svg",
  ]) {
    assert.ok(source.includes(logo), `logo absent du Bloc 09: ${logo}`);
  }
});

test("le Bloc 09 garde les textes pédagogiques lisibles", () => {
  const source = readFileSync(componentPath, "utf8");
  assert.doesNotMatch(source, /text-white\/(?:[0-4][0-9])\b/);
  assert.doesNotMatch(source, /text-\[#e8d5b0\]\/45\b/);
});

test("oracle-site-web possède une cible interne sur la page Skills", () => {
  const skillsPage = readFileSync(
    new URL("../app/skills/page.tsx", import.meta.url),
    "utf8"
  );
  assert.match(skillsPage, /id=\{`skill-\$\{skill\.slug\}`\}/);
  const catalog = readFileSync(
    new URL("../lib/skillsCatalog.ts", import.meta.url),
    "utf8"
  );
  assert.match(catalog, /slug: "oracle-site-web"/);
});

test("les révélations respectent la préférence de mouvement réduit", () => {
  const source = readFileSync(
    new URL("../components/ui/section-reveal.tsx", import.meta.url),
    "utf8"
  );

  assert.match(source, /useReducedMotion/);
  assert.match(source, /duration: shouldReduceMotion \? 0 : 0\.6/);
});

test("le nouvel asset Fondations appartient au manifeste canonique", () => {
  const manifest = readFileSync(
    new URL(
      "../private/brand-assets/build-collection-cards/manifest/asset-manifest.json",
      import.meta.url
    ),
    "utf8"
  );

  assert.match(manifest, /"id": "fondations-site-web"/);
  assert.match(manifest, /pages\/fondations\/09-construire-un-site-web-avec-l-ia/);
  assert.match(manifest, /pages\/fondations\/10-de-l-idee-a-l-url-en-ligne/);
  assert.match(manifest, /pages\/fondations\/11-le-seuil/);
});
