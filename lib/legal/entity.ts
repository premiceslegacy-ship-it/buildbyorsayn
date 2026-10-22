import { z } from "zod";
import { DEFAULT_VAT_MENTION, PUBLIC_IDENTITY } from "@/lib/legal/identity";

/**
 * Identité de l'éditeur (entrepreneur individuel), affichée sur les CGV, les mentions légales et la politique de confidentialité.
 * Les faits publics connus sont des valeurs par défaut (lib/legal/identity.ts), remplaçables par des variables LEGAL_*.
 * Seuls les champs réellement inconnus bloquent la production : code postal, ville et médiateur de la consommation.
 */

export const LEGAL_ENV = {
  fullName: "LEGAL_FULL_NAME",
  tradeName: "LEGAL_TRADE_NAME",
  legalForm: "LEGAL_LEGAL_FORM",
  siret: "LEGAL_SIRET",
  street: "LEGAL_STREET",
  postalCode: "LEGAL_POSTAL_CODE",
  city: "LEGAL_CITY",
  phone: "LEGAL_PHONE",
  contactEmail: "LEGAL_CONTACT_EMAIL",
  director: "LEGAL_DIRECTOR",
  vatMention: "LEGAL_VAT_MENTION",
  mediatorName: "LEGAL_MEDIATOR_NAME",
  mediatorUrl: "LEGAL_MEDIATOR_URL",
  capital: "LEGAL_CAPITAL",
  registry: "LEGAL_REGISTRY",
} as const;

/** Variables sans valeur par défaut : toutes doivent être renseignées en production. */
export const LEGAL_REQUIRED_ENV = [
  LEGAL_ENV.postalCode,
  LEGAL_ENV.city,
  LEGAL_ENV.mediatorName,
  LEGAL_ENV.mediatorUrl,
] as const;

/** Variables facultatives : valeur par défaut (faits publics) ou ligne absente de la page si elles sont vides. */
export const LEGAL_OPTIONAL_ENV = [
  LEGAL_ENV.fullName,
  LEGAL_ENV.tradeName,
  LEGAL_ENV.legalForm,
  LEGAL_ENV.siret,
  LEGAL_ENV.street,
  LEGAL_ENV.phone,
  LEGAL_ENV.contactEmail,
  LEGAL_ENV.director,
  LEGAL_ENV.vatMention,
  LEGAL_ENV.capital,
  LEGAL_ENV.registry,
] as const;

/** Autorise les valeurs d'exemple même sur un serveur de production (essais de bout en bout). Un bandeau reste affiché. */
export const LEGAL_SAMPLE_FLAG = "LEGAL_USE_SAMPLE_ENTITY";

export type LegalEntity = {
  fullName: string;
  tradeName: string;
  legalForm: string;
  siret: string;
  /** Les 9 premiers chiffres du SIRET. */
  siren: string;
  street: string;
  postalCode: string;
  city: string;
  /** Adresse sur une ligne : rue, code postal, ville. */
  address: string;
  phone: string;
  contactEmail: string;
  director: string;
  /** Phrase de TVA, par exemple « TVA non applicable, article 293 B du CGI ». */
  vatMention: string;
  mediatorName: string;
  mediatorUrl: string;
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

export function formatAddress(parts: Pick<LegalEntity, "street" | "postalCode" | "city">): string {
  return `${parts.street}, ${parts.postalCode} ${parts.city}`;
}

/** « Samuel Mbeboura, entrepreneur individuel exerçant sous le nom commercial Orsayn ». */
export function describeSeller(entity: Pick<LegalEntity, "fullName" | "legalForm" | "tradeName">): string {
  return `${entity.fullName}, ${entity.legalForm.toLowerCase()} exerçant sous le nom commercial ${entity.tradeName}`;
}

const SAMPLE_ADDRESS = { postalCode: "00000", city: "Ville d'exemple" };

/** Valeurs visiblement fausses mais valides, pour que les pages s'affichent hors production. */
export const SAMPLE_LEGAL_ENTITY: LegalEntity = {
  ...PUBLIC_IDENTITY,
  siren: PUBLIC_IDENTITY.siret.slice(0, 9),
  ...SAMPLE_ADDRESS,
  address: formatAddress({ street: PUBLIC_IDENTITY.street, ...SAMPLE_ADDRESS }),
  vatMention: DEFAULT_VAT_MENTION,
  mediatorName: "Médiateur d'exemple",
  mediatorUrl: "https://exemple.invalid/mediation",
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

/** Clé de Luhn : tout SIREN et presque tout SIRET la vérifient. */
function luhnValid(digits: string): boolean {
  let sum = 0;
  for (let i = 0; i < digits.length; i += 1) {
    let digit = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

export function isValidSiren(value: string): boolean {
  return /^\d{9}$/.test(value) && luhnValid(value);
}

export function isValidSiret(value: string): boolean {
  return /^\d{14}$/.test(value) && luhnValid(value);
}

const siretField = z
  .string({ error: "Le SIRET est obligatoire." })
  .transform((value) => value.replace(/[\s.]/g, ""))
  .pipe(
    z
      .string()
      .regex(/^\d{14}$/, "Le SIRET doit avoir exactement 14 chiffres.")
      .refine(isValidSiret, "Le SIRET est faux (la clé de contrôle ne correspond pas)."),
  );

const postalCodeField = z
  .string({ error: "Le code postal est obligatoire." })
  .trim()
  .regex(/^\d{5}$/, "Le code postal doit avoir exactement 5 chiffres.");

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

const entitySchema = z.object({
  fullName: text("Le nom de l'éditeur", 3, 120),
  tradeName: text("Le nom commercial", 2, 120),
  legalForm: text("Le statut juridique", 2, 80),
  siret: siretField,
  street: text("La rue", 5, 200),
  postalCode: postalCodeField,
  city: text("La ville", 2, 80),
  phone: z.string({ error: "Le téléphone est obligatoire." }).trim().regex(/^\+?[0-9 .()-]{8,20}$/, "Le numéro de téléphone n'a pas le bon format."),
  contactEmail: emailField,
  director: text("Le nom du directeur de la publication", 3, 120),
  vatMention: text("La mention de TVA", 5, 200),
  mediatorName: text("Le nom du médiateur de la consommation", 3, 160),
  mediatorUrl: urlField,
  capital: text("Le capital social", 2, 60).optional(),
  registry: text("La mention d'immatriculation", 3, 100).optional(),
});

function blankToUndefined(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Valide les variables d'environnement. Fonction pure : n'écrit rien, ne lit pas process.env. */
export function parseLegalEntity(env: Env): LegalEntityParse {
  const read = (key: keyof typeof LEGAL_ENV) => blankToUndefined(env[LEGAL_ENV[key]]);
  const raw = {
    fullName: read("fullName") ?? PUBLIC_IDENTITY.fullName,
    tradeName: read("tradeName") ?? PUBLIC_IDENTITY.tradeName,
    legalForm: read("legalForm") ?? PUBLIC_IDENTITY.legalForm,
    siret: read("siret") ?? PUBLIC_IDENTITY.siret,
    street: read("street") ?? PUBLIC_IDENTITY.street,
    postalCode: read("postalCode"),
    city: read("city"),
    phone: read("phone") ?? PUBLIC_IDENTITY.phone,
    contactEmail: read("contactEmail") ?? PUBLIC_IDENTITY.contactEmail,
    director: read("director") ?? PUBLIC_IDENTITY.director,
    vatMention: read("vatMention") ?? DEFAULT_VAT_MENTION,
    mediatorName: read("mediatorName"),
    mediatorUrl: read("mediatorUrl"),
    capital: read("capital"),
    registry: read("registry"),
  };

  const result = entitySchema.safeParse(raw);
  if (result.success) {
    const v = result.data;
    return {
      ok: true,
      entity: {
        fullName: v.fullName,
        tradeName: v.tradeName,
        legalForm: v.legalForm,
        siret: v.siret,
        siren: v.siret.slice(0, 9),
        street: v.street,
        postalCode: v.postalCode,
        city: v.city,
        address: formatAddress(v),
        phone: v.phone,
        contactEmail: v.contactEmail,
        director: v.director,
        vatMention: v.vatMention,
        mediatorName: v.mediatorName,
        mediatorUrl: v.mediatorUrl,
        capital: v.capital ?? null,
        registry: v.registry ?? null,
      },
    };
  }

  const issues: LegalEntityIssue[] = [];
  const seen = new Set<string>();
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "") as keyof typeof LEGAL_ENV;
    const variable = LEGAL_ENV[field];
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

  const sampleAllowed = nodeEnv !== "production" || env[LEGAL_SAMPLE_FLAG] === "true";
  if (sampleAllowed) return { entity: SAMPLE_LEGAL_ENTITY, isSample: true };

  throw new Error(`Identité légale de l'éditeur incomplète. ${describeLegalIssues(parsed.issues)}`);
}

export function getLegalEntity(): ResolvedLegalEntity {
  return resolveLegalEntity(process.env, process.env.NODE_ENV);
}
