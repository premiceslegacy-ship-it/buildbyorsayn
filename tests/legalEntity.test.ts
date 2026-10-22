import test from "node:test";
import assert from "node:assert/strict";
import {
  describeLegalIssues,
  describeSeller,
  isValidSiren,
  isValidSiret,
  LEGAL_ENV,
  parseLegalEntity,
  resolveLegalEntity,
} from "../lib/legal/entity";
import { DEFAULT_VAT_MENTION, PUBLIC_IDENTITY } from "../lib/legal/identity";

test("sans aucune variable, l'identité publique par défaut est complète et valide", () => {
  const parsed = parseLegalEntity({});
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  const { entity } = parsed;
  assert.equal(entity.fullName, "Samuel Mbeboura");
  assert.equal(entity.tradeName, "Orsayn");
  assert.equal(entity.siret, PUBLIC_IDENTITY.siret);
  assert.equal(entity.siren, "989208152");
  assert.equal(entity.address, "1 rue des héraults, 37550 Saint-Avertin");
  assert.equal(entity.contactEmail, "contact@orsayn.fr");
  assert.equal(entity.vatMention, DEFAULT_VAT_MENTION);
  assert.equal(entity.mediator, null);
  assert.equal(entity.capital, null);
  assert.equal(entity.registry, null);
  assert.equal(describeSeller(entity), "Samuel Mbeboura, entrepreneur individuel exerçant sous le nom commercial Orsayn");
  assert.equal(resolveLegalEntity({}).siret, PUBLIC_IDENTITY.siret);
});

test("une variable remplace la valeur par défaut, la ville et le code postal compris", () => {
  const parsed = parseLegalEntity({
    [LEGAL_ENV.postalCode]: "75010",
    [LEGAL_ENV.city]: "Paris",
    [LEGAL_ENV.street]: "8 avenue du Test",
    [LEGAL_ENV.vatMention]: "TVA intracommunautaire FR12345678901",
    [LEGAL_ENV.capital]: "1 000 euros",
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.entity.address, "8 avenue du Test, 75010 Paris");
  assert.equal(parsed.entity.vatMention, "TVA intracommunautaire FR12345678901");
  assert.equal(parsed.entity.capital, "1 000 euros");
});

test("le médiateur est facultatif, et ne s'active que si le nom et l'adresse web sont donnés ensemble", () => {
  const both = parseLegalEntity({ [LEGAL_ENV.mediatorName]: "Médiateur Test Réel", [LEGAL_ENV.mediatorUrl]: "https://mediation.test-reel.fr/saisir" });
  assert.equal(both.ok && both.entity.mediator?.name, "Médiateur Test Réel");
  assert.equal(both.ok && both.entity.mediator?.url, "https://mediation.test-reel.fr/saisir");

  for (const only of [{ [LEGAL_ENV.mediatorName]: "Médiateur Test Réel" }, { [LEGAL_ENV.mediatorUrl]: "https://mediation.test-reel.fr" }]) {
    const parsed = parseLegalEntity(only);
    assert.equal(parsed.ok, false);
    if (!parsed.ok) assert.equal(parsed.issues.length, 1);
  }
  assert.equal(parseLegalEntity({ [LEGAL_ENV.mediatorName]: "Médiateur Test Réel", [LEGAL_ENV.mediatorUrl]: "http://pas-securise.fr" }).ok, false);
});

test("le SIRET est normalisé, sa clé de contrôle est vérifiée et le SIREN en est dérivé", () => {
  const parsed = parseLegalEntity({ [LEGAL_ENV.siret]: "552 100 554 00055" });
  if (parsed.ok) assert.equal(parsed.entity.siren, "552100554");
  assert.equal(isValidSiret(PUBLIC_IDENTITY.siret), true);
  assert.equal(isValidSiren("989208152"), true);
  assert.equal(isValidSiret("98920815200012"), false);
  assert.equal(isValidSiret("9892081520001"), false);
});

test("une variable mal formée est une erreur claire en français qui ne répète jamais la valeur", () => {
  for (const bad of ["9892081520001", "98920815200012", "9892081520001A"]) {
    const parsed = parseLegalEntity({ [LEGAL_ENV.siret]: bad });
    assert.equal(parsed.ok, false, `${bad} doit être refusé`);
    if (parsed.ok) continue;
    assert.equal(parsed.issues[0].variable, LEGAL_ENV.siret);
    assert.equal(parsed.issues[0].kind, "invalid");
    assert.ok(!describeLegalIssues(parsed.issues).includes(bad));
  }
  assert.throws(
    () => resolveLegalEntity({ [LEGAL_ENV.siret]: "123" }),
    (error: unknown) => error instanceof Error && error.message.startsWith("Identité légale") && error.message.includes(LEGAL_ENV.siret) && !error.message.includes("123"),
  );
});

test("code postal, téléphone, e-mail, textes provisoires et tirets longs sont refusés", () => {
  const cases: Array<[string, string]> = [
    [LEGAL_ENV.postalCode, "3755"],
    [LEGAL_ENV.postalCode, "37 550"],
    [LEGAL_ENV.city, "[Ville]"],
    [LEGAL_ENV.city, "à compléter"],
    [LEGAL_ENV.phone, "pas de téléphone"],
    [LEGAL_ENV.contactEmail, "pas-un-email"],
    [LEGAL_ENV.director, "Samuel \u2014 Mbeboura"],
    [LEGAL_ENV.vatMention, "xxx"],
  ];
  for (const [variable, value] of cases) {
    const parsed = parseLegalEntity({ [variable]: value });
    assert.equal(parsed.ok, false, `${variable}=${value} doit être refusé`);
    if (!parsed.ok) assert.equal(parsed.issues[0].variable, variable);
  }
});

test("une valeur vide ou faite d'espaces retombe sur la valeur par défaut", () => {
  const parsed = parseLegalEntity({ [LEGAL_ENV.city]: "   ", [LEGAL_ENV.director]: "" });
  assert.equal(parsed.ok && parsed.entity.city, "Saint-Avertin");
  assert.equal(parsed.ok && parsed.entity.director, "Samuel Mbeboura");
});
