import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { SKILLS_CATALOG } from "../lib/skillsCatalog";
import { accessibleSkillCount, canDownloadSkill, lockedSkillCta } from "../app/skills/access";
import { CHAPTER_META, hermesStartPoints } from "../app/videos/tutos/chapters";
import { accountIncludedItems, accountTierLabel, accountUpgradeTarget } from "../components/account/accountPresentation";

test("Compte présente chaque palier sans offrir une montée inutile", () => {
  assert.equal(accountTierLabel("free"), "Gratuit");
  assert.deepEqual(accountIncludedItems("free"), ["Le contenu gratuit", "Ton compte BUILD"]);
  assert.equal(accountUpgradeTarget("free"), "full");
  assert.equal(accountTierLabel("beginner"), "Fondations");
  assert.match(accountIncludedItems("beginner").join(" "), /skills Fondations/);
  assert.equal(accountUpgradeTarget("beginner"), "complement");
  assert.equal(accountTierLabel("full"), "LE\u00a0COFFRE");
  assert.match(accountIncludedItems("full").join(" "), /Tous les skills/);
  assert.equal(accountUpgradeTarget("full"), null);
});

test("les trois paliers ne voient que leurs skills", () => {
  assert.equal(accessibleSkillCount(SKILLS_CATALOG, "free"), 0);
  assert.equal(accessibleSkillCount(SKILLS_CATALOG, "preview"), 0);
  assert.equal(accessibleSkillCount(SKILLS_CATALOG, "beginner"), SKILLS_CATALOG.filter((skill) => skill.access === "beginner").length);
  assert.equal(accessibleSkillCount(SKILLS_CATALOG, "full"), SKILLS_CATALOG.length);
  assert.equal(canDownloadSkill("beginner", "full"), false);
  assert.equal(canDownloadSkill("full", "beginner"), true);
  assert.equal(lockedSkillCta("free", "beginner"), "Prendre Fondations");
  assert.equal(lockedSkillCta("beginner", "full"), "Passer à LE\u00a0COFFRE");
});

test("Skills couvre téléchargement, mise à jour, échec, vide et BUILD Sync", async () => {
  const [page, client, loading, error] = await Promise.all([
    readFile("app/skills/page.tsx", "utf8"),
    readFile("app/skills/SkillsCatalogClient.tsx", "utf8"),
    readFile("app/skills/loading.tsx", "utf8"),
    readFile("app/skills/error.tsx", "utf8"),
  ]);
  assert.match(page, /SKILLS_CATALOG/);
  assert.match(page, /SkillsSyncCard/);
  assert.match(client, /fetch\(`\/api\/skills\/\$\{skill\.slug\}`\)/);
  assert.match(client, /Mettre à jour/);
  assert.match(client, /Aucun skill n’est disponible/);
  assert.match(client, /Le téléchargement a échoué/);
  assert.match(client, /canDownload \? <button className="btn btn--p"/);
  assert.match(client, /lockedHref \? <a className="btn btn--g"/);
  assert.doesNotMatch(client, /ui3-skill-badge/);
  assert.match(loading, /PageLoading/);
  assert.match(error, /reset/);
});

test("Hermes propose trois vrais points de départ et la structure de la maquette", async () => {
  const files = Object.keys(CHAPTER_META).map((path) => ({ path }));
  const points = hermesStartPoints(files);
  assert.equal(points.length, 3);
  assert.deepEqual(points.map((point) => point.intent), ["Commencer au début", "Obtenir un premier résultat", "Hermes est déjà installé"]);
  assert.ok(points.every((point) => point.meta === CHAPTER_META[point.file.path]));
  const page = await readFile("app/videos/tutos/page.tsx", "utf8");
  for (const marker of ["Par où commencer", "Lire depuis le début", "Voir les chapitres", "le texte est complet", '<footer className="foot">', "/da/hermes-3d.png"]) assert.match(page, new RegExp(marker));
});

test("Compte garde les contrôles de session et les confirmations", async () => {
  const [page, client, loading, error] = await Promise.all([
    readFile("app/compte/page.tsx", "utf8"),
    readFile("components/account/AccountClient.tsx", "utf8"),
    readFile("app/compte/loading.tsx", "utf8"),
    readFile("app/compte/error.tsx", "utf8"),
  ]);
  assert.match(page, /if \(!user\) redirect/);
  assert.match(client, /auth\.updateUser\(\{ data: \{ first_name: trimmed \} \}\)/);
  assert.match(client, /auth\.updateUser\(\{ email: nextEmail \}\)/);
  assert.match(client, /auth\.updateUser\(\{ password \}\)/);
  assert.match(client, /signOut\(\{ scope: "others" \}\)/);
  assert.match(client, /confirmEverywhere/);
  assert.match(client, /active=\{activeSection === row\.id\}/);
  assert.match(client, /ui3-setting-label/);
  assert.match(client, /<footer className="foot">/);
  assert.doesNotMatch(client, /deleteUser|Supprimer mon compte/);
  assert.match(loading, /PageLoading/);
  assert.match(error, /reset/);
});

test("connexion et récupération exposent chargement, réussite et erreur", async () => {
  const [login, forgot, update, loginLoading, forgotError, updateError] = await Promise.all([
    readFile("components/LoginForm.tsx", "utf8"),
    readFile("components/ForgotPasswordForm.tsx", "utf8"),
    readFile("app/update-password/page.tsx", "utf8"),
    readFile("app/login/loading.tsx", "utf8"),
    readFile("app/forgot-password/error.tsx", "utf8"),
    readFile("app/update-password/error.tsx", "utf8"),
  ]);
  assert.match(login, /signInWithPassword/);
  assert.match(login, /signUp/);
  assert.match(login, /Erreur réseau/);
  assert.match(forgot, /resetPasswordForEmail/);
  assert.match(forgot, /verifyOtp/);
  assert.match(forgot, /Code invalide ou expiré/);
  assert.match(update, /Les deux mots de passe ne correspondent pas/);
  assert.match(update, /Mot de passe changé/);
  for (const source of [login, forgot, update]) assert.match(source, /playAppSound\("(confirm|error)/);
  assert.match(loginLoading, /PageLoading/);
  assert.match(forgotError, /RouteErrorState/);
  assert.match(updateError, /RouteErrorState/);
});

test("les écrans d’accès MCP ferment la porte avant de charger les instructions", async () => {
  const page = await readFile("app/dashboard/mcp/page.tsx", "utf8");
  assert.match(page, /if \(profileError \|\| tier === null\)/);
  assert.match(page, /if \(tier !== "beginner" && tier !== "full"\)/);
  assert.ok(page.indexOf('if (tier !== "beginner" && tier !== "full")') < page.indexOf("getMcpConnectionStatus()"));
  assert.match(page, /Vérification indisponible/);
  assert.match(page, /revocation === "error"/);
});

test("Hermes a ses états de chargement et d’erreur", async () => {
  for (const route of ["videos/tutos"]) {
    const [loading, error] = await Promise.all([readFile(`app/${route}/loading.tsx`, "utf8"), readFile(`app/${route}/error.tsx`, "utf8")]);
    assert.match(loading, /PageLoading/, route);
    assert.match(error, /reset/, route);
  }
  const hermes = await readFile("app/videos/tutos/page.tsx", "utf8");
  assert.match(hermes, /files\.length === 0/);
  assert.match(hermes, /CHAPTER_META/);
});

test("les styles UI-3 respectent les largeurs et les garde-fous visuels", async () => {
  const css = await readFile("app/ui3.css", "utf8");
  assert.match(css, /--gutter/);
  assert.match(css, /@media \(max-width: 899px\)/);
  assert.match(css, /@media \(max-width: 734px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /border-left\s*:/);
});
