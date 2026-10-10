import { z } from "zod";
import { BUILD_SYNC_CLIENT_ID, BUILD_SYNC_SCOPE } from "@/lib/buildSync/config";

const LOOPBACK_HOST = "127.0.0.1";

export function isBuildSyncRedirectUri(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "http:" &&
      url.hostname === LOOPBACK_HOST &&
      /^\d+$/.test(url.port) &&
      Number(url.port) >= 1024 &&
      Number(url.port) <= 65535 &&
      url.pathname === "/callback" &&
      url.search === "" &&
      url.hash === "" &&
      url.username === "" &&
      url.password === ""
    );
  } catch {
    return false;
  }
}

export function createBuildSyncAuthorizationSchema(resourceUrl: string) {
  return z.object({
    client_id: z.literal(BUILD_SYNC_CLIENT_ID),
    redirect_uri: z.string().max(2048).refine(isBuildSyncRedirectUri),
    response_type: z.literal("code"),
    code_challenge: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
    code_challenge_method: z.literal("S256"),
    state: z.string().min(16).max(1024),
    resource: z.literal(resourceUrl),
    scope: z.literal(BUILD_SYNC_SCOPE),
  }).strict();
}

const opaqueToken = z.string().regex(/^[A-Za-z0-9_-]{43}$/);

export function createBuildSyncTokenSchema(resourceUrl: string) {
  return z.discriminatedUnion("grant_type", [
    z.object({
      grant_type: z.literal("authorization_code"),
      code: opaqueToken,
      redirect_uri: z.string().max(2048).refine(isBuildSyncRedirectUri),
      client_id: z.literal(BUILD_SYNC_CLIENT_ID),
      code_verifier: z.string().regex(/^[A-Za-z0-9._~-]{43,128}$/),
      resource: z.literal(resourceUrl),
    }).strict(),
    z.object({
      grant_type: z.literal("refresh_token"),
      refresh_token: opaqueToken,
      client_id: z.literal(BUILD_SYNC_CLIENT_ID),
      resource: z.literal(resourceUrl),
    }).strict(),
  ]);
}

export type BuildSyncTokenRequest = z.infer<ReturnType<typeof createBuildSyncTokenSchema>>;

export function parseBuildSyncTokenRequest(
  params: URLSearchParams,
  resourceUrl: string
): BuildSyncTokenRequest | null {
  const entries = [...params.entries()];
  if (new Set(entries.map(([key]) => key)).size !== entries.length) return null;
  const parsed = createBuildSyncTokenSchema(resourceUrl).safeParse(Object.fromEntries(entries));
  return parsed.success ? parsed.data : null;
}
