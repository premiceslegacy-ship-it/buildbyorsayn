import assert from "node:assert/strict";
import test from "node:test";
import { resolveMcpIssuer } from "../lib/mcp/config";

test("MCP issuer is explicit, HTTPS or loopback, and path-free", () => {
  assert.throws(() => resolveMcpIssuer(undefined, undefined));
  assert.equal(resolveMcpIssuer("https://build.example", undefined), "https://build.example");
  assert.equal(resolveMcpIssuer("http://127.0.0.1:3100", undefined), "http://127.0.0.1:3100");
  assert.throws(() => resolveMcpIssuer("http://build.example", undefined));
  assert.throws(() => resolveMcpIssuer("https://build.example/path", undefined));
});

test("MCP preview issuer follows the exact Vercel deployment without changing production", () => {
  assert.equal(
    resolveMcpIssuer(undefined, "https://build.example", "preview", "build-preview-abc.vercel.app"),
    "https://build-preview-abc.vercel.app"
  );
  assert.equal(
    resolveMcpIssuer(undefined, "https://build.example", "production", "build-production-hash.vercel.app"),
    "https://build.example"
  );
  assert.equal(
    resolveMcpIssuer("https://explicit.example", "https://build.example", "preview", "build-preview-abc.vercel.app"),
    "https://explicit.example"
  );
  assert.throws(() => resolveMcpIssuer(undefined, "https://build.example", "preview", "https://bad.example/path"));
});
