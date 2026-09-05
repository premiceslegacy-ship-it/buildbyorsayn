import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("knowledge search derives entitlement inside PostgreSQL from the active bearer token", async () => {
  const migration = await readFile(
    "supabase/migrations/20260905001000_mcp_knowledge_entitlement_boundary.sql",
    "utf8"
  );
  assert.match(migration, /p_token_hash text/i);
  assert.match(migration, /from public\.mcp_access_tokens/i);
  assert.match(migration, /join public\.profiles/i);
  assert.match(migration, /stored\.revoked_at is null/i);
  assert.match(migration, /stored\.expires_at > statement_timestamp\(\)/i);
  assert.match(migration, /stored\.resource = p_expected_resource/i);
  assert.match(migration, /stored\.scope = 'mcp'/i);
  assert.match(migration, /when profile\.tier = 'admin' then 'full'/i);
  assert.match(migration, /profile\.tier in \('free', 'preview', 'beginner', 'full'\)/i);
  assert.doesNotMatch(migration, /requested_tier/i);
});

test("the MCP server passes only server-derived authorization context to knowledge search", async () => {
  const auth = await readFile("lib/mcp/auth.ts", "utf8");
  const server = await readFile("lib/mcp/server.ts", "utf8");
  assert.match(auth, /tokenHash: string/);
  assert.match(auth, /scope: "mcp"/);
  assert.match(auth, /if \(!\/\^\[A-Za-z0-9_-\]\{43\}\$\/\.test\(token\)\) return null/);
  assert.match(auth, /tokenRow\.scope !== "mcp"/);
  assert.match(auth, /Number\.isFinite\(expiresAtMs\)/);
  assert.match(auth, /const tokenHash = hashToken\(token\)/);
  assert.match(auth, /clientId: tokenRow\.client_id,[\s\S]*tokenHash,/);
  assert.match(server, /p_token_hash: auth\.tokenHash/);
  assert.match(server, /p_expected_resource: getMcpResourceUrl\(\)/);
  assert.doesNotMatch(server, /requested_tier: auth\.tier/);
});
