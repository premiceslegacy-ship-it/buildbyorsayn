import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const sectionPath = new URL(
  "../app/beginner/sections/Section1.tsx",
  import.meta.url
);
const homepagePath = new URL("../app/page.tsx", import.meta.url);
const foundationGridPath = new URL("../app/beginner/page.tsx", import.meta.url);
const foundationDataPath = new URL("../app/beginner/sections.data.ts", import.meta.url);
const foundationComponentsPath = new URL("../app/beginner/sections.components.tsx", import.meta.url);
const foundationDetailPath = new URL("../app/beginner/[sectionId]/page.tsx", import.meta.url);
const brandLogoReadmePath = new URL("../public/brand-logos/README.md", import.meta.url);
const blocClientPath = new URL("../app/blocs/[id]/BlocClient.tsx", import.meta.url);

test("les Fondations rendent visibles les workflows du chantier E", () => {
  assert.equal(existsSync(sectionPath), true);
  const source = readFileSync(sectionPath, "utf8");

  for (const requiredContent of [
    "Les workflows se prouvent dans le travail réel",
    "Recherche vers résultat",
    "Skill et synchronisation",
    "Source vers contenu",
    "Connexion vers action",
    "Miniature YouTube",
    "SEO et visibilité générative",
    "readback",
    "/brand-logos/hermes-agent-mark.png",
    "/brand-logos/tiktok.svg",
    "/brand-logos/youtube.svg",
    "/brand-logos/github.svg",
  ]) {
    assert.ok(source.includes(requiredContent), `contenu absent: ${requiredContent}`);
  }

  for (const privateMarker of ["Nora", "Atelier Marketing", "tiktok-2", "Treg", "Google Search Console"]) {
    assert.equal(source.includes(privateMarker), false, `marqueur interne exposé: ${privateMarker}`);
  }

  assert.equal(source.includes(String.fromCodePoint(0x2014)), false);
});

test("la preuve sociale de la homepage reste contextualisée", () => {
  const source = readFileSync(homepagePath, "utf8");
  assert.ok(source.includes("194 membres dans BUILD à ce jour"));
  assert.ok(source.includes("Repère de communauté, pas une promesse de résultat."));
  assert.equal(source.includes("194 membres ont déjà commencé"), false);
});

test("la grille client des Fondations ne transporte pas les chapitres payants", () => {
  const gridSource = readFileSync(foundationGridPath, "utf8");
  const dataSource = readFileSync(foundationDataPath, "utf8");
  const componentsSource = readFileSync(foundationComponentsPath, "utf8");
  const detailSource = readFileSync(foundationDetailPath, "utf8");

  assert.equal(gridSource.includes("./sections/"), false);
  assert.equal(dataSource.includes("./sections/"), false);
  assert.equal(dataSource.includes("Component:"), false);
  assert.ok(componentsSource.startsWith('import "server-only";'));
  assert.equal(detailSource.includes('"use client"'), false);
  assert.ok(detailSource.includes('from "@/lib/supabase/server"'));
  assert.ok(detailSource.includes("normalizeProfileTier"));
});

test("les actifs publics n'exposent pas de connexion interne ni de preuve sociale non étayée", () => {
  const brandLogoReadme = readFileSync(brandLogoReadmePath, "utf8");
  const blocClient = readFileSync(blocClientPath, "utf8");

  assert.equal(brandLogoReadme.includes("treg.to"), false);
  assert.equal(blocClient.includes("Communauté privée de builders actifs"), false);
});

test("un checkout Fondations absent reste réellement désactivé", () => {
  const source = readFileSync(homepagePath, "utf8");
  assert.ok(source.includes("const STRIPE_BEGINNER_URL = sanitizeStripeCheckoutUrl(process.env.STRIPE_BEGINNER_CHECKOUT_LINK);"));
  assert.ok(source.includes("const beginnerUrl = withClientReferenceId(STRIPE_BEGINNER_URL, user?.id);"));
  assert.equal(source.includes('STRIPE_BEGINNER_URL !== "#"'), false);
});
