import { z } from "zod";
import { DEFAULT_VAT_MENTION, PUBLIC_IDENTITY } from "@/lib/legal/identity";

/**
 * Identité de l'éditeur (entrepreneur individuel), affichée sur les CGV, les mentions légales et la politique de confidentialité.
 * Tout a une valeur par défaut (lib/legal/identity.ts), remplaçable par une variable LEGAL_*. Aucune variable n'est obligatoire.
 * Une variable renseignée mais mal formée est une erreur de configuration : elle fait échouer le build et la vérification.
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
  /** Médiateur de la consommation, seulement si LEGAL_MEDIATOR_NAME et LEGAL_MEDIATOR_URL sont renseignées. */
  mediator: { name: string; url: string } | null;
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

type Env = Readonly<Record<string, string | undefined>>;

export function formatAddress(parts: Pick<LegalEntity, "street" | "postalCode" | "city">): string {
  return `${parts.street}, ${parts.postalCode} ${parts.city}`;
}

/** « Samuel Mbeboura, entrepreneur individuel exerçant sous le nom commercial Orsayn ». */
export function describeSeller(entity: Pick<LegalEntity, "fullName" | "legalForm" | "tradeName">): string {
  return `${entity.fullName}, ${entity.legalForm.toLowerCase()} exerçant sous le nom commercial ${entity.tradeName}`;
}

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
  .string()
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
  mediatorName: text("Le nom du médiateur de la consommation", 3, 160).optional(),
  mediatorUrl: urlField.optional(),
  capital: text("Le capital social", 2, 60).optional(),
  registry: text("La mention d'immatriculation", 3, 100).optional(),
}).superRefine((value, ctx) => {
  if ((value.mediatorName === undefined) !== (value.mediatorUrl === undefined)) {
    const missing = value.mediatorName === undefined ? "mediatorName" : "mediatorUrl";
    ctx.addIssue({ code: "custom", path: [missing], message: "Le nom et l'adresse web du médiateur vont ensemble : renseigne les deux ou aucun." });
  }
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
    postalCode: read("postalCode") ?? PUBLIC_IDENTITY.postalCode,
    city: read("city") ?? PUBLIC_IDENTITY.city,
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
        mediator: v.mediatorName !== undefined && v.mediatorUrl !== undefined ? { name: v.mediatorName, url: v.mediatorUrl } : null,
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
    const isMissing = raw[field as keyof typeof raw] === undefined && issue.code !== "custom";
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

/** Retourne l'identité de l'éditeur, ou lève une erreur en français qui nomme les variables à corriger. */
export function resolveLegalEntity(env: Env): LegalEntity {
  const parsed = parseLegalEntity(env);
  if (parsed.ok === true) return parsed.entity;
  throw new Error(`Identité légale de l'éditeur invalide. ${describeLegalIssues(parsed.issues)}`);
}

export function getLegalEntity(): LegalEntity {
  return resolveLegalEntity(process.env);
}
