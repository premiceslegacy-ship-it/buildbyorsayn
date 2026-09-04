import { z } from "zod";
import { isRedirectUriRegistrable } from "@/lib/mcp/oauth";

const redirectUriSchema = z.string().max(2048).refine(isRedirectUriRegistrable);

export const dcrMetadataSchema = z.object({
  redirect_uris: z.array(redirectUriSchema).min(1).max(10).refine(
    (uris) => new Set(uris).size === uris.length,
    "redirect_uris must be unique"
  ),
  client_name: z.string().max(120).optional(),
  token_endpoint_auth_method: z.literal("none").default("none"),
  grant_types: z.array(z.enum(["authorization_code", "refresh_token"])).max(2).optional(),
  response_types: z.array(z.literal("code")).max(1).optional(),
}).strict();

export function createAuthorizationRequestSchema(resourceUrl: string) {
  return z.object({
    client_id: z.string().min(1).max(256),
    redirect_uri: z.string().min(1).max(2048),
    response_type: z.literal("code"),
    code_challenge: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
    code_challenge_method: z.literal("S256"),
    state: z.string().max(1024).default(""),
    resource: z.literal(resourceUrl),
    scope: z.literal("mcp").default("mcp"),
  }).strict();
}

const opaqueTokenSchema = z.string().regex(/^[A-Za-z0-9_-]{43}$/);
const clientIdSchema = z.string().min(1).max(256);

export function createTokenRequestSchema(resourceUrl: string) {
  const authorizationCode = z.object({
    grant_type: z.literal("authorization_code"),
    code: opaqueTokenSchema,
    redirect_uri: z.string().min(1).max(2048),
    client_id: clientIdSchema,
    code_verifier: z.string().regex(/^[A-Za-z0-9._~-]{43,128}$/),
    resource: z.literal(resourceUrl),
  }).strict();
  const refreshToken = z.object({
    grant_type: z.literal("refresh_token"),
    refresh_token: opaqueTokenSchema,
    client_id: clientIdSchema,
    resource: z.literal(resourceUrl),
  }).strict();
  return z.discriminatedUnion("grant_type", [authorizationCode, refreshToken]);
}

export type TokenRequest = z.infer<ReturnType<typeof createTokenRequestSchema>>;

export function parseTokenRequest(params: URLSearchParams, resourceUrl: string): TokenRequest | null {
  const entries = [...params.entries()];
  if (new Set(entries.map(([key]) => key)).size !== entries.length) return null;
  const parsed = createTokenRequestSchema(resourceUrl).safeParse(Object.fromEntries(entries));
  return parsed.success ? parsed.data : null;
}
