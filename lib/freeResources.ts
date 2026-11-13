/**
 * Ressources gratuites : deux skills offerts contre un compte. Le catalogue est écrit ici, les fichiers vivent dans le dépôt privé
 * `free-resources` (voir scripts/publish-free-resources.ts). Aucun prix ni compteur écrit en dur : ils viennent de lib/pricing.ts et du catalogue.
 */
export const FREE_RESOURCE_BUCKET = "free-resources";

export const FREE_RESOURCE_SLUGS = ["slop", "skill"] as const;
export type FreeResourceSlug = (typeof FREE_RESOURCE_SLUGS)[number];

export const FREE_RESOURCE_SOURCES = ["direct", "tiktok", "instagram", "youtube", "linkedin"] as const;
export type FreeResourceSource = (typeof FREE_RESOURCE_SOURCES)[number];

export const FREE_RESOURCE_PREVIEWS = ["compare", "workflow"] as const;
export type FreeResourcePreview = (typeof FREE_RESOURCE_PREVIEWS)[number];

export type FreeResource = {
  slug: FreeResourceSlug;
  /** Nature de la ressource : le catalogue grandira, la page range par nature. */
  category: "Skill" | "Schéma" | "Modèle";
  /** Logos d'outils connus (noms de lib/tools/registry.ts) : ce avec quoi la ressource se sert. */
  logos: readonly string[];
  /** Objet de la marque (public/da/objets) qui accompagne la ressource. */
  object: string;
  /** Ce qu'on montre : le rendu de la ressource, jamais seulement sa description. */
  preview: FreeResourcePreview;
  /** Place dans la grille : « wide » prend toute la largeur, « half » la moitié. */
  layout: "wide" | "half";
  /** Le mot écrit en commentaire sous la vidéo. */
  word: string;
  title: string;
  promise: string;
  /** Ce que la compétence permet de faire ensuite (proposer un service, publier plus vite) : une idée, jamais une promesse de revenu. */
  angle: string;
  includes: readonly string[];
  meta: string;
  /** Nom du fichier dans le dépôt privé et nom proposé au téléchargement. */
  fileName: string;
  /** Prochain pas vers BUILD, relié à ce que la ressource vient de montrer. */
  next: { text: string; blocId: string | null; skillSlug: string | null };
};

export const FREE_RESOURCES: readonly FreeResource[] = [
  {
    slug: "slop",
    category: "Skill",
    logos: ["Claude", "ChatGPT"],
    object: "/da/objets/vente.png",
    preview: "compare",
    layout: "half",
    word: "SLOP",
    title: "Écris avec l'IA, sonne comme toi",
    promise:
      "Claude apprend ta façon de parler, puis relit chaque texte qu'il te rend. Il retire les formules d'IA («\u00a0dans un monde où…\u00a0») et te demande le fait qui manque, une date, un nom, un chiffre.",
    angle:
      "Savoir relire un texte d'IA se propose à ceux qui publient chaque semaine\u00a0: posts, newsletters, fiches produit.",
    includes: [
      "Le skill, prêt à copier dans Claude",
      "Un profil de ta voix, posée ou expressive, pour que le texte reste le tien",
      "Un détecteur d'indices à lancer sur n'importe quel texte",
      "Dix familles de signes d'un texte d'IA, chacune avec sa réécriture",
      "Trois exemples avant et après, avec les scores",
      "Un mode pour les textes dits à voix haute\u00a0: durée, pauses, expressions qui sonnent parlé",
    ],
    meta: "Pour Claude, avec une version à coller dans n'importe quelle IA",
    fileName: "slop.zip",
    next: {
      text: "Dans BUILD, tu apprends à fabriquer tes propres skills\u00a0: un par métier, relié à un projet réel.",
      blocId: "4",
      skillSlug: null,
    },
  },
  {
    slug: "skill",
    category: "Skill",
    logos: ["Claude", "Codex", "Kling"],
    object: "/da/objets/video.png",
    preview: "workflow",
    layout: "wide",
    word: "SKILL",
    title: "Ton clone IA qui parle à la caméra",
    promise:
      "Ton avatar IA s'assoit dans un fauteuil de podcast et dit ton script avec ta voix. Le skill guide Claude de la voix clonée au lip-sync, étape par étape, jusqu'à ta première prise sans avoir allumé une caméra.",
    angle:
      "Si tu sais le faire pour toi, tu peux le proposer à un coach, une marque ou un artisan qui n'a pas le temps de filmer.",
    includes: [
      "Le workflow complet en sept étapes, de la voix clonée au montage",
      "Trois modèles de prompts, du personnage au clip muet",
      "Un script pour couper la voix aux silences, un autre pour le lip-sync",
      "Les erreurs qui trahissent un avatar IA (clignements, gestes figés) et comment les éviter",
    ],
    meta: "Pour Claude. Les modèles d'image et de vidéo se paient chez leurs fournisseurs",
    fileName: "video-personnage-ia.zip",
    next: {
      text: "Le workflow complet de motion design de BUILD va plus loin\u00a0: script, voix, musique, sons et rendu vérifié.",
      blocId: null,
      skillSlug: "product-film-factory",
    },
  },
];

export function getFreeResource(slug: string): FreeResource | null {
  return FREE_RESOURCES.find((resource) => resource.slug === slug) ?? null;
}

/** Chemin du fichier dans le dépôt privé. */
export function freeResourceStoragePath(resource: FreeResource): string {
  return resource.fileName;
}

/** Une ressource gratuite demande un compte, rien de plus. Aucun niveau d'achat n'est requis. */
export function canDownloadFreeResource(userId: string | null | undefined): boolean {
  return typeof userId === "string" && userId.length > 0;
}

/** D'où vient la personne : valeur fermée, jamais le texte brut de l'adresse. */
export function normalizeFreeResourceSource(raw: string | string[] | null | undefined): FreeResourceSource {
  const value = (Array.isArray(raw) ? raw[0] : raw)?.toLowerCase();
  return (FREE_RESOURCE_SOURCES as readonly string[]).includes(value ?? "") ? (value as FreeResourceSource) : "direct";
}

/** Adresse de connexion qui ramène sur la page avec la ressource visée et la source. */
export function freeResourceSignupHref(slug: FreeResourceSlug | null, source: FreeResourceSource): string {
  const params = new URLSearchParams();
  if (slug) params.set("r", slug);
  if (source !== "direct") params.set("s", source);
  const back = `/ressources${params.size ? `?${params.toString()}` : ""}`;
  return `/login?mode=signup&next=${encodeURIComponent(back)}`;
}

export function freeResourceDownloadHref(slug: FreeResourceSlug, source: FreeResourceSource): string {
  return `/api/ressources/${slug}${source === "direct" ? "" : `?s=${source}`}`;
}
