import assert from "node:assert/strict";
import test from "node:test";

import { resolveMcpClientPresentation } from "../lib/mcp/clientPresentation";

test("recognizes Claude only from its exact OAuth callback", () => {
  assert.deepEqual(
    resolveMcpClientPresentation("Claude", "https://claude.ai/api/mcp/auth_callback"),
    {
      displayName: "Claude",
      destinationLabel: "claude.ai",
      logoSrc: "/da/logos/claude.svg",
      verified: true,
    },
  );
});

test("recognizes ChatGPT from its documented stable and per-connection callbacks", () => {
  const expected = {
    displayName: "ChatGPT",
    destinationLabel: "chatgpt.com",
    logoSrc: "/da/logos/openai.svg",
    verified: true,
  };
  assert.deepEqual(
    resolveMcpClientPresentation("ChatGPT", "https://chatgpt.com/connector_platform_oauth_redirect"),
    expected,
  );
  assert.deepEqual(
    resolveMcpClientPresentation("Anything", "https://chatgpt.com/connector/oauth/a1B2_c3-D4"),
    expected,
  );
});

test("does not trust a claimed assistant name on another callback", () => {
  for (const [name, uri, host] of [
    ["Claude", "https://example.com/callback", "example.com"],
    ["ChatGPT", "https://chatgpt.com.evil.test/connector_platform_oauth_redirect", "chatgpt.com.evil.test"],
    ["ChatGPT", "http://chatgpt.com/connector_platform_oauth_redirect", "chatgpt.com"],
    ["ChatGPT", "https://chatgpt.com/connector_platform_oauth_redirect/extra", "chatgpt.com"],
    ["ChatGPT", "https://chatgpt.com/connector/oauth/abc/def", "chatgpt.com"],
    ["ChatGPT", "https://chatgpt.com/other/callback", "chatgpt.com"],
  ] as const) {
    assert.deepEqual(
      resolveMcpClientPresentation(name, uri),
      { displayName: name, destinationLabel: host, logoSrc: null, verified: false },
      uri,
    );
  }
});

test("fails closed when the callback cannot be parsed", () => {
  assert.deepEqual(
    resolveMcpClientPresentation("Assistant", "not-a-url"),
    {
      displayName: "Assistant",
      destinationLabel: "Adresse non reconnue",
      logoSrc: null,
      verified: false,
    },
  );
});
