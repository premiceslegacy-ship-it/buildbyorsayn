import { SiteCompare, SiteMockup } from "./SiteMockup";
import type { SiteNote, SiteScreen, SiteSection, SiteSlot, SiteSpec, SiteThemeName } from "./SiteMockup";
import type { KitBaseProps } from "./types";

/* ---------------------------------------------------------------------------------------------
   WebPage et WebPageCompare : l'écriture courte des pages d'exemple. Elles sont rendues par
   SiteMockup (vraie page en HTML, vraies photos, pastilles avec rôle, raison et autre choix).
   --------------------------------------------------------------------------------------------- */

export type WebPageData = {
  url?: string;
  nav?: string;
  eyebrow?: string;
  heading: string;
  subtitle: string;
  button: string;
  proofs?: readonly string[];
  offer?: string;
  faq?: string;
  /** Photo de métier à montrer à côté du titre. */
  /** Lien secondaire, en texte simple avec un chevron. */
  link?: string;
  photo?: keyof typeof PHOTOS;
  /** Écran de produit à la place d'une photo. */
  screen?: SiteScreen;
  /** Champs d'un formulaire : la page devient un formulaire (titre, champs, bouton). */
  fields?: readonly { label: string; value?: string; kind?: "text" | "file" | "select" | "area" }[];
  theme?: SiteThemeName;
};

export type WebAnnotation = {
  number: number;
  target: "heading" | "subtitle" | "button" | "image" | "proofs" | "offer" | "faq";
  /** Rôle de l'élément. */
  label: string;
  /** Pourquoi il est dessiné ainsi. */
  why: string;
  /** Une autre option. */
  alt?: string;
};

export type WebPageProps = KitBaseProps & {
  page: WebPageData;
  annotations: readonly WebAnnotation[];
};

const PHOTOS = {
  plaquiste: { src: "plaquiste-platre-truelles", alt: "Truelles et plâtre sur un chantier" },
  ossature: { src: "chantier-ossature-placo", alt: "Ossature de cloison sur un chantier" },
  ebeniste: { src: "ebeniste-planche-atelier", alt: "Planche de bois dans un atelier" },
  fleuriste: { src: "fleuriste-compose-bouquet", alt: "Une fleuriste compose un bouquet" },
  cuisinier: { src: "cuisinier-planche-legumes", alt: "Légumes sur une planche de cuisine" },
  velo: { src: "atelier-velo-reparation", alt: "Réparation d'un vélo à l'atelier" },
  cuisine: { src: "cuisine-en-renovation", alt: "Une cuisine en rénovation" },
  piece: { src: "piece-en-renovation", alt: "Une pièce en rénovation" },
  bureau: { src: "bureau-ordinateur-portable", alt: "Un bureau avec un ordinateur portable" },
} as const;

function photoOf(page: WebPageData): { src: string; alt: string } | null {
  if (!page.photo) return null;
  const photo = PHOTOS[page.photo];
  return { src: `/schemas/sites/${photo.src}.jpg`, alt: photo.alt };
}

function screenOf(page: WebPageData): SiteScreen | null {
  return page.screen ?? null;
}

function lastWord(text: string): string | undefined {
  const words = text.split(" ");
  const word = words[words.length - 1]?.replace(/[?!.,;:]+$/, "");
  return word && word.length > 3 ? word : undefined;
}

type Quality = "premium" | "slop";

const SLOP_CARDS = [
  { title: "Rapide", text: "Un service moderne, efficace et pensé pour vous.", icon: "zap" },
  { title: "Fiable", text: "Une qualité garantie à chaque étape.", icon: "shield" },
  { title: "Innovant", text: "Des solutions à la pointe pour votre projet.", icon: "sparkles" },
] as const;

/** Les éléments de la page, dans l'ordre de lecture, avec leur pastille si elle est demandée. */
function buildSite(page: WebPageData, quality: Quality, pinOf: (slot: SiteSlot) => number | undefined, compare = false): SiteSpec {
  const slop = quality === "slop";
  const photo = slop ? null : photoOf(page);
  const screen = slop ? null : screenOf(page);
  const pin = (...slots: SiteSlot[]) => {
    const pins: Partial<Record<SiteSlot, number>> = {};
    for (const slot of slots) {
      const n = pinOf(slot);
      if (n !== undefined) pins[slot] = n;
    }
    return pins;
  };

  if (!slop && page.fields?.length) {
    return {
      url: page.url ?? "tonsite.fr",
      theme: page.theme ?? "chaux",
      nav: { brand: page.nav ?? "Ton entreprise" },
      sections: [{ kind: "form", title: page.heading, text: page.subtitle, fields: page.fields, button: page.button, note: page.offer ?? page.proofs?.join(". "), pins: pin("title", "text", "fields", "cta", "note") }],
    };
  }

  const visual = photo ? { image: photo.src, imageAlt: photo.alt } : {};
  const hero: SiteSection = slop
    ? {
      kind: "hero", variant: "centered", glow: true, eyebrow: page.eyebrow, title: page.heading, accent: lastWord(page.heading),
      text: page.subtitle, cta: page.button, cta2: "En savoir plus", image: "orbs",
      pins: pin("eyebrow", "title", "text", "cta", "cta2", "image"),
    }
    : {
      kind: "hero", variant: screen && !photo ? "product" : "centered",
      title: page.heading, text: page.subtitle, cta: page.button, cta2: page.link ?? "Voir un exemple", note: page.offer,
      ...visual, ...(!photo && screen ? { screen } : {}),
      pins: pin("eyebrow", "title", "text", "cta", "note", "image", "screen"),
    };

  const sections: SiteSection[] = [hero];
  // Dans une comparaison, `proofs` décrit ce que la page fait (légende), pas du contenu de page.
  if (slop && (compare || page.proofs?.length)) {
    sections.push({ kind: "cards", title: "Pourquoi choisir", items: SLOP_CARDS, pins: pin("items") });
  } else if (!compare && page.proofs?.length) {
    sections.push({ kind: "proof", logos: page.proofs, pins: pin("logos") });
  }
  if (page.faq) sections.push({ kind: "faq", title: "Questions utiles", items: [{ q: page.faq }], pins: pin("faq") });
  if (slop && page.offer) sections.push({ kind: "faq", title: "En savoir plus", items: [{ q: page.offer }], pins: pin("note") });

  return {
    url: page.url ?? "tonsite.fr",
    theme: slop ? "slopNuit" : page.theme ?? "chaux",
    nav: { brand: page.nav ?? "Ton entreprise", cta: slop ? "Contact" : undefined },
    sections,
  };
}

type NoteText = { role: string; why: string; alt?: string };

const PREMIUM_NOTES: Partial<Record<SiteSlot, NoteText>> = {
  eyebrow: { role: "Le repère", why: "Une précision utile, comme le métier ou la ville, pas une étiquette décorative." },
  title: { role: "Le titre", why: "Il dit pour qui et quel changement, dans une phrase que le client reconnaît.", alt: "Un chiffre vérifiable, si tu en as un." },
  text: { role: "Le sous-titre", why: "Il explique comment ça se passe, sans jargon.", alt: "Une scène datée plutôt qu'une promesse." },
  cta: { role: "Le bouton", why: "Un seul geste, nommé avec un verbe : le regard sait où aller.", alt: "Un lien vers un exemple pour ceux qui hésitent." },
  image: { role: "La photo", why: "Un vrai métier et un vrai lieu : la preuve passe avant la parole.", alt: "Un avant et après, ou un extrait du livrable." },
  screen: { role: "L'écran", why: "Le produit se voit tel qu'il sera utilisé, avec de vraies lignes.", alt: "Une courte vidéo de quinze secondes." },
  note: { role: "La précision", why: "Elle lève un doute au moment où la personne va cliquer.", alt: "Un délai ou une garantie en une ligne." },
  logos: { role: "Les repères", why: "Ce que la personne doit préparer, lisible d'un coup d'œil.", alt: "Trois lignes de texte plutôt que trois puces." },
  faq: { role: "La question qui bloque", why: "Elle répond au doute le plus fréquent sans faire quitter la page.", alt: "Trois questions, pas plus." },
};

const SLOP_NOTES: Partial<Record<SiteSlot, NoteText>> = {
  eyebrow: { role: "Le surtitre en pilule", why: "Il remplit la place sans dire ce que tu vends.", alt: "Supprime-le, ou écris le métier et la ville." },
  title: { role: "Le titre générique", why: "Il pourrait être collé sur n'importe quelle entreprise, avec un mot en dégradé pour faire joli.", alt: "Dis ce que tu fais, pour qui, avec quel résultat." },
  text: { role: "Le sous-titre vague", why: "Aucun fait, aucun chiffre, aucune scène : rien à retenir.", alt: "Une phrase qui décrit ce qui se passe, jour par jour." },
  cta: { role: "Le premier bouton", why: "Le verbe est flou : on ne sait pas ce qui se passe au clic.", alt: "Un verbe précis : Envoyer mon plan, Commander." },
  cta2: { role: "Le second bouton", why: "Deux gestes à égalité : le regard hésite et personne ne clique.", alt: "Un seul bouton, le reste en simple lien." },
  image: { role: "L'image décorative", why: "Une tache floue ne montre aucun travail et ne prouve rien.", alt: "Une photo réelle de ton travail." },
  items: { role: "Trois cartes à icône", why: "Des mots creux que tout le monde écrit : rapide, fiable, moderne.", alt: "Trois faits que le client peut vérifier." },
  note: { role: "Une question sans réponse", why: "La question est posée mais rien n'est expliqué.", alt: "Réponds directement, en deux phrases." },
};

/** Numérote les éléments dans l'ordre de lecture et produit les notes correspondantes. */
function buildNotes(page: WebPageData, quality: Quality, annotations?: readonly WebAnnotation[], compare = false): { pinOf: (slot: SiteSlot) => number | undefined; notes: SiteNote[] } {
  const defaults = quality === "slop" ? SLOP_NOTES : PREMIUM_NOTES;
  const present = (slot: SiteSlot): boolean => {
    switch (slot) {
      case "eyebrow": return quality === "slop" && Boolean(page.eyebrow);
      case "note": return Boolean(page.offer);
      case "logos": return !compare && Boolean(page.proofs?.length);
      case "items": return quality === "slop";
      case "faq": return Boolean(page.faq) && quality === "premium";
      case "image": return quality === "slop" || Boolean(photoOf(page));
      case "screen": return quality === "premium" && !photoOf(page) && Boolean(screenOf(page));
      case "cta2": return quality === "slop";
      default: return true;
    }
  };

  if (annotations) {
    const isForm = Boolean(page.fields?.length);
    const slotOf = (annotation: WebAnnotation): SiteSlot => {
      const map: Record<WebAnnotation["target"], SiteSlot> = isForm
        ? { heading: "title", subtitle: "text", button: "cta", image: "fields", proofs: "note", offer: "note", faq: "faq" }
        : { heading: "title", subtitle: "text", button: "cta", image: !photoOf(page) && screenOf(page) ? "screen" : "image", proofs: "logos", offer: "note", faq: "faq" };
      return map[annotation.target];
    };
    // Les pastilles se numérotent dans l'ordre où elles apparaissent à l'écran.
    const reading: SiteSlot[] = isForm
      ? ["title", "text", "fields", "cta", "note", "faq"]
      : ["eyebrow", "title", "text", "cta", "note", "image", "screen", "logos", "faq"];
    const sorted = [...annotations].sort((x, y) => reading.indexOf(slotOf(x)) - reading.indexOf(slotOf(y)));
    const numbers = new Map<SiteSlot, number>(sorted.map((annotation, index) => [slotOf(annotation), index + 1]));
    return {
      pinOf: (slot) => numbers.get(slot),
      notes: sorted.map((annotation, index) => ({ pin: index + 1, role: annotation.label, why: annotation.why, alt: annotation.alt })),
    };
  }

  const order: SiteSlot[] = ["eyebrow", "title", "text", "cta", "cta2", "image", "screen", "items", "note", "logos", "faq"];
  const numbered = new Map<SiteSlot, number>();
  for (const slot of order) {
    if (numbered.size < 5 && defaults[slot] && present(slot)) numbered.set(slot, numbered.size + 1);
  }
  return {
    pinOf: (slot) => numbered.get(slot),
    notes: [...numbered.entries()].map(([slot, pin]) => ({ pin, ...(defaults[slot] as NoteText) })),
  };
}

export function WebPage({ page, annotations, ...frame }: WebPageProps) {
  const { pinOf, notes } = buildNotes(page, "premium", annotations);
  return <SiteMockup {...frame} quality="premium" site={buildSite(page, "premium", pinOf)} notes={notes} />;
}

export type WebPageCompareProps = KitBaseProps & {
  beforeTitle: string;
  afterTitle: string;
  before: WebPageData;
  after: WebPageData;
  beforeNotes?: readonly SiteNote[];
  afterNotes?: readonly SiteNote[];
};

export function WebPageCompare({ beforeTitle, afterTitle, before, after, beforeNotes, afterNotes, ...frame }: WebPageCompareProps) {
  const slop = buildNotes(before, "slop", undefined, true);
  const premium = buildNotes(after, "premium", undefined, true);
  return <SiteCompare
    {...frame}
    slopTitle={beforeTitle}
    premiumTitle={afterTitle}
    slop={buildSite(before, "slop", slop.pinOf, true)}
    premium={buildSite(after, "premium", premium.pinOf, true)}
    slopNotes={beforeNotes ?? slop.notes}
    premiumNotes={afterNotes ?? premium.notes}
  />;
}
