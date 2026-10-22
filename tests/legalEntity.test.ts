import test from "node:test";
import assert from "node:assert/strict";
import {
  describeLegalIssues,
  describeSeller,
  isValidSiren,
  isValidSiret,
  LEGAL_ENV,
  LEGAL_REQUIRED_ENV,
  LEGAL_SAMPLE_FLAG,
  parseLegalEntity,
  resolveLegalEntity,
  SAMPLE_LEGAL_ENTITY,
} from "../lib/legal/entity";
import { DEFAULT_VAT_MENTION, PUBLIC_IDENTITY } from "../lib/legal/identity";

function validEnv(extra: Record<string, string> = {}): Record<string, string> {
  return {
    [LEGAL_ENV.postalCode]: "75010",
    [LEGAL_ENV.city]: "Paris",
    [LEGAL_ENV.mediatorName]: "Médiateur de la consommation Test",
    [LEGAL_ENV.mediatorUrl]: "https://mediation.test-reel.fr/saisir",
    ...extra,
  };
}

test("les faits publics sont des valeurs par défaut : seuls code postal, ville et médiateur sont à fournir", () => {
  const parsed = parseLegalEntity(validEnv());
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.entity.fullName, PUBLIC_IDENTITY.fullName);
  assert.equal(parsed.entity.tradeName, "Orsayn");
  assert.equal(parsed.entity.siret, PUBLIC_IDENTITY.siret);
  assert.equal(parsed.entity.siren, "989208152");
  assert.equal(parsed.entity.vatMention, DEFAULT_VAT_MENTION);
  assert.equal(parsed.entity.address, "1 rue des héraults, 75010 Paris");
  assert.equal(parsed.entity.contactEmail, "contact@orsayn.fr");
  assert.equal(parsed.entity.capital, null);
  assert.equal(parsed.entity.registry, null);
  assert.equal(describeSeller(parsed.entity), "Samuel Mbeboura, entrepreneur individuel exerçant sous le nom commercial Orsayn");
});

test("les variables de production sont exactement les champs réellement inconnus", () => {
  assert.deepEqual([...LEGAL_REQUIRED_ENV].sort(), ["LEGAL_CITY", "LEGAL_MEDIATOR_NAME", "LEGAL_MEDIATOR_URL", "LEGAL_POSTAL_CODE"]);
  const parsed = parseLegalEntity({});
  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.deepEqual(parsed.issues.map((issue) => issue.variable).sort(), [...LEGAL_REQUIRED_ENV].sort());
  assert.ok(parsed.issues.every((issue) => issue.kind === "missing"));
  const message = describeLegalIssues(parsed.issues);
  for (const name of LEGAL_REQUIRED_ENV) assert.ok(message.includes(name));
});

test("une variable peut remplacer une valeur par défaut, y compris la mention de TVA", () => {
  const parsed = parseLegalEntity(validEnv({ [LEGAL_ENV.vatMention]: "TVA intracommunautaire FR12345678901", [LEGAL_ENV.street]: "8 avenue du Test", [LEGAL_ENV.capital]: "1 000 euros" }));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.entity.vatMention, "TVA intracommunautaire FR12345678901");
  assert.equal(parsed.entity.address, "8 avenue du Test, 75010 Paris");
  assert.equal(parsed.entity.capital, "1 000 euros");
});

test("le SIRET est normalisé, sa clé de contrôle est vérifiée et le SIREN en est dérivé", () => {
  const parsed = parseLegalEntity(validEnv({ [LEGAL_ENV.siret]: "552 100 554 00055" }));
  if (parsed.ok) assert.equal(parsed.entity.siren, "552100554");
  assert.equal(isValidSiret(PUBLIC_IDENTITY.siret), true);
  assert.equal(isValidSiren("989208152"), true);
  assert.equal(isValidSiret("98920815200012"), false);
  assert.equal(isValidSiret("9892081520001"), false);
});

test("un SIRET mal formé est refusé et le message ne répète pas la valeur reçue", () => {
  for (const bad of ["9892081520001", "98920815200012", "9892081520001A"]) {
    const parsed = parseLegalEntity(validEnv({ [LEGAL_ENV.siret]: bad }));
    assert.equal(parsed.ok, false, `${bad} doit être refusé`);
    if (parsed.ok) continue;
    assert.equal(parsed.issues[0].variable, LEGAL_ENV.siret);
    assert.equal(parsed.issues[0].kind, "invalid");
    assert.ok(!describeLegalIssues(parsed.issues).includes(bad));
  }
});

test("code postal, téléphone, e-mail, lien du médiateur, textes provisoires et tirets longs sont contrôlés", () => {
  const cases: Array<[string, string]> = [
    [LEGAL_ENV.postalCode, "7501"],
    [LEGAL_ENV.postalCode, "75O10"],
    [LEGAL_ENV.city, "[Ville]"],
    [LEGAL_ENV.city, "à compléter"],
    [LEGAL_ENV.phone, "pas de téléphone"],
    [LEGAL_ENV.contactEmail, "pas-un-email"],
    [LEGAL_ENV.director, "Samuel \u2014 Mbeboura"],
    [LEGAL_ENV.mediatorName, "Médiateur d'exemple"],
    [LEGAL_ENV.mediatorUrl, "http://mediation.test-reel.fr"],
    [LEGAL_ENV.mediatorUrl, "https://exemple.invalid/mediation"],
  ];
  for (const [variable, value] of cases) {
    const parsed = parseLegalEntity(validEnv({ [variable]: value }));
    assert.equal(parsed.ok, false, `${variable}=${value} doit être refusé`);
    if (!parsed.ok) assert.equal(parsed.issues[0].variable, variable);
  }
});

test("en production, les champs inconnus sont obligatoires : pas de valeur d'exemple, message français sans valeur", () => {
  assert.throws(
    () => resolveLegalEntity({}, "production"),
    (error: unknown) => error instanceof Error && error.message.startsWith("Identité légale") && error.message.includes(LEGAL_ENV.postalCode),
  );
  const resolved = resolveLegalEntity(validEnv(), "production");
  assert.equal(resolved.isSample, false);
  assert.equal(resolved.entity.city, "Paris");
});

test("hors production, les valeurs d'exemple sont rendues et signalées, jamais mêlées à des valeurs partielles", () => {
  for (const nodeEnv of ["development", "test", undefined]) {
    const resolved = resolveLegalEntity({}, nodeEnv);
    assert.equal(resolved.isSample, true);
    assert.equal(resolved.entity, SAMPLE_LEGAL_ENTITY);
  }
  const partial = resolveLegalEntity({ [LEGAL_ENV.city]: "Paris" }, "development");
  assert.equal(partial.isSample, true);
  assert.notEqual(partial.entity.city, "Paris");
});

test("l'indicateur d'essai autorise les valeurs d'exemple en production, et seulement s'il vaut true", () => {
  assert.equal(resolveLegalEntity({ [LEGAL_SAMPLE_FLAG]: "true" }, "production").isSample, true);
  assert.throws(() => resolveLegalEntity({ [LEGAL_SAMPLE_FLAG]: "1" }, "production"));
});

test("les valeurs d'exemple (ville, médiateur) ne passent pas la validation de production", () => {
  const asEnv: Record<string, string> = {
    [LEGAL_ENV.postalCode]: SAMPLE_LEGAL_ENTITY.postalCode,
    [LEGAL_ENV.city]: SAMPLE_LEGAL_ENTITY.city,
    [LEGAL_ENV.mediatorName]: SAMPLE_LEGAL_ENTITY.mediatorName,
    [LEGAL_ENV.mediatorUrl]: SAMPLE_LEGAL_ENTITY.mediatorUrl,
  };
  const parsed = parseLegalEntity(asEnv);
  assert.equal(parsed.ok, false);
  if (!parsed.ok) assert.deepEqual(parsed.issues.map((issue) => issue.variable).sort(), [LEGAL_ENV.city, LEGAL_ENV.mediatorName, LEGAL_ENV.mediatorUrl]);
});
