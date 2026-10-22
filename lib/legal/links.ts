/** Pages légales : une seule liste, utilisée par le pied de page, le sitemap et les tests. */
export const LEGAL_LINKS = [
  { href: "/cgv", label: "Conditions générales de vente" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Politique de confidentialité" },
  { href: "/cookies", label: "Cookies" },
] as const;

/** Adresse de contact réelle de BUILD (tout tourne sur le domaine orsayn.fr ; build@orsayn.fr est l'adresse d'envoi des e-mails, pas de contact). */
export const CONTACT_EMAIL = "contact@orsayn.fr";
