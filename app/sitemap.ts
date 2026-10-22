import type { MetadataRoute } from "next";
import { legalUpdatedAt } from "@/lib/legal/documents";
import { LEGAL_LINKS } from "@/lib/legal/links";
import { getSiteOrigin } from "@/lib/siteOrigin";

// Même hôte que celui des métadonnées du layout racine.
const SITE_URL = getSiteOrigin();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    ...LEGAL_LINKS.map((link) => ({
      url: `${SITE_URL}${link.href}`,
      lastModified: new Date(`${legalUpdatedAt(link.href)}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
