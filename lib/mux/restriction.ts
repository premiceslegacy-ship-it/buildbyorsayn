const HOSTNAME = /^(\*\.)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/;
const MAX_DOMAINS = 10; // Mux limit

/**
 * Domains allowed to play lessons. Explicit by design: guessing from an env var
 * would silently lock playback to the wrong host (or to localhost when run locally).
 * A bare `*` or `*.vercel.app` would let anyone's deployment play the videos.
 */
export function resolveAllowedDomains(args: string[]): string[] {
  const domains = [...new Set(args.map((arg) => arg.trim().toLowerCase()).filter(Boolean))];
  if (domains.length === 0) throw new Error("Pass the domain(s) that serve the site, e.g. npm run mux:restriction -- build-system-three.vercel.app");
  if (domains.length > MAX_DOMAINS) throw new Error(`Mux accepts at most ${MAX_DOMAINS} domains`);
  for (const domain of domains) {
    if (!HOSTNAME.test(domain)) throw new Error(`Not a hostname: ${domain} (no scheme, path or port)`);
    if (/^\*\.(vercel\.app|netlify\.app|github\.io|pages\.dev)$/.test(domain)) throw new Error(`${domain} would let anyone's deployment play the lessons`);
  }
  return domains;
}
