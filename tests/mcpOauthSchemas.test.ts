import assert from "node:assert/strict";
import test from "node:test";
import {
  createAuthorizationRequestSchema,
  dcrMetadataSchema,
  parseTokenRequest,
} from "../lib/mcp/oauthSchemas";

const CHALLENGE = "A".repeat(43);

test("DCR accepts only strict public-client metadata", () => {
  const valid = {
    redirect_uris: ["https://client.example/callback"],
    client_name: "Claude",
    token_endpoint_auth_method: "none",
  };
  assert.equal(dcrMetadataSchema.safeParse(valid).success, true);
  assert.equal(dcrMetadataSchema.safeParse({ ...valid, token_endpoint_auth_method: "client_secret_post" }).success, false);
  assert.equal(dcrMetadataSchema.safeParse({ ...valid, unexpected: true }).success, false);
  assert.equal(dcrMetadataSchema.safeParse({ ...valid, redirect_uris: [valid.redirect_uris[0], valid.redirect_uris[0]] }).success, false);
});

test("authorization requests require exact resource, scope and S256 challenge", () => {
  const schema = createAuthorizationRequestSchema("https://build.example/api/mcp");
  const valid = {
    client_id: "client",
    redirect_uri: "https://client.example/callback",
    response_type: "code",
    code_challenge: CHALLENGE,
    code_challenge_method: "S256",
    state: "state",
    resource: "https://build.example/api/mcp",
    scope: "mcp",
  };
  assert.equal(schema.safeParse(valid).success, true);
  assert.equal(schema.safeParse({ ...valid, resource: "https://evil.example/api/mcp" }).success, false);
  assert.equal(schema.safeParse({ ...valid, resource: "" }).success, false);
  assert.equal(schema.safeParse({ ...valid, code_challenge: "not-valid" }).success, false);
  assert.equal(schema.safeParse({ ...valid, scope: "mcp admin" }).success, false);
});

test("token requests reject duplicate, unknown and missing resource parameters", () => {
  const expected = "https://build.example/api/mcp";
  const valid = new URLSearchParams({
    grant_type: "authorization_code",
    code: "a".repeat(43),
    redirect_uri: "https://client.example/callback",
    client_id: "00000000-0000-4000-8000-000000000001",
    code_verifier: "b".repeat(43),
    resource: expected,
  });
  assert.ok(parseTokenRequest(valid, expected));

  const duplicate = new URLSearchParams(valid);
  duplicate.append("code", "c".repeat(43));
  assert.equal(parseTokenRequest(duplicate, expected), null);

  const unknown = new URLSearchParams(valid);
  unknown.set("extra", "1");
  assert.equal(parseTokenRequest(unknown, expected), null);

  const missingResource = new URLSearchParams(valid);
  missingResource.delete("resource");
  assert.equal(parseTokenRequest(missingResource, expected), null);
});
