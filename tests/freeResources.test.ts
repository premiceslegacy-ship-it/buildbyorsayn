import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  FREE_RESOURCES,
  FREE_RESOURCE_SLUGS,
  canDownloadFreeResource,
  freeResourceDownloadHref,
  freeResourceSignupHref,
  freeResourceStoragePath,
  getFreeResource,
  normalizeFreeResourceSource,
} from "../lib/freeResources";
import { BLOCS_DATA } from "../lib/blocCatalog";
import { SKILLS_CATALOG } from "../lib/skillsCatalog";
import { toolLogoSrc } from "../lib/tools/registry";
import { FREE_RESOURCE_PREVIEWS } from "../lib/freeResources";
import { BLOC_THEMES, FONDATIONS_THEMES } from "../lib/themes";

const root = path.resolve(import.meta.dirname, "..");
const migration = readFileSync(path.join(root, "supabase/migrations/20261113120000_free_resources.sql"), "utf8");

test("le catalogue couvre exactement les slugs connus, avec un fichier .zip chacun", () => {
  assert.deepEqual(FREE_RESOURCES.map((resource) => resource.slug).sort(), [...FREE_RESOURCE_SLUGS].sort());
  for (const resource of FREE_RESOURCES) {
    assert.match(resource.fileName, /^[a-z0-9-]+\.zip$/);
    assert.equal(freeResourceStoragePath(resource), resource.fileName);
    assert.ok(resource.includes.length >= 3, `${resource.slug} doit lister ce qu'il contient`);
  }
  assert.equal(getFreeResource("inconnu"), null);
});

test("le texte respecte les règles d'écriture : pas de tiret long, pas de prix ni de chiffre écrit en dur", () => {
  for (const resource of FREE_RESOURCES) {
    const text = [resource.title, resource.promise, resource.meta, resource.next.text, ...resource.includes].join(" ");
    assert.doesNotMatch(text, /[—–]/);
    assert.doesNotMatch(text, /\d/);
    assert.doesNotMatch(text, /[€$]/);
  }
});

test("chaque prochain pas pointe vers un bloc ou un skill qui existe", () => {
  for (const resource of FREE_RESOURCES) {
    const { blocId, skillSlug } = resource.next;
    assert.ok(blocId || skillSlug, `${resource.slug} doit proposer une suite`);
    if (blocId) assert.ok(BLOCS_DATA.some((bloc) => bloc.id === blocId));
    if (skillSlug) assert.ok(SKILLS_CATALOG.some((skill) => skill.slug === skillSlug));
  }
});

test("un compte suffit : aucun niveau d'achat n'est demandé", () => {
  assert.equal(canDownloadFreeResource("a-user-id"), true);
  assert.equal(canDownloadFreeResource(null), false);
  assert.equal(canDownloadFreeResource(undefined), false);
  assert.equal(canDownloadFreeResource(""), false);
});

test("la source est une valeur fermée et ne reprend jamais le texte brut", () => {
  assert.equal(normalizeFreeResourceSource("Instagram"), "instagram");
  assert.equal(normalizeFreeResourceSource(["tiktok", "x"]), "tiktok");
  assert.equal(normalizeFreeResourceSource("<script>alert(1)</script>"), "direct");
  assert.equal(normalizeFreeResourceSource(undefined), "direct");
});

test("les adresses de création de compte et de téléchargement gardent la ressource et la source", () => {
  assert.equal(freeResourceSignupHref("slop", "instagram"), "/login?mode=signup&next=%2Fressources%3Fr%3Dslop%26s%3Dinstagram");
  assert.equal(freeResourceSignupHref(null, "direct"), "/login?mode=signup&next=%2Fressources");
  assert.equal(freeResourceDownloadHref("skill", "tiktok"), "/api/ressources/skill?s=tiktok");
  assert.equal(freeResourceDownloadHref("skill", "direct"), "/api/ressources/skill");
});

test("la table de téléchargements est protégée : lecture de ses lignes seulement, écriture par le serveur", () => {
  assert.match(migration, /enable row level security/);
  assert.match(migration, /force row level security/);
  assert.match(migration, /revoke all on table public\.free_resource_downloads from anon, authenticated/);
  assert.match(migration, /grant select on table public\.free_resource_downloads to authenticated/);
  assert.doesNotMatch(migration, /grant (insert|update|delete)/);
  assert.match(migration, /auth\.uid\(\) = user_id/);
  for (const slug of FREE_RESOURCE_SLUGS) assert.match(migration, new RegExp(`'${slug}'`));
});

test("la route de téléchargement exige un compte, limite le débit et ne rend jamais le fichier public", () => {
  const route = readFileSync(path.join(root, "app/api/ressources/[slug]/route.ts"), "utf8");
  assert.match(route, /canDownloadFreeResource/);
  assert.match(route, /freeResourceSignupHref/);
  assert.match(route, /reservePrivateDownload/);
  assert.match(route, /createSignedUrl\(.*?,\s*60\b/s);
  assert.doesNotMatch(route, /getPublicUrl/);
});

test("chaque ressource montre un rendu : logos connus, objet de la marque, aperçu prévu", () => {
  for (const resource of FREE_RESOURCES) {
    assert.ok((FREE_RESOURCE_PREVIEWS as readonly string[]).includes(resource.preview));
    assert.ok(resource.logos.length >= 1);
    for (const name of resource.logos) assert.ok(toolLogoSrc(name), `logo inconnu : ${name}`);
    assert.ok(existsSync(path.join(root, "public", resource.object)), `objet absent : ${resource.object}`);
  }
});

test("les sept blocs et les trois parties des Fondations ont un thème général et gardent leur ancien titre en sous-titre", () => {
  assert.equal(Object.keys(BLOC_THEMES).length, 7);
  assert.equal(Object.keys(FONDATIONS_THEMES).length, 3);
  for (const bloc of BLOCS_DATA) {
    assert.ok(BLOC_THEMES[bloc.id], `thème manquant pour le bloc ${bloc.id}`);
    assert.equal(bloc.titre, `Bloc ${bloc.displayNumber} : ${BLOC_THEMES[bloc.id].theme}`);
    assert.ok(BLOC_THEMES[bloc.id].sousTitre.length > 3);
  }
});
