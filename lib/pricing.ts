export const FONDATIONS_PRICE = 97;
export const COFFRE_PRICE = 267;
export const UPGRADE_PRICE = COFFRE_PRICE - FONDATIONS_PRICE;

export const COFFRE_LABEL = "LE COFFRE";
export const FONDATIONS_LABEL = "Fondations";

export const STRIPE_FULL_CHECKOUT_LINK = "https://buy.stripe.com/bJeaEYe46bxT00I0PC5AQ0c";

export function sanitizeStripeCheckoutUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      url.hostname !== "buy.stripe.com" ||
      url.username ||
      url.password ||
      url.port
    ) {
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

export function withClientReferenceId(
  baseUrl: string | null | undefined,
  userId: string | null | undefined,
): string | null {
  const safeBaseUrl = sanitizeStripeCheckoutUrl(baseUrl);
  if (!safeBaseUrl) return null;
  if (!userId) return safeBaseUrl;

  try {
    const parsed = new URL(safeBaseUrl);
    if (parsed.searchParams.has("client_reference_id")) return null;
  } catch {
    return null;
  }

  const hashIndex = safeBaseUrl.indexOf("#");
  const path = hashIndex === -1 ? safeBaseUrl : safeBaseUrl.slice(0, hashIndex);
  const hash = hashIndex === -1 ? "" : safeBaseUrl.slice(hashIndex);
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}client_reference_id=${encodeURIComponent(userId)}${hash}`;
}
