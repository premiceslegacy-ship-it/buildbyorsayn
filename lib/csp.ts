/**
 * Politique de sécurité du contenu des pages HTML, avec un nonce par requête.
 *
 * Le nonce est posé par proxy.ts sur la requête (Next.js le lit pour signer ses scripts inline)
 * et sur la réponse. Les pages concernées sont rendues à la demande : un nonce ne peut pas
 * être gravé dans du HTML prérendu.
 *
 * - script-src n'autorise ni 'unsafe-inline' ni 'unsafe-eval'. 'unsafe-eval' reste ouvert uniquement en
 *   développement (React l'utilise pour reconstituer les piles d'appels).
 * - style-src garde 'unsafe-inline' : les attributs style générés par les composants et le lecteur Mux ne
 *   peuvent pas porter de nonce, et une feuille de style n'exécute pas de code.
 * - upgrade-insecure-requests seulement sur le vrai déploiement : Safari l'applique aussi à http://127.0.0.1,
 *   les CSS et scripts y seraient demandés en https et la page s'afficherait sans style.
 */
export type ContentSecurityPolicyOptions = {
  nonce: string;
  /** true sur le déploiement Vercel (process.env.VERCEL renseigné). */
  deployed: boolean;
  /** true avec `next dev`. */
  development?: boolean;
};

export function createCspNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function buildContentSecurityPolicy({ nonce, deployed, development = false }: ContentSecurityPolicyOptions): string {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(nonce)) throw new Error("CSP nonce must be base64.");
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'${development ? " 'unsafe-eval'" : ""} https://js.stripe.com https://src.litix.io`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.mux.com https://*.litix.io",
    // Lecture HLS Mux : segments en https, URL blob MSE et worker blob.
    "media-src 'self' blob: https://*.mux.com",
    "worker-src 'self' blob:",
    "frame-src https://js.stripe.com https://www.youtube.com https://www.youtube-nocookie.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    ...(deployed ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
}

/** Réponses d'API : rien à charger, rien à intégrer. */
export const API_CONTENT_SECURITY_POLICY = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'";
