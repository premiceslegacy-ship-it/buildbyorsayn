import { optionalSiteOrigin } from "@/lib/siteOrigin";
import type { EmailContext } from "./templates";

/** Contexte public des e-mails : aucune identité personnelle ou adresse postale n'y est injectée. */
export function getEmailContext(baseUrl: string | null = optionalSiteOrigin() ?? null): EmailContext {
  return {
    baseUrl,
    seller: { contactEmail: "contact@orsayn.fr" },
  };
}
