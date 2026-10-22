import assert from "node:assert/strict";
import test from "node:test";
import {
  COFFRE_LABEL,
  COFFRE_PRICE,
  FONDATIONS_PRICE,
  UPGRADE_PRICE,
  resolveCheckoutLinks,
  type CheckoutBaseLinks,
} from "../lib/pricing";
import { readCheckoutBaseLinks } from "../lib/checkoutLinks";
import { getOfferFacts, selectPricingView } from "../lib/pricingView";
import { BLOCS_DATA } from "../lib/blocCatalog";
import { SKILLS_CATALOG } from "../lib/skillsCatalog";

const BOTH = ["fondations", "coffre", "upgradeBand"];

test("anonyme, free, preview ou palier inconnu : les deux offres et la montée", () => {
  for (const tier of [null, undefined, "free", "preview", "inconnu", ""]) {
    assert.deepEqual(selectPricingView({ tier }).blocks, BOTH, `palier ${String(tier)}`);
  }
});

test("Fondations : uniquement la carte de montée vers LE COFFRE", () => {
  assert.deepEqual(selectPricingView({ tier: "beginner" }).blocks, ["upgradeCard"]);
});

test("full et admin : aucune carte d'achat, seulement la confirmation", () => {
  for (const tier of ["full", "admin"]) {
    const { blocks } = selectPricingView({ tier });
    assert.deepEqual(blocks, ["owned"], `palier ${tier}`);
  }
});

test("les prix de l'offre sont cohérents : la montée vaut la différence", () => {
  assert.equal(UPGRADE_PRICE, COFFRE_PRICE - FONDATIONS_PRICE);
  assert.equal(UPGRADE_PRICE, 170);
});

test("LE COFFRE ne se coupe jamais en fin de ligne", () => {
  assert.equal(COFFRE_LABEL.includes(" "), false);
  assert.match(COFFRE_LABEL, /^LE\u00a0COFFRE$/);
});

test("les chiffres de l'offre viennent du catalogue", () => {
  const facts = getOfferFacts();
  assert.equal(facts.blocs, BLOCS_DATA.length);
  assert.equal(facts.skillsCoffre, SKILLS_CATALOG.length);
  assert.equal(facts.skillsFondations, SKILLS_CATALOG.filter((s) => s.access === "beginner").length);
  assert.equal(facts.skillsExtra, facts.skillsCoffre - facts.skillsFondations);
  assert.ok(facts.skillsExtra > 0, "LE COFFRE ajoute au moins un skill");
});

const BASE: CheckoutBaseLinks = {
  beginner: "https://buy.stripe.com/aaa",
  full: "https://buy.stripe.com/ccc",
};

test("visiteur anonyme : les liens de base, sans identifiant", () => {
  assert.deepEqual(resolveCheckoutLinks(BASE, null), {
    fondations: "https://buy.stripe.com/aaa",
    coffre: "https://buy.stripe.com/ccc",
  });
});

test("visiteur connecté : l'identifiant du compte est ajouté une seule fois, bien encodé", () => {
  const links = resolveCheckoutLinks(BASE, "user 1&x=2");
  assert.equal(links.fondations, "https://buy.stripe.com/aaa?client_reference_id=user%201%26x%3D2");
  assert.equal(links.coffre, "https://buy.stripe.com/ccc?client_reference_id=user%201%26x%3D2");
  for (const url of Object.values(links)) {
    assert.equal(new URL(url!).searchParams.getAll("client_reference_id").length, 1);
  }
});

test("lien absent, invalide ou déjà marqué : null, jamais un lien mort", () => {
  const links = resolveCheckoutLinks(
    {
      beginner: null,
      full: "https://buy.stripe.com/ccc?client_reference_id=autre",
    },
    "abc",
  );
  assert.deepEqual(links, { fondations: null, coffre: null });
});

test("la lecture de l'environnement refuse tout ce qui n'est pas un lien Stripe https", () => {
  const base = readCheckoutBaseLinks({
    STRIPE_BEGINNER_CHECKOUT_LINK: "https://evil.example/pay",
  });
  assert.equal(base.beginner, null);
  assert.ok(base.full, "le lien LE COFFRE reste disponible");
  assert.equal("upgrade" in base, false, "le lien du complément n'est jamais exposé avec les liens publics");

  assert.equal(readCheckoutBaseLinks({}).beginner, null);
});

test("accès impossible à vérifier : aucune carte d'achat, quel que soit le niveau lu", () => {
  for (const tier of [null, "free", "beginner", "full"]) {
    assert.deepEqual(selectPricingView({ tier, unverified: true }).blocks, ["unverified"], String(tier));
  }
});
