/**
 * Mémoire courte des URL de Checkout du complément, par compte.
 *
 * GET /checkout/upgrade est une navigation : un lien posé sur un autre site, un prefetch ou un scanner
 * d'e-mails peut le rejouer en rafale avec la session du compte connecté. La clé d'idempotence Stripe
 * garantit déjà une seule session par fenêtre, mais chaque rejeu appelait quand même l'API Stripe.
 * On sert donc l'URL déjà obtenue dans la même fenêtre sans rappeler Stripe. La mémoire est locale à
 * l'instance : au pire une création Stripe par instance et par fenêtre, toujours dédoublonnée par la clé.
 */
const MAX_ENTRIES = 500;

type Entry = { url: string; windowIndex: number };

export function createUpgradeCheckoutCache(windowMs: number) {
  const entries = new Map<string, Entry>();
  const windowIndexAt = (nowMs: number) => Math.floor(nowMs / windowMs);

  return {
    get(userId: string, nowMs = Date.now()): string | null {
      const entry = entries.get(userId);
      if (!entry) return null;
      if (entry.windowIndex !== windowIndexAt(nowMs)) {
        entries.delete(userId);
        return null;
      }
      return entry.url;
    },
    set(userId: string, url: string, nowMs = Date.now()): void {
      if (entries.size >= MAX_ENTRIES && !entries.has(userId)) {
        const oldest = entries.keys().next().value;
        if (oldest !== undefined) entries.delete(oldest);
      }
      entries.set(userId, { url, windowIndex: windowIndexAt(nowMs) });
    },
    size: () => entries.size,
  };
}
