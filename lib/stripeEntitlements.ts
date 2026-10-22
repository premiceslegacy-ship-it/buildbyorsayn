export type PaidTier = "beginner" | "full";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string | null | undefined): value is string {
  return Boolean(value && UUID_PATTERN.test(value));
}

export function normalizeCustomerEmail(value: string | null | undefined): string | null {
  const normalized = value?.trim().toLowerCase();
  return normalized || null;
}

export function escapeIlikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export function emailsMatch(
  left: string | null | undefined,
  right: string | null | undefined,
): boolean {
  const normalizedLeft = normalizeCustomerEmail(left);
  const normalizedRight = normalizeCustomerEmail(right);
  return Boolean(normalizedLeft && normalizedRight && normalizedLeft === normalizedRight);
}

export function referenceMatchesProfile(
  referenceId: string | null | undefined,
  customerEmail: string | null | undefined,
  profileEmail: string | null | undefined,
): boolean {
  return isUuid(referenceId) && emailsMatch(customerEmail, profileEmail);
}

export function determineStripeTier(
  priceId: string | null | undefined,
  beginnerPriceId: string | undefined,
  fullPriceId: string | undefined,
  upgradePriceId: string | undefined,
): PaidTier | null {
  if (!priceId) return null;
  if (priceId === beginnerPriceId) return "beginner";
  if (priceId === fullPriceId || priceId === upgradePriceId) return "full";
  return null;
}

export function shouldApplyStripeTier(
  currentTier: string | null | undefined,
  incomingTier: PaidTier,
): boolean {
  if (currentTier === "admin") return false;
  if (currentTier === "full" && incomingTier === "beginner") return false;
  return true;
}

export type UpgradeDecision = "grant" | "refuse" | "noop";

/**
 * Dernier rempart côté paiement : le complément (Fondations vers LE COFFRE) n'est jamais accordé à un compte
 * qui n'a pas déjà Fondations.
 * - "noop"   : ce paiement n'est pas le complément, le traitement habituel s'applique ;
 * - "grant"  : complément payé par un compte beginner, full ou admin ;
 * - "refuse" : complément payé par un compte gratuit, preview, sans niveau ou inconnu : pas d'accès, remboursement.
 */
export function decideUpgradeAccess(
  priceId: string | null | undefined,
  upgradePriceId: string | undefined,
  currentTier: string | null | undefined,
): UpgradeDecision {
  if (!priceId || !upgradePriceId || priceId !== upgradePriceId) return "noop";
  if (currentTier === "beginner" || currentTier === "full" || currentTier === "admin") return "grant";
  return "refuse";
}
