/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove X-Powered-By header
  poweredByHeader: false,

  // Keep the revocable MCP asset out of /_next/image so its launch gate and
  // no-store response cannot be bypassed. Editorial reference covers, card
  // illustrations and client logos may use the optimized local image pipeline.
  images: {
    localPatterns: [
      { pathname: "/_next-image-not-used/**" },
      { pathname: "/assets/illustrations/**" },
      { pathname: "/brand-logos/**" },
      { pathname: "/da/**" },
      { pathname: "/logos/**" },
      { pathname: "/logos3d/**" },
    ],
  },

  outputFileTracingIncludes: {
    "/api/mcp/showcase-asset": ["./private/brand-assets/build-mcp-connector-characters.webp"],
    "/api/mcp/logo": ["./public/mcp/build-logo.png"],
    "/api/search": ["./content/fondations/*.md"],
    "/beginner/*": ["./content/fondations/*.md"],
  },

  async redirects() {
    // Exact path only: /videos/tutos (Hermes Agent) keeps its own route.
    return [{ source: "/videos", destination: "/nouveautes", permanent: true }];
  },

  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) return [];
    return [
      {
        // Apply security headers to all routes except the MCP connector
        // surface: Cross-Origin-Resource-Policy: same-origin below would
        // otherwise block Claude/ChatGPT from fetching /api/mcp and the
        // OAuth discovery documents cross-origin.
        source: "/((?!api/mcp|\\.well-known).*)",
        headers: [
          // --- HIGH / CRITICAL ---
          // La CSP des pages (avec nonce par requête) est posée par proxy.ts (lib/csp.ts), jamais ici :
          // une seconde CSP statique avec 'unsafe-inline' s'ajouterait à celle du proxy sans la durcir.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // --- MEDIUM ---
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          // --- LOW ---
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
        ],
      },
      {
        // Réponses d'API (hors connecteur MCP) : aucune ressource à charger, aucune intégration possible.
        // Même valeur que API_CONTENT_SECURITY_POLICY dans lib/csp.ts (ce fichier n'importe pas de TypeScript).
        source: "/api/((?!mcp(?:/|$)).*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
