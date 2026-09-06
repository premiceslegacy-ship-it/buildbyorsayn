import assert from "node:assert/strict";
import test from "node:test";

import { resolveMcpClientPresentation } from "../lib/mcp/clientPresentation";

test("recognizes Claude only from its exact OAuth callback", () => {
  assert.deepEqual(
    resolveMcpClientPresentation("Claude", "https://claude.ai/api/mcp/auth_callback"),
    {
      displayName: "Claude",
      destinationLabel: "claude.ai",
      logoSrc: "/brand-logos/claude.svg",
      verified: true,
    },
  );
});

test("does not trust a claimed Claude name on another callback", () => {
  assert.deepEqual(
    resolveMcpClientPresentation("Claude", "https://example.com/callback"),
    {
      displayName: "Claude",
      destinationLabel: "example.com",
      logoSrc: null,
      verified: false,
    },
  );
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