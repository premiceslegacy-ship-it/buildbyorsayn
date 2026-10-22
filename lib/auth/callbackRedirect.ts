import { sanitizeInternalRedirect } from "@/lib/safeRedirect";

// Chemins autorisés après le retour d'un lien Supabase (confirmation, réinitialisation).
const ALLOWED_REDIRECT_PREFIXES = [
  "/dashboard",
  "/update-password",
  "/blocs",
  "/sources",
  "/fin",
  "/intro",
  "/admin",
  "/checkout",
] as const;

const FALLBACK = "/dashboard";

/**
 * Destination après /auth/callback. Chemin interne uniquement (mêmes règles que la page de
 * connexion : décodage, barres obliques inverses, caractères de contrôle, `//`), puis limité
 * aux segments connus. La comparaison porte sur le segment entier : `/dashboardx` n'est pas
 * `/dashboard`.
 */
export function resolveCallbackRedirect(rawPath: string | null | undefined): string {
  const safe = sanitizeInternalRedirect(rawPath ?? FALLBACK, FALLBACK);
  const pathname = safe.split(/[?#]/, 1)[0];
  const allowed = ALLOWED_REDIRECT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  return allowed ? safe : FALLBACK;
}
