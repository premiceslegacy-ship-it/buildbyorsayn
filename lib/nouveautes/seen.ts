const NOUVEAUTES_BADGE_CAP = 9;
export const NOUVEAUTES_FRESH_DAYS = 14;
const FRESH_WINDOW_MS = NOUVEAUTES_FRESH_DAYS * 24 * 60 * 60 * 1000;

/** Une entrée reste fraîche 14 jours, sauf si elle a été ouverte ou regardée. */
export function isNewsFresh(
  publishedAt: string,
  seen: boolean,
  watched: boolean,
  now: Date | string = new Date(),
): boolean {
  const published = Date.parse(publishedAt);
  const current = typeof now === "string" ? Date.parse(now) : now.getTime();
  return !seen && !watched && Number.isFinite(published) && Number.isFinite(current)
    && current >= published && current - published < FRESH_WINDOW_MS;
}

/** Null hides the badge; counts above the cap render as `9+`. */
export function formatNouveautesBadge(count: number | null): string | null {
  if (!count || count <= 0) return null;
  return count > NOUVEAUTES_BADGE_CAP ? `${NOUVEAUTES_BADGE_CAP}+` : String(count);
}
