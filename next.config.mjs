/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove X-Powered-By header
  poweredByHeader: false,

  // No optimized local images are used. Keep the revocable MCP asset out of
  // /_next/image so its launch gate and no-store response cannot be bypassed.
  images: {
    localPatterns: [{ pathname: "/_next-image-not-used/**" }],
  },

  outputFileTracingIncludes: {
    "/api/mcp/showcase-asset": ["./private/brand-assets/build-mcp-connector-characters.webp"],
    "/api/mcp/logo": ["./private/brand-assets/build-logo.png"],
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
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://generativelanguage.googleapis.com",
              "frame-src https://js.stripe.com https://www.youtube.com https://www.youtube-nocookie.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
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
    ];
  },
};

export default nextConfig;
