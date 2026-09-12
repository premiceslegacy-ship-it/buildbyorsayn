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
    "Choisir le bon type de site",
    "Anatomie et arborescence",
    "Faire avancer sans manipuler",
    "Du moodboard aux règles",
    "Glassmorphism",
    "Liquid Glass",
    "Skeuomorphism",
    "Éditorial",
    "Brutalisme",
    "Dither",
    "Icônes, images, motion et états",
    "Réutiliser sans cloner",
    "deep-research-vertical",
    "oracle-site-web",
    "ux-ui-design",
    "Skills Apple",
    "backend-orsayn",
    "Construire par artefacts validés",
    "Rendre le site visible et rapide",
    "Core Web Vitals",
    "Largest Contentful Paint",
    "Interaction to Next Paint",
    "Cumulative Layout Shift",
    "canonical",
    "sitemap.xml",
    "robots.txt",
    "Données structurées",
    "budget de performance",
    "Prouver que le site tient",
    "Améliorer depuis le réel",
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
  assert.ok(
    (source.match(/<LiquidCard/g) ?? []).length <= 3,
    "LiquidCard doit rester rare pour éviter un mur de cartes"
  );
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
