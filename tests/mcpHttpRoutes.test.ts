import assert from "node:assert/strict";
import test from "node:test";
import {
  GET as getMcp,
  DELETE as deleteMcp,
  OPTIONS as optionsMcp,
  POST as postMcp,
  mcpBodyFailure,
  readBoundedMcpRequest,
  runWithMcpRouteDeadline,
} from "../app/api/mcp/route";
import { GET as getAuthorizationMetadata } from "../app/.well-known/oauth-authorization-server/route";
import { GET as getResourceMetadata } from "../app/.well-known/oauth-protected-resource/route";
import { POST as registerClient } from "../app/api/mcp/oauth/register/route";
import { POST as issueToken } from "../app/api/mcp/oauth/token/route";

process.env.MCP_OAUTH_ISSUER ??= "https://buildbyorsayn.com";

const allowedOrigin = "https://claude.ai";
const deniedOrigin = "https://attacker.example";

for (const [name, handler] of [
  ["authorization metadata", getAuthorizationMetadata],
  ["protected resource metadata", getResourceMetadata],
] as const) {
  test(`${name} reflects only an allowlisted CORS origin`, async () => {
    const allowed = await handler(new Request("https://buildbyorsayn.com/.well-known/test", {
      headers: { Origin: allowedOrigin },
    }));
    assert.equal(allowed.headers.get("access-control-allow-origin"), allowedOrigin);
    assert.equal(allowed.headers.get("vary"), "Origin");

    const denied = await handler(new Request("https://buildbyorsayn.com/.well-known/test", {
      headers: { Origin: deniedOrigin },
    }));
    assert.equal(denied.headers.get("access-control-allow-origin"), null);
  });
}

test("unsupported MCP methods advertise POST and OPTIONS", async () => {
  const request = new Request("https://buildbyorsayn.com/api/mcp", {
    headers: { Origin: allowedOrigin },
  });
  for (const response of [await getMcp(request), await deleteMcp(request)]) {
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "POST, OPTIONS");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  }
});

test("MCP preflight never reflects a denied origin", async () => {
  const response = await optionsMcp(new Request("https://buildbyorsayn.com/api/mcp", {
    method: "OPTIONS",
    headers: { Origin: deniedOrigin },
  }));
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
  assert.equal(response.headers.get("vary"), "Origin");
});

test("MCP POST rejects a present disallowed Origin before infrastructure work", async () => {
  const response = await postMcp(new Request("https://buildbyorsayn.com/api/mcp", {
    method: "POST",
    headers: { Origin: deniedOrigin, "Content-Type": "application/json" },
    body: "{}",
  }));
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("vary"), "Origin");
});

test("MCP POST emits a safe correlated outcome without logging credentials", async () => {
  const lines: string[] = [];
  const originalLog = console.log;
  console.log = (line?: unknown) => lines.push(String(line));
  try {
    const response = await postMcp(new Request("https://buildbyorsayn.com/api/mcp?code=private", {
      method: "POST",
      headers: {
        Origin: deniedOrigin,
        "Content-Type": "application/json",
        Authorization: "Bearer private-access-token",
        "X-Request-Id": "test-request-123",
      },
      body: JSON.stringify({ query: "private prompt" }),
    }));
    assert.equal(response.status, 403);
    assert.equal(response.headers.get("x-request-id"), "test-request-123");
  } finally {
    console.log = originalLog;
  }
  assert.equal(lines.length, 1);
  assert.deepEqual(JSON.parse(lines[0]), {
    ...JSON.parse(lines[0]),
    event: "mcp.request",
    requestId: "test-request-123",
    outcome: "denied",
    status: 403,
  });
  assert.doesNotMatch(lines[0], /private|authorization|bearer|token|query|prompt|code/i);
});

test("DCR requires JSON and rejects a present disallowed Origin", async () => {
  const textResponse = await registerClient(new Request("https://buildbyorsayn.com/api/mcp/oauth/register", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: "{}",
  }));
  assert.equal(textResponse.status, 415);

  const hostileResponse = await registerClient(new Request("https://buildbyorsayn.com/api/mcp/oauth/register", {
    method: "POST",
    headers: { Origin: deniedOrigin, "Content-Type": "application/json" },
    body: "{}",
  }));
  assert.equal(hostileResponse.status, 403);
  assert.equal(hostileResponse.headers.get("vary"), "Origin");
});

test("token endpoint rejects hostile origins and oversized chunked forms", async () => {
  const hostileResponse = await issueToken(new Request("https://buildbyorsayn.com/api/mcp/oauth/token", {
    method: "POST",
    headers: { Origin: deniedOrigin, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=refresh_token",
  }));
  assert.equal(hostileResponse.status, 403);
  assert.equal(hostileResponse.headers.get("vary"), "Origin");

  const oversizedResponse = await issueToken(new Request("https://buildbyorsayn.com/api/mcp/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `x=${"a".repeat(40_000)}`,
  }));
  assert.equal(oversizedResponse.status, 413);
});

test("MCP rejects unsupported media types before infrastructure work", async () => {
  const response = await postMcp(new Request("https://buildbyorsayn.com/api/mcp", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: "not-json",
  }));
  assert.equal(response.status, 415);
  assert.deepEqual(await response.json(), { error: "unsupported_media_type" });
});

test("MCP rejects a declared body above 64 KiB before infrastructure work", async () => {
  const response = await postMcp(new Request("https://buildbyorsayn.com/api/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": String(65_537),
    },
    body: "{}",
  }));
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { error: "payload_too_large" });
});

test("MCP bounds chunked bodies by bytes when content-length is absent", async () => {
  const oversized = new Request("https://buildbyorsayn.com/api/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: "é".repeat(40_000) }),
  });
  assert.deepEqual(await readBoundedMcpRequest(oversized), {
    ok: false,
    reason: "too_large",
  });
});

test("MCP body failures preserve their cause and map to distinct responses", async () => {
  const invalidUtf8 = new Request("https://buildbyorsayn.com/api/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: new Uint8Array([0xff]),
  });
  assert.deepEqual(await readBoundedMcpRequest(invalidUtf8), {
    ok: false,
    reason: "invalid_utf8",
  });
  assert.deepEqual(mcpBodyFailure("too_large"), { status: 413, error: "payload_too_large" });
  assert.deepEqual(mcpBodyFailure("invalid_utf8"), { status: 400, error: "invalid_body" });
  assert.deepEqual(mcpBodyFailure("invalid_length"), { status: 400, error: "invalid_content_length" });
  assert.deepEqual(mcpBodyFailure("timeout"), { status: 408, error: "request_timeout" });
});

test("MCP route deadline returns before a stalled operation and aborts its signal", async () => {
  const controller = new AbortController();
  const result = await runWithMcpRouteDeadline(
    new Promise<string>(() => undefined),
    10,
    controller,
    () => "timed-out"
  );
  assert.equal(result, "timed-out");
  assert.equal(controller.signal.aborted, true);
});

test("OAuth register and token endpoints answer browser preflights with the exact allowlisted origin", async () => {
  const register = await import("../app/api/mcp/oauth/register/route");
  const token = await import("../app/api/mcp/oauth/token/route");

  for (const route of [register, token]) {
    assert.equal(typeof route.OPTIONS, "function");
    const allowed = await route.OPTIONS(new Request("https://build.example/api", {
      method: "OPTIONS",
      headers: { Origin: "https://claude.ai" },
    }));
    assert.equal(allowed.status, 204);
    assert.equal(allowed.headers.get("access-control-allow-origin"), "https://claude.ai");
    assert.equal(allowed.headers.get("vary"), "Origin");

    const denied = await route.OPTIONS(new Request("https://build.example/api", {
      method: "OPTIONS",
      headers: { Origin: "https://attacker.example" },
    }));
    assert.equal(denied.status, 403);
    assert.equal(denied.headers.get("access-control-allow-origin"), null);
    assert.equal(denied.headers.get("vary"), "Origin");
  }
});

test("OAuth browser POST errors retain CORS headers without reaching database work", async () => {
  const register = await import("../app/api/mcp/oauth/register/route");
  const token = await import("../app/api/mcp/oauth/token/route");

  for (const route of [register, token]) {
    const response = await route.POST(new Request("https://build.example/api", {
      method: "POST",
      headers: {
        Origin: "https://chatgpt.com",
        "Content-Type": "text/plain",
      },
      body: "invalid",
    }));
    assert.equal(response.status, 415);
    assert.equal(response.headers.get("access-control-allow-origin"), "https://chatgpt.com");
  }
});
