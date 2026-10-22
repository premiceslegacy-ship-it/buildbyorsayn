import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CONTACT_EMAIL,
  describeLegalIssues,
  isValidFrenchVat,
  isValidSiren,
  LEGAL_ENV,
  LEGAL_REQUIRED_ENV,
  LEGAL_SAMPLE_FLAG,
  parseLegalEntity,
  resolveLegalEntity,
  SAMPLE_LEGAL_ENTITY,
} from "../lib/legal/entity";

const SIREN = "552100554"; // SIREN public et valide (clé de Luhn correcte), utilisé comme exemple de forme.

function vatFor(siren: string): string {
  const key = (12 + 3 * (Number(siren) % 97)) % 97;
  return `FR${String(key).padStart(2, "0")}${siren}`;
}

function validEnv(extra: Record<string, string> = {}): Record<string, string> {
  return {
    [LEGAL_ENV.companyName]: "Atelier Test",
    [LEGAL_ENV.legalForm]: "SAS au capital de 1 000 euros",
    [LEGAL_ENV.siren]: SIREN,
    [LEGAL_ENV.address]: "12 rue des Essais, 75010 Paris",
    [LEGAL_ENV.director]: "Camille Martin",
    [LEGAL_ENV.mediatorName]: "Médiateur de la consommation Test",
    [LEGAL_ENV.mediatorUrl]: "https://mediation.test-reel.fr/saisir",
    ...extra,
  };
}

test("une identité complète est acceptée, la TVA est facultative et le contact a une valeur par défaut", () => {
  const parsed = parseLegalEntity(validEnv());
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.entity.siren, SIREN);
  assert.equal(parsed.entity.vatNumber, null);
  assert.equal(parsed.entity.contactEmail, DEFAULT_CONTACT_EMAIL);
  assert.equal(parsed.entity.phone, null);
});

test("un SIREN écrit avec des espaces est normalisé", () => {
  const parsed = parseLegalEntity(validEnv({ [LEGAL_ENV.siren]: "552 100 554" }));
  assert.equal(parsed.ok && parsed.entity.siren, SIREN);
});

test("toutes les variables obligatoires absentes sont listées, avec leur nom exact", () => {
  const parsed = parseLegalEntity({});
  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.deepEqual(parsed.issues.map((issue) => issue.variable).sort(), [...LEGAL_REQUIRED_ENV].sort());
  assert.ok(parsed.issues.every((issue) => issue.kind === "missing"));
  const message = describeLegalIssues(parsed.issues);
  for (const name of LEGAL_REQUIRED_ENV) assert.ok(message.includes(name), `${name} doit figurer dans le message`);
});

test("une valeur vide ou faite d'espaces compte comme absente", () => {
  const parsed = parseLegalEntity(validEnv({ [LEGAL_ENV.director]: "   " }));
  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.deepEqual(parsed.issues.map((issue) => [issue.variable, issue.kind]), [[LEGAL_ENV.director, "missing"]]);
});

test("un SIREN mal formé est refusé et le message ne répète pas la valeur reçue", () => {
  for (const bad of ["12345678", "5521005540", "55210055A", "552100555"]) {
    const parsed = parseLegalEntity(validEnv({ [LEGAL_ENV.siren]: bad }));
    assert.equal(parsed.ok, false, `${bad} doit être refusé`);
    if (parsed.ok) continue;
    const [issue] = parsed.issues;
    assert.equal(issue.variable, LEGAL_ENV.siren);
    assert.equal(issue.kind, "invalid");
    assert.ok(!describeLegalIssues(parsed.issues).includes(bad), "la valeur ne doit jamais être citée");
  }
});

test("la clé de contrôle du SIREN est vérifiée", () => {
  assert.equal(isValidSiren(SIREN), true);
  assert.equal(isValidSiren("552100555"), false);
  assert.equal(isValidSiren("55210055"), false);
});

test("le numéro de TVA est facultatif, mais s'il est donné il doit être cohérent avec le SIREN", () => {
  const good = parseLegalEntity(validEnv({ [LEGAL_ENV.vatNumber]: vatFor(SIREN).toLowerCase() }));
  assert.equal(good.ok && good.entity.vatNumber, vatFor(SIREN));

  const other = parseLegalEntity(validEnv({ [LEGAL_ENV.vatNumber]: vatFor("123456782") }));
  assert.equal(other.ok, false);
  if (!other.ok) assert.equal(other.issues[0].variable, LEGAL_ENV.vatNumber);

  const wrongKey = vatFor(SIREN).replace(/^FR\d\d/, "FR00");
  assert.equal(isValidFrenchVat(wrongKey), false);

  const malformed = parseLegalEntity(validEnv({ [LEGAL_ENV.vatNumber]: "DE123456789" }));
  assert.equal(malformed.ok, false);
});

test("les textes provisoires, les tirets longs et les liens non sécurisés sont refusés", () => {
  const cases: Array<[string, string]> = [
    [LEGAL_ENV.companyName, "[Nom de la société]"],
    [LEGAL_ENV.address, "à compléter"],
    [LEGAL_ENV.legalForm, "xxx"],
    [LEGAL_ENV.director, "Camille \u2014 Martin"],
    [LEGAL_ENV.mediatorName, "Médiateur d'exemple"],
    [LEGAL_ENV.mediatorUrl, "http://mediation.test-reel.fr"],
    [LEGAL_ENV.mediatorUrl, "https://exemple.invalid/mediation"],
    [LEGAL_ENV.contactEmail, "pas-un-email"],
  ];
  for (const [variable, value] of cases) {
    const parsed = parseLegalEntity(validEnv({ [variable]: value }));
    assert.equal(parsed.ok, false, `${variable}=${value} doit être refusé`);
    if (!parsed.ok) assert.equal(parsed.issues[0].variable, variable);
  }
});

test("en production, l'identité réelle est obligatoire : pas de valeur d'exemple, un message en français", () => {
  assert.throws(
    () => resolveLegalEntity({}, "production"),
    (error: unknown) => error instanceof Error && error.message.includes(LEGAL_ENV.siren) && error.message.startsWith("Identité légale"),
  );
  const resolved = resolveLegalEntity(validEnv(), "production");
  assert.equal(resolved.isSample, false);
  assert.equal(resolved.entity.companyName, "Atelier Test");
});

test("hors production, les valeurs d'exemple sont rendues et signalées", () => {
  for (const nodeEnv of ["development", "test", undefined]) {
    const resolved = resolveLegalEntity({}, nodeEnv);
    assert.equal(resolved.isSample, true);
    assert.equal(resolved.entity, SAMPLE_LEGAL_ENTITY);
  }
});

test("des valeurs partielles ou fausses ne sont jamais mélangées aux valeurs d'exemple", () => {
  const partial = resolveLegalEntity({ [LEGAL_ENV.companyName]: "Atelier Test" }, "development");
  assert.equal(partial.isSample, true);
  assert.notEqual(partial.entity.companyName, "Atelier Test");
});

test("l'indicateur d'essai autorise les valeurs d'exemple sur un serveur de production, et seulement s'il vaut true", () => {
  assert.equal(resolveLegalEntity({ [LEGAL_SAMPLE_FLAG]: "true" }, "production").isSample, true);
  assert.throws(() => resolveLegalEntity({ [LEGAL_SAMPLE_FLAG]: "1" }, "production"));
});

test("les valeurs d'exemple sont reconnaissables et ne passent pas la validation de production", () => {
  assert.equal(isValidSiren(SAMPLE_LEGAL_ENTITY.siren), true);
  const asEnv: Record<string, string> = {
    [LEGAL_ENV.companyName]: SAMPLE_LEGAL_ENTITY.companyName,
    [LEGAL_ENV.legalForm]: SAMPLE_LEGAL_ENTITY.legalForm,
    [LEGAL_ENV.siren]: SAMPLE_LEGAL_ENTITY.siren,
    [LEGAL_ENV.address]: SAMPLE_LEGAL_ENTITY.address,
    [LEGAL_ENV.director]: SAMPLE_LEGAL_ENTITY.director,
    [LEGAL_ENV.mediatorName]: SAMPLE_LEGAL_ENTITY.mediatorName,
    [LEGAL_ENV.mediatorUrl]: SAMPLE_LEGAL_ENTITY.mediatorUrl,
  };
  assert.equal(parseLegalEntity(asEnv).ok, false);
});
