/**
 * Faits publics sur l'éditeur de BUILD, repris des pages légales publiées par Samuel Mbeboura sur atelier-btp.fr
 * (mentions légales, CGV, confidentialité). Chacune de ces valeurs peut être remplacée par une variable LEGAL_*.
 * Ce qui n'y figure pas (code postal, ville, médiateur) est volontairement absent : rien n'est inventé.
 */

export const PUBLIC_IDENTITY = {
  fullName: "Samuel Mbeboura",
  tradeName: "Orsayn",
  legalForm: "Entrepreneur individuel",
  siret: "98920815200011",
  street: "1 rue des héraults",
  phone: "06 51 66 40 68",
  contactEmail: "contact@orsayn.fr",
  director: "Samuel Mbeboura",
} as const;

/** Franchise en base de TVA : l'éditeur ne facture pas de TVA. */
export const DEFAULT_VAT_MENTION = "TVA non applicable, article 293 B du CGI";

/** Mention à afficher à côté d'un prix (offres, CGV) : les prix sont nets. */
export const PRICE_NET_MENTION = "Prix nets, TVA non applicable, article 293 B du CGI";
