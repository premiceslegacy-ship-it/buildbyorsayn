import assert from "node:assert/strict";
import test from "node:test";
import { resolveMcpConnectionStatus } from "../lib/mcp/connectionStatus";

test("an active refresh token marks the user as connected", () => {
  assert.equal(
    resolveMcpConnectionStatus(
      { count: 1, error: null },
      { count: 0, error: null },
    ),
    "connected",
  );
});

test("an active access token is sufficient when no refresh token exists", () => {
  assert.equal(
    resolveMcpConnectionStatus(
      { count: 0, error: null },
      { count: 1, error: null },
    ),
    "connected",
  );
});

test("zero active credentials marks the user as disconnected", () => {
  assert.equal(
    resolveMcpConnectionStatus(
      { count: 0, error: null },
      { count: 0, error: null },
    ),
    "disconnected",
  );
});

test("a query failure never becomes a false disconnected state", () => {
  assert.equal(
    resolveMcpConnectionStatus(
      { count: 0, error: new Error("unavailable") },
      { count: 0, error: null },
    ),
    "unknown",
  );
});

test("a proven active credential remains connected if the other query fails", () => {
  assert.equal(
    resolveMcpConnectionStatus(
      { count: 1, error: null },
      { count: null, error: new Error("unavailable") },
    ),
    "connected",
  );
});
