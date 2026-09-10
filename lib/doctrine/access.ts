import type { DoctrineFile } from "./publication";
export type DoctrineAccessStatus = 200 | 401 | 403;
export function resolveDoctrineAccess(
  user: { app_metadata?: Record<string, unknown> } | null,
  profile: { tier?: unknown } | null,
  authError: unknown = null,
  profileError: unknown = null,
): DoctrineAccessStatus {
  if (authError || !user) return 401;
  if (profileError || !profile) return 403;
  return profile.tier === "full" || user.app_metadata?.role === "admin" ? 200 : 403;
}
export async function serveDoctrine(
  authorize: () => Promise<DoctrineAccessStatus>,
  read: () => Promise<DoctrineFile[]>,
): Promise<Response> {
  const headers = { "cache-control": "private, no-store" };
  try {
    const status = await authorize();
    if (status !== 200) return Response.json({ error: "Access denied" }, { status, headers });
    return Response.json({ files: await read() }, { headers });
  } catch {
    return Response.json({ error: "Doctrine unavailable" }, { status: 503, headers });
  }
}
