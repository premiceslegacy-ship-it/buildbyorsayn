/**
 * Source unique de l'hôte public du site côté serveur.
 *
 * Tout le code qui a besoin de l'adresse du site (métadonnées, plan du site, robots.txt, invitation Stripe,
 * rappel WebSub YouTube) passe par ici. L'hôte vient de NEXT_PUBLIC_APP_URL, renseignée par environnement
 * sur Vercel. Changer de domaine, c'est changer cette variable (voir DOMAIN-MIGRATION.md).
 *
 * Ne concerne pas :
 * - l'issuer du connecteur MCP et celui de BUILD Sync, qui ont leurs propres variables (lib/mcp/config.ts,
 *   lib/buildSync/config.ts) pour pouvoir rester sur l'ancien domaine pendant la double période ;
 * - les scripts d'installation de public/build-sync, qui ne lisent pas l'environnement
 *   (voir BUILD_SYNC_SCRIPT_DEFAULT_ORIGIN dans lib/buildSync/installCommands.ts).
 */

export const DEV_SITE_ORIGIN = "http://localhost:3000";
const SITE_ORIGIN_VARIABLE = "NEXT_PUBLIC_APP_URL";

const LOOPBACK_HOSTS = ["localhost", "127.0.0.1", "[::1]"];

/** Valide une adresse de site et la ramène à son origine (sans barre finale). Lève une erreur claire sinon. */
export function parseSiteOrigin(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error(`${SITE_ORIGIN_VARIABLE} is not a valid URL.`);
  }
  if (url.username || url.password || url.search || url.hash || (url.pathname !== "/" && url.pathname !== "")) {
    throw new Error(`${SITE_ORIGIN_VARIABLE} must be an origin only: no credentials, path, query or fragment.`);
  }
  const loopback = LOOPBACK_HOSTS.includes(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) {
    throw new Error(`${SITE_ORIGIN_VARIABLE} must use HTTPS (HTTP is accepted only on localhost).`);
  }
  return url.origin;
}

/**
 * Hôte du site. Hors production, une variable absente donne http://localhost:3000.
 * En production, une variable absente est une erreur : on n'invente jamais un hôte.
 */
export function resolveSiteOrigin(raw: string | undefined, nodeEnv: string | undefined): string {
  if (raw?.trim()) return parseSiteOrigin(raw);
  if (nodeEnv === "production") {
    throw new Error(`${SITE_ORIGIN_VARIABLE} is required in production: it must be the host that serves the site.`);
  }
  return DEV_SITE_ORIGIN;
}

export function getSiteOrigin(): string {
  return resolveSiteOrigin(process.env.NEXT_PUBLIC_APP_URL, process.env.NODE_ENV);
}

/**
 * Variante stricte, sans repli de développement : pour les adresses envoyées à l'extérieur
 * (invitation d'un client qui vient de payer, rappel WebSub). Une adresse inventée y serait pire qu'une erreur.
 */
export function requireSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL;
  if (!raw?.trim()) throw new Error(`${SITE_ORIGIN_VARIABLE} is not configured.`);
  return parseSiteOrigin(raw);
}

/** Hôte du site s'il est configuré, sinon undefined : pour un texte qui sait se passer de lien. */
export function optionalSiteOrigin(): string | undefined {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() ? requireSiteOrigin() : undefined;
}
