import { getLegalEntity } from "@/lib/legal/entity";
import { optionalSiteOrigin } from "@/lib/siteOrigin";
import type { EmailContext } from "./templates";

/** Contexte des e-mails réellement envoyés : identité légale du vendeur et hôte du site (null si non configuré). */
export function getEmailContext(baseUrl: string | null = optionalSiteOrigin() ?? null): EmailContext {
  const entity = getLegalEntity();
  return {
    baseUrl,
    seller: {
      fullName: entity.fullName,
      tradeName: entity.tradeName,
      siret: entity.siret,
      address: entity.address,
      contactEmail: entity.contactEmail,
      vatMention: entity.vatMention,
    },
  };
}
