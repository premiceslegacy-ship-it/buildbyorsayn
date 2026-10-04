import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";

const root = new URL("../", import.meta.url);

function read(relativePath: string): string {
  return readFileSync(new URL(relativePath, root), "utf8");
}

function sha256(relativePath: string): string {
  return createHash("sha256").update(readFileSync(new URL(relativePath, root))).digest("hex");
}

test("le cours de copywriting part de scènes simples et refuse le jargon flou", () => {
  const source = read("app/beginner/sections/SectionCopywriting.tsx");
  const siteSection = read("app/beginner/sections/SectionSiteWeb.tsx");

  for (const required of [
    "Le copywriting, c'est expliquer une offre avec des mots simples.",
    "Le moment",
    "Le vrai problème",
    "Le progrès",
    "Ce qui le permet",
    "Est-ce que vous savez le faire ?",
    "Bonjour l'équipe Martin",
    "cherche une réponse, pas une vente",
    "enfant de 10 ans",
    "On ne comprend pas",
    "On voit la scène",
    "Avant de publier",
  ]) {
    assert.ok(source.includes(required) || siteSection.includes(required), `contenu pédagogique absent: ${required}`);
  }

  for (const rejected of [
    "TROP VAGUE",
    "À TESTER",
    "Le gain ne vient pas d'un outil de plus",
    "Le but du premier message est souvent",
    "Le discernement est une compétence de copywriting.",
    "Des solutions digitales innovantes",
  ]) {
    assert.equal(source.includes(rejected) || siteSection.includes(rejected), false, `ancienne formulation trop abstraite: ${rejected}`);
  }
});

test("les encadrés BUILD sont éditoriaux, jamais des traits latéraux génériques", () => {
  const note = read("app/beginner/FoundationEditorialNote.tsx");
  assert.match(note, /border-y/);
  assert.match(note, /sm:grid-cols/);
  assert.doesNotMatch(note, /border-l/);

  for (const relativePath of [
    "app/beginner/sections/Section1.tsx",
    "app/beginner/sections/Section2.tsx",
    "app/beginner/sections/SectionCopywriting.tsx",
    "app/beginner/sections/SectionVente.tsx",
    "app/beginner/sections/SectionMarketing.tsx",
    "app/beginner/sections/SectionSiteWeb.tsx",
    "app/beginner/sections/Section4.tsx",
    "app/videos/tutos/page.tsx",
    "app/accompagnement/page.tsx",
  ]) {
    assert.doesNotMatch(read(relativePath), /border-l-2/);
  }

  const detailPage = read("app/beginner/[sectionId]/page.tsx");
  assert.match(detailPage, /mt-16/);
  assert.match(detailPage, /sm:mt-20/);
});

test("les collections Hermes Agent et Fondations partagent chacune une seule illustration contrôlée", () => {
  const foundations = read("app/beginner/sections.data.ts");
  const chapters = read("app/videos/tutos/chapters.tsx");

  assert.equal((foundations.match(/illustrationId: "fondations-tech-foundation"/g) ?? []).length, 11);
  assert.doesNotMatch(foundations, /illustrationId: "fondations-(?!tech-foundation)/);
  assert.equal((chapters.match(/illustrationId: "hermes-agent-unified"/g) ?? []).length, 18);

  for (const relativePath of [
    "public/assets/illustrations/hermes-agent-unified.png",
    "public/assets/illustrations/fondations-tech-foundation.png",
  ]) {
    assert.equal(existsSync(new URL(relativePath, root)), true, `asset absent: ${relativePath}`);
  }

  assert.doesNotMatch(chapters, /hermes-agent-(?!unified)/);

  assert.equal(sha256("public/assets/illustrations/hermes-agent-unified.png"), "59d05c11cc277414a180891a7395873ef100516d9565ccfeb839de7bc22ed51f");
  assert.equal(sha256("public/assets/illustrations/fondations-tech-foundation.png"), "d3115fbcedc8944d02533b4923f85beecc1338cd474f7bf156a6ce9b09bb080d");
});

test("la page Hermes Agent commence par une mission et range les chapitres comme un parcours", () => {
  const page = read("app/videos/tutos/page.tsx");
  const chapters = read("app/videos/tutos/chapters.tsx");

  for (const required of [
    "Choisis une tâche avant de choisir un outil.",
    "Trois cas d'usage, avec leur état réel.",
    "Un parcours, pas une liste de mots compliqués.",
    "Installe Hermes après avoir choisi le premier travail à lui confier.",
    "Un carrousel Atelier",
    "Google Search Console avec Treg, puis un brouillon contrôlé",
    "Treg lit les données first-party de Google Search Console",
    "sans remplacer le choix humain.",
    "Le cron ne publie pas, ne pousse pas et ne demande pas d'indexation sans validation humaine.",
  ]) {
    assert.match(page, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  for (const section of ["start", "first-workflow", "reliable", "team"]) {
    assert.match(chapters, new RegExp(`key: "${section}"`));
  }

  assert.doesNotMatch(page, /HERMES_LAYERS|OpenRouter|DeepSeek|OpenCode|Tailscale/);
});
