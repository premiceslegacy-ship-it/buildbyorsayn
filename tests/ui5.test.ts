import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { BLOCS_DATA } from "../lib/blocCatalog";
import { programmeForTier } from "../lib/programme";
import { purchaseRevealSchedule, purchaseState } from "../components/ui5/purchaseModel";
import { nonBreakingWelcomeName, welcomeChoices, welcomeDisplayName } from "../components/ui5/welcomeModel";

test("bienvenue n’utilise jamais l’adresse e-mail comme prénom", () => {
  assert.equal(welcomeDisplayName({}), "");
  assert.equal(welcomeDisplayName({ email: "build-e2e-full-1790536899862@example.com" }), "");
  assert.equal(welcomeDisplayName({ first_name: "  Samuel-Paul  " }), "Samuel-Paul");
  assert.equal(welcomeDisplayName({ full_name: "Samuel Paul Orsayn" }), "Samuel");
  assert.equal(nonBreakingWelcomeName("Samuel-Paul"), "Samuel\u2011Paul");
});

test("bienvenue ne propose que de vraies destinations autorisées", () => {
  for (const tier of ["preview", "beginner", "full"] as const) {
    const cards = programmeForTier(tier).flatMap((section) => section.cards);
    const choices = welcomeChoices(tier, cards);
    assert.ok(choices.length > 0, tier);
    for (const choice of choices) {
      const source = cards.find((card) => card.id === choice.id);
      assert.ok(source && !source.locked, `${tier}/${choice.id}`);
      assert.equal(choice.href, source.href);
    }
  }
  const freeCards = programmeForTier("free").flatMap((section) => section.cards);
  assert.deepEqual(welcomeChoices("free", freeCards).map(({ id, href }) => ({ id, href })), [{ id: "programme", href: "/programme" }]);
});

test("fin confirme seulement les paliers payants lus côté serveur", () => {
  for (const tier of [null, "free", "preview"] as const) assert.equal(purchaseState({ tier, authenticated: true, unverified: false, entries: [] }).kind, "pending");
  assert.equal(purchaseState({ tier: "full", authenticated: true, unverified: true, entries: [] }).kind, "error");
  const beginnerEntries = programmeForTier("beginner")[0].cards.map((card) => ({
    id: card.id,
    label: card.id === "fondations-1" ? "Fondations 1" : card.id === "fondations-2" ? "Fondations 2" : "LA DISTILLATION",
    title: card.title,
    image: card.image,
  }));
  const beginner = purchaseState({ tier: "beginner", authenticated: true, unverified: false, entries: beginnerEntries });
  assert.equal(beginner.kind, "confirmed");
  if (beginner.kind === "confirmed") assert.deepEqual(beginner.entries.map((entry) => entry.label), ["Fondations 1", "Fondations 2", "LA DISTILLATION"]);
  const fullEntries = BLOCS_DATA.slice(1).map((bloc) => ({ id: bloc.id, label: `Bloc ${bloc.displayNumber}`, title: bloc.titre, image: `/da/mini/b${bloc.displayNumber}.jpg` }));
  const full = purchaseState({ tier: "full", authenticated: true, unverified: false, entries: fullEntries });
  assert.equal(full.kind, "confirmed");
  if (full.kind === "confirmed") {
    assert.equal(full.entries.length, BLOCS_DATA.length - 1);
    assert.deepEqual(full.entries.map((entry) => entry.label), BLOCS_DATA.slice(1).map((bloc) => `Bloc ${bloc.displayNumber}`));
    const schedule = purchaseRevealSchedule(full.entries.length);
    assert.equal(schedule.rows.length, full.entries.length);
    assert.ok(schedule.actionAt < 5_000);
    assert.ok(schedule.rows.every((row) => row.openAt > row.revealAt));
  }
});

test("fin ne fait confiance ni au niveau ni à un état reçu dans l'URL", async () => {
  const source = await readFile("app/fin/page.tsx", "utf8");
  assert.doesNotMatch(source, /searchParams|params\.niveau|params\.etat/);
  assert.match(source, /from\("profiles"\)/);
  assert.match(source, /normalizeProfileTier/);
  assert.match(source, /<NavBar/);
  assert.doesNotMatch(await readFile("components/ui5/PurchaseConfirmation.tsx", "utf8"), /Voir mes accès/);
});

test("le consentement BUILD Sync garde toutes ses protections serveur", async () => {
  const source = await readFile("app/build-sync/consent/page.tsx", "utf8");
  for (const invariant of [
    /\^\[A-Za-z0-9_\-\]\{43\}\$/,
    /hashToken\(requestHandle\)/,
    /\.eq\("user_id", user\.id\)/,
    /\.is\("consumed_at", null\)/,
    /\.gt\("expires_at", new Date\(\)\.toISOString\(\)\)/,
    /approveBuildSyncConsent/,
    /denyBuildSyncConsent/,
  ]) assert.match(source, invariant);
});

test("les écrans UI-5 référencent uniquement des ressources publiques présentes", async () => {
  const files = [
    "components/ui5/WelcomeJourney.tsx",
    "components/ui5/welcomeModel.ts",
    "components/ui5/CheckoutView.tsx",
    "components/ui5/purchaseModel.ts",
    "components/da/BuildSyncConsentCard.tsx",
    "app/checkout/checkout.css",
  ];
  const references = new Set<string>();
  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(/["(]((?:\/da|\/fonts|\/sfx)\/[^"')$]+)["')]/g)) references.add(match[1]);
  }
  assert.ok(references.size > 0);
  for (const reference of references) assert.equal(existsSync(`public${reference}`), true, reference);
});

test("404 et erreurs racine gardent une action principale et une vraie reprise", async () => {
  const [state, error, globalError, notFound] = await Promise.all([
    readFile("components/ui/AppState.tsx", "utf8"),
    readFile("app/error.tsx", "utf8"),
    readFile("app/global-error.tsx", "utf8"),
    readFile("app/not-found.tsx", "utf8"),
  ]);
  assert.match(state, /className="btn btn--p"/);
  assert.match(error, /reset/);
  assert.match(globalError, /reset/);
  assert.match(notFound, /AppState/);
});

test("checkout lit les prix et les compteurs depuis le code", async () => {
  const source = await readFile("components/ui5/CheckoutView.tsx", "utf8");
  for (const name of ["FONDATIONS_PRICE", "COFFRE_PRICE", "UPGRADE_PRICE", "getOfferFacts"]) assert.match(source, new RegExp(name));
  assert.doesNotMatch(source, /https:\/\/buy\.stripe\.com/);
});
