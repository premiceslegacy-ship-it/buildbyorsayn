import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/siteOrigin";

const SITE_URL = getSiteOrigin();

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
