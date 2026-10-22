import { z } from "zod";
import { CONTACT_EMAIL } from "@/lib/legal/links";

/**
 * Identité de l'éditeur, lue dans l'environnement.
 * Rien de ce qui est ici n'est écrit en dur dans les pages : ces informations viennent de la société, pas du code.
 */

export const LEGAL_ENV = {
  companyName: "LEGAL_COMPANY_NAME",
  legalForm: "LEGAL_LEGAL_FORM",
  siren: "LEGAL_SIREN",
  address: "LEGAL_ADDRESS",
  vatNumber: "LEGAL_VAT_NUMBER",
  director: "LEGAL_DIRECTOR",
  contactEmail: "LEGAL_CONTACT_EMAIL",
  mediatorName: "LEGAL_MEDIATOR_NAME",
  mediatorUrl: "LEGAL_MEDIATOR_URL",
  phone: "LEGAL_PHONE",
  capital: "LEGAL_CAPITAL",
  registry: "LEGAL_REGISTRY",
} as const;

/** Variables qui doivent toutes être renseignées en production. */
export const LEGAL_REQUIRED_ENV = [
  LEGAL_ENV.companyName,
  LEGAL_ENV.legalForm,
  LEGAL_ENV.siren,
  LEGAL_ENV.address,
  LEGAL_ENV.director,
  LEGAL_ENV.mediatorName,
  LEGAL_ENV.mediatorUrl,
] as const;

/** Variables facultatives : la page n'affiche la ligne correspondante que si elles sont renseignées. */
export const LEGAL_OPTIONAL_ENV = [
  LEGAL_ENV.vatNumber,
  LEGAL_ENV.contactEmail,
  LEGAL_ENV.phone,
  LEGAL_ENV.capital,
  LEGAL_ENV.registry,
] as const;

/** Adresse de contact réelle de BUILD (valeur par défaut de LEGAL_CONTACT_EMAIL). */
export const DEFAULT_CONTACT_EMAIL: string = CONTACT_EMAIL;

/** Autorise les valeurs d'exemple même sur un serveur de production (essais de bout en bout). Un bandeau reste affiché. */
export const LEGAL_SAMPLE_FLAG = "LEGAL_USE_SAMPLE_ENTITY";

export type LegalEntity = {
  companyName: string;
  legalForm: string;
  siren: string;
  address: string;
  vatNumber: string | null;
  director: string;
  contactEmail: string;
  mediatorName: string;
  mediatorUrl: string;
  phone: string | null;
  capital: string | null;
  registry: string | null;
};

export type LegalEntityIssue = {
  variable: string;
  kind: "missing" | "invalid";
  /** Explication en français. Ne contient jamais la valeur reçue. */
  message: string;
};

export type LegalEntityParse =
  | { ok: true; entity: LegalEntity }
  | { ok: false; issues: LegalEntityIssue[] };

export type ResolvedLegalEntity = { entity: LegalEntity; isSample: boolean };

type Env = Readonly<Record<string, string | undefined>>;

/** Valeurs visiblement fausses mais valides, pour que les pages s'affichent hors production. */
export const SAMPLE_LEGAL_ENTITY: LegalEntity = {
  companyName: "Société d'exemple",
  legalForm: "SAS d'exemple",
  siren: "123456782",
  address: "1 rue de l'Exemple, 75000 Paris",
  vatNumber: null,
  director: "Prénom Nom d'exemple",
  contactEmail: DEFAULT_CONTACT_EMAIL,
  mediatorName: "Médiateur d'exemple",
  mediatorUrl: "https://exemple.invalid/mediation",
  phone: null,
  capital: null,
  registry: null,
};

const PLACEHOLDER = /^(?:todo|tbd|tba|n\/?a|xx+|\.{2,}|\?+|-+|changeme|change-me|a completer|à compléter|a remplir|à remplir|exemple|example|lorem)(?![a-z0-9])|d'exemple|[\[\]<>{}]|^\s*$/i;

function text(label: string, min = 2, max = 300) {
  return z
    .string({ error: `${label} est obligatoire.` })
    .trim()
    .min(min, `${label} est obligatoire.`)
    .max(max, `${label} est trop long (${max} caractères au plus).`)
    .refine((value) => !PLACEHOLDER.test(value), `${label} contient un texte provisoire (crochets, "à compléter", "xxx"...).`)
    .refine((value) => !/[\u2014\u2013\u2022\u00b7]/u.test(value), `${label} contient un tiret long ou un symbole de liste : écris-le avec des mots et des tirets simples.`);
}

/** Clé de Luhn : tout SIREN valide la vérifie. */
export function isValidSiren(value: string): boolean {
  if (!/^\d{9}$/.test(value)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    let digit = Number(value[8 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

/** Numéro de TVA intracommunautaire français : FR + clé (2 caractères) + SIREN. */
export function isValidFrenchVat(value: string, siren?: string): boolean {
  const match = /^FR([0-9A-HJ-NP-Z]{2})(\d{9})$/.exec(value);
  if (!match) return false;
  const [, key, vatSiren] = match;
  if (!isValidSiren(vatSiren)) return false;
  if (siren && vatSiren !== siren) return false;
  if (/^\d{2}$/.test(key)) {
    const expected = (12 + 3 * (Number(vatSiren) % 97)) % 97;
    return Number(key) === expected;
  }
  return true;
}

const sirenField = z
  .string({ error: "Le SIREN est obligatoire." })
  .transform((value) => value.replace(/[\s.]/g, ""))
  .pipe(
    z
      .string()
      .regex(/^\d{9}$/, "Le SIREN doit avoir exactement 9 chiffres.")
      .refine(isValidSiren, "Le SIREN est faux (la clé de contrôle ne correspond pas)."),
  );

const vatField = z
  .string()
  .transform((value) => value.replace(/\s/g, "").toUpperCase())
  .optional();

const emailField = z.string().trim().max(254).pipe(z.email("L'adresse e-mail n'a pas le bon format."));

const urlField = z
  .string({ error: "L'adresse web du médiateur est obligatoire." })
  .trim()
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password && !url.hostname.endsWith(".invalid");
    } catch {
      return false;
    }
  }, "L'adresse web du médiateur doit commencer par https://.");

const entitySchema = z
  .object({
    companyName: text("Le nom de la société", 2, 120),
    legalForm: text("La forme juridique", 2, 80),
    siren: sirenField,
    address: text("L'adresse du siège", 8, 300),
    vatNumber: vatField,
    director: text("Le nom du directeur de la publication", 3, 120),
    contactEmail: emailField,
    mediatorName: text("Le nom du médiateur de la consommation", 3, 160),
    mediatorUrl: urlField,
    phone: z.string().trim().regex(/^\+?[0-9 .()-]{8,20}$/, "Le numéro de téléphone n'a pas le bon format.").optional(),
    capital: text("Le capital social", 2, 60).optional(),
    registry: text("La mention d'immatriculation", 3, 100).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.vatNumber !== undefined && !isValidFrenchVat(value.vatNumber)) {
      ctx.addIssue({ code: "custom", path: ["vatNumber"], message: "Le numéro de TVA n'a pas le bon format (FR, 2 caractères de clé, puis le SIREN)." });
    } else if (value.vatNumber !== undefined && !value.vatNumber.endsWith(value.siren)) {
      ctx.addIssue({ code: "custom", path: ["vatNumber"], message: "Le numéro de TVA doit se terminer par le SIREN de la société." });
    }
  });

const FIELD_TO_ENV = Object.fromEntries(Object.entries(LEGAL_ENV)) as Record<string, string>;

function blankToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Valide les variables d'environnement. Fonction pure : n'écrit rien, ne lit pas process.env. */
export function parseLegalEntity(env: Env): LegalEntityParse {
  const raw = {
    companyName: blankToUndefined(env[LEGAL_ENV.companyName]),
    legalForm: blankToUndefined(env[LEGAL_ENV.legalForm]),
    siren: blankToUndefined(env[LEGAL_ENV.siren]),
    address: blankToUndefined(env[LEGAL_ENV.address]),
    vatNumber: blankToUndefined(env[LEGAL_ENV.vatNumber]),
    director: blankToUndefined(env[LEGAL_ENV.director]),
    contactEmail: blankToUndefined(env[LEGAL_ENV.contactEmail]) ?? DEFAULT_CONTACT_EMAIL,
    mediatorName: blankToUndefined(env[LEGAL_ENV.mediatorName]),
    mediatorUrl: blankToUndefined(env[LEGAL_ENV.mediatorUrl]),
    phone: blankToUndefined(env[LEGAL_ENV.phone]),
    capital: blankToUndefined(env[LEGAL_ENV.capital]),
    registry: blankToUndefined(env[LEGAL_ENV.registry]),
  };

  const result = entitySchema.safeParse(raw);
  if (result.success) {
    const v = result.data;
    return {
      ok: true,
      entity: {
        companyName: v.companyName,
        legalForm: v.legalForm,
        siren: v.siren,
        address: v.address,
        vatNumber: v.vatNumber ?? null,
        director: v.director,
        contactEmail: v.contactEmail,
        mediatorName: v.mediatorName,
        mediatorUrl: v.mediatorUrl,
        phone: v.phone ?? null,
        capital: v.capital ?? null,
        registry: v.registry ?? null,
      },
    };
  }

  const issues: LegalEntityIssue[] = [];
  const seen = new Set<string>();
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "");
    const variable = FIELD_TO_ENV[field];
    if (!variable || seen.has(variable)) continue;
    seen.add(variable);
    const isMissing = raw[field as keyof typeof raw] === undefined;
    issues.push({
      variable,
      kind: isMissing ? "missing" : "invalid",
      message: isMissing ? "Variable absente ou vide." : issue.message,
    });
  }
  return { ok: false, issues };
}

/** Message français qui liste les variables à corriger, sans jamais citer leur valeur. */
export function describeLegalIssues(issues: readonly LegalEntityIssue[]): string {
  const missing = issues.filter((issue) => issue.kind === "missing");
  const invalid = issues.filter((issue) => issue.kind === "invalid");
  const lines: string[] = [];
  if (missing.length > 0) {
    lines.push(`Variables à renseigner : ${missing.map((issue) => issue.variable).join(", ")}.`);
  }
  for (const issue of invalid) {
    lines.push(`${issue.variable} : ${issue.message}`);
  }
  return lines.join("\n");
}

/**
 * Production : l'identité réelle est obligatoire, sinon on s'arrête (jamais de blanc ni de texte provisoire en public).
 * Hors production : valeurs d'exemple signalées par `isSample`, pour que les pages restent testables.
 */
export function resolveLegalEntity(env: Env, nodeEnv: string | undefined): ResolvedLegalEntity {
  const parsed = parseLegalEntity(env);
  if (parsed.ok === true) return { entity: parsed.entity, isSample: false };

  // Le drapeau d'exemple sert aux essais sur un serveur de production local : il est ignoré sur le vrai déploiement Vercel.
  const sampleAllowed = nodeEnv !== "production" || (env[LEGAL_SAMPLE_FLAG] === "true" && env.VERCEL_ENV !== "production");
  if (sampleAllowed) return { entity: SAMPLE_LEGAL_ENTITY, isSample: true };

  throw new Error(`Identité légale de la société incomplète. ${describeLegalIssues(parsed.issues)}`);
}

export function getLegalEntity(): ResolvedLegalEntity {
  return resolveLegalEntity(process.env, process.env.NODE_ENV);
}
