import { UPGRADE_PATH } from "@/lib/pricing";
import { normalizeProfileTier } from "@/lib/mcpAccess";

/**
 * Où envoyer une personne qui arrive sur /checkout/upgrade.
 * Seul un compte Fondations obtient le lien du complément ; tous les autres sont renvoyés vers un parcours honnête.
 * `upgradeUrl` est le lien Stripe déjà prêt (avec l'identifiant du compte), ou null s'il est absent ou invalide.
 */
export function resolveUpgradeRedirect(input: {
  authenticated: boolean;
  /** La lecture du profil a échoué (erreur technique, pas « profil absent »). */
  profileError?: boolean;
  tier: string | null | undefined;
  upgradeUrl: string | null;
}): string {
  if (!input.authenticated) return `/login?next=${encodeURIComponent(UPGRADE_PATH)}`;
  if (input.profileError) return "/checkout";

  const tier = normalizeProfileTier(input.tier);
  if (tier === "full") return "/dashboard";
  if (tier === "beginner") return input.upgradeUrl ?? "/checkout?upgrade=indisponible";
  return "/checkout?from=upgrade";
}
