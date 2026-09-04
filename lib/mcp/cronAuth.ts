export function verifyMcpCleanupAuthorization(
  authorizationHeader: string | null,
  configuredSecret: string
): boolean {
  if (configuredSecret.length < 32 || !authorizationHeader?.startsWith("Bearer ")) return false;
  const provided = authorizationHeader.slice("Bearer ".length);
  const encoder = new TextEncoder();
  const left = encoder.encode(provided);
  const right = encoder.encode(configuredSecret);
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left[index] ^ right[index];
  }
  return difference === 0;
}
