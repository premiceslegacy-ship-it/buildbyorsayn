const INTERNAL_ORIGIN = "https://internal.orsayn.invalid";

export function sanitizeInternalRedirect(
  value: unknown,
  fallback = "/dashboard"
) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//")
  ) {
    return fallback;
  }

  let decoded: string;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return fallback;
  }

  if (
    decoded.includes("\\") ||
    decoded.startsWith("//") ||
    /[\u0000-\u001f\u007f]/.test(decoded)
  ) {
    return fallback;
  }

  try {
    const resolved = new URL(value, INTERNAL_ORIGIN);
    if (resolved.origin !== INTERNAL_ORIGIN) return fallback;
    const normalized = `${resolved.pathname}${resolved.search}${resolved.hash}`;
    if (
      !normalized.startsWith("/") ||
      normalized.startsWith("//") ||
      normalized.includes("\\")
    ) {
      return fallback;
    }
    return normalized;
  } catch {
    return fallback;
  }
}
