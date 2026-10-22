import type { CookieOptions } from "@supabase/ssr";

/**
 * Les cookies de session Supabase doivent porter l'attribut Secure sur le vrai déploiement (HTTPS).
 * @supabase/ssr ne le pose pas par défaut. On ne le force pas en local : Safari refuse les cookies Secure sur http://127.0.0.1.
 * Le jeton reste lisible par le script (httpOnly impossible : le client navigateur lit la session), d'où la CSP à nonce.
 */
export function secureSessionCookie(options: CookieOptions | undefined, deployed: boolean): CookieOptions {
  return deployed ? { ...options, secure: true } : { ...options };
}
