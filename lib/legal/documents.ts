import type { Metadata } from "next";
import { COFFRE_LABEL, COFFRE_PRICE, FONDATIONS_LABEL, FONDATIONS_PRICE, UPGRADE_PRICE } from "@/lib/pricing";
import { LEGAL_LINKS } from "@/lib/legal/links";

export type LegalHref = (typeof LEGAL_LINKS)[number]["href"];

type LegalDocumentMeta = {
  description: string;
  /** Date de dernière modification du texte, au format AAAA-MM-JJ. À changer à chaque révision du contenu. */
  updatedAt: string;
};

const DOCUMENTS: Record<LegalHref, LegalDocumentMeta> = {
  "/cgv": {
    description: "Les règles qui s'appliquent quand tu achètes Fondations ou LE\u00a0COFFRE : prix, accès immédiat, droit de rétractation, licence d'utilisation, médiation.",
    updatedAt: "2026-10-22",
  },
  "/mentions-legales": {
    description: "Qui édite BUILD, qui dirige la publication, qui héberge le site et comment nous contacter.",
    updatedAt: "2026-10-22",
  },
  "/confidentialite": {
    description: "Quelles données BUILD collecte, pourquoi, combien de temps, qui les traite pour nous, et comment exercer tes droits.",
    updatedAt: "2026-10-22",
  },
  "/cookies": {
    description: "Ce que BUILD enregistre dans ton navigateur : uniquement ce qui sert à te connecter et à faire fonctionner le site.",
    updatedAt: "2026-10-22",
  },
};

export function legalTitle(href: LegalHref): string {
  const link = LEGAL_LINKS.find((entry) => entry.href === href);
  if (!link) throw new Error(`Page légale inconnue : ${href}`);
  return link.label;
}

export function legalUpdatedAt(href: LegalHref): string {
  return DOCUMENTS[href].updatedAt;
}

export function legalMetadata(href: LegalHref): Metadata {
  const title = `${legalTitle(href)} | BUILD`;
  const { description } = DOCUMENTS[href];
  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: { title, description, url: href, siteName: "BUILD", locale: "fr_FR", type: "website" },
  };
}

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeZone: "UTC" });

export function formatLegalDate(isoDate: string): string {
  return DATE_FORMAT.format(new Date(`${isoDate}T00:00:00Z`));
}

/** Montant écrit pour des humains : « 97 € » avec espace insécable. Les prix viennent toujours de lib/pricing.ts. */
function euros(amount: number): string {
  return `${amount}\u00a0€`;
}

export const PRICES = {
  fondations: euros(FONDATIONS_PRICE),
  coffre: euros(COFFRE_PRICE),
  upgrade: euros(UPGRADE_PRICE),
} as const;

/** Noms des offres tels qu'on les écrit : le nom du coffre reste d'un seul bloc grâce à l'espace insécable. */
export const TIER_NAMES = {
  fondations: FONDATIONS_LABEL,
  coffre: COFFRE_LABEL.replace(/ /g, "\u00a0"),
} as const;

/** Guillemets français avec espaces insécables. */
export function quote(value: string): string {
  return `«\u00a0${value}\u00a0»`;
}
