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
      trust: "verified",
      verified: true,
    },
  );
});

test("recognizes ChatGPT from its documented stable and per-connection callbacks", () => {
  const expected = {
    displayName: "ChatGPT",
    destinationLabel: "chatgpt.com",
    logoSrc: "/da/logos/openai.svg",
    trust: "verified",
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
      { displayName: name, destinationLabel: host, logoSrc: null, trust: "unrecognized", verified: false },
      uri,
    );
  }
});

test("recognizes Hermes Agent only with its declared name and documented loopback callback", () => {
  assert.deepEqual(
    resolveMcpClientPresentation("Hermes Agent", "http://127.0.0.1:49231/callback"),
    {
      displayName: "Hermes Agent",
      destinationLabel: "ton ordinateur",
      logoSrc: "/da/logos/hermes.svg",
      trust: "local",
      verified: false,
    },
  );
  assert.equal(
    resolveMcpClientPresentation("Claude", "http://127.0.0.1:49231/callback").trust,
    "unrecognized",
  );
});

test("recognizes Oh My Pi only with its DCR name and documented loopback callback", () => {
  assert.deepEqual(
    resolveMcpClientPresentation("oh-my-pi", "http://localhost:3000/callback"),
    {
      displayName: "Oh My Pi",
      destinationLabel: "ton ordinateur",
      logoSrc: "/da/logos/omp.svg",
      trust: "local",
      verified: false,
    },
  );
  assert.equal(
    resolveMcpClientPresentation("Oh My Pi", "https://example.com/callback").trust,
    "unrecognized",
  );
});

test("recognizes Cursor callbacks without granting the verified status", () => {
  for (const [uri, trust] of [
    ["cursor://anysphere.cursor-mcp/oauth/callback", "local"],
    ["http://localhost:8787/callback", "local"],
    ["https://www.cursor.com/agents/mcp/oauth/callback", "documented"],
  ] as const) {
    const presentation = resolveMcpClientPresentation("Cursor", uri);
    assert.equal(presentation.displayName, "Cursor");
    assert.equal(presentation.logoSrc, "/da/logos/cursor.svg");
    assert.equal(presentation.trust, trust);
    assert.equal(presentation.verified, false);
  }
});

test("does not recognize spoofed local names, modified Cursor schemes or credentialed callbacks", () => {
  for (const [name, uri] of [
    ["Hermes Agent", "http://127.0.0.1:49231/not-callback"],
    ["Hermes", "http://127.0.0.1:49231/callback"],
    ["oh-my-pi", "http://example.com:3000/callback"],
    ["Cursor", "cursor://anysphere.cursor-mcp/oauth/callback/extra"],
    ["Cursor", "cursor://anysphere.cursor-retrieval/oauth/callback"],
    ["Cursor", "http://user@localhost:8787/callback"],
  ] as const) {
    const presentation = resolveMcpClientPresentation(name, uri);
    assert.equal(presentation.trust, "unrecognized", `${name}: ${uri}`);
    assert.equal(presentation.logoSrc, null, `${name}: ${uri}`);
    assert.equal(presentation.verified, false, `${name}: ${uri}`);
  }
});

test("fails closed when the callback cannot be parsed", () => {
  assert.deepEqual(
    resolveMcpClientPresentation("Assistant", "not-a-url"),
    {
      displayName: "Assistant",
      destinationLabel: "Adresse non reconnue",
      logoSrc: null,
      trust: "unrecognized",
      verified: false,
    },
  );
});

test("live spoof matrix: look-alike hosts, IDN, ports and wrong loopback shapes never get a logo or trust", () => {
  for (const [name, uri] of [
    ["Claude", "http://127.0.0.1:5000/callback"],
    ["Claude", "https://claude.ai.evil.com/api/mcp/auth_callback"],
    ["Claude", "https://evil.claude.ai/api/mcp/auth_callback"],
    ["Claude", "https://clаude.ai/api/mcp/auth_callback"],
    ["Claude", "https://xn--clude-xxa.ai/api/mcp/auth_callback"],
    ["Claude", "https://claude.ai:8443/api/mcp/auth_callback"],
    ["Claude", "https://claude.ai/api/mcp/auth_callback/"],
    ["Claude", "https://claude.ai./api/mcp/auth_callback"],
    ["Claude", "cursor://anysphere.cursor-mcp/oauth/callback"],
    ["ChatGPT", "https://CHATGPT.com/connector_platform_oauth_redirect"],
    ["ChatGPT", "https://chatgpt.com/connector_platform_oauth_redirect?x=1"],
    ["Hermes Agent", "https://evil.example/callback"],
    ["Hermes Agent", "http://127.0.0.1/callback"],
    ["Hermes Agent", "http://[::1]:5000/callback"],
    ["Hermes Agent", "http://127.0.0.1:5000/callback?x=1"],
    ["hermes agent", "http://127.0.0.1:5000/callback"],
    ["Oh My Pi", "http://127.0.0.1:5000/callback"],
    ["Cursor", "https://evil.example/cb"],
    ["Cursor", "http://localhost:9999/callback"],
  ] as const) {
    const result = resolveMcpClientPresentation(name, uri);
    assert.equal(result.logoSrc, null, `${name} ${uri}`);
    assert.equal(result.verified, false, `${name} ${uri}`);
    assert.equal(result.trust, "unrecognized", `${name} ${uri}`);
  }
});
