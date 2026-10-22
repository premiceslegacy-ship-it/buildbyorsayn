import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { BuildSyncConsentCard } from "../components/da/BuildSyncConsentCard";
import { McpConsentCard } from "../components/da/McpConsentCard";
import { resolveMcpClientPresentation } from "../lib/mcp/clientPresentation";
import type { McpTier } from "../lib/mcpAccess";

const REQUEST = "A".repeat(43);
const noop = async () => {};
const CHARACTERS_TO_AVOID = /[\u2014\u2013\u2022\u00b7\u25e6\u25aa\u2023]/;
// Une carte dont une bordure ou une bande de couleur longe un seul côté.
const SIDE_BAND = /\b(?:border-[lr]\b|border-(?:l|r|s|e)-\d|border-(?:l|r|s|e)-\[|border-left|border-right|before:w-|after:w-1|mx-band|bande)/;

function mcpCard(
  clientName: string,
  redirectUri: string,
  options: { tier?: McpTier; errorMessage?: string | null } = {},
) {
  return renderToStaticMarkup(createElement(McpConsentCard, {
    presentation: resolveMcpClientPresentation(clientName, redirectUri),
    tier: options.tier ?? "full",
    redirectUri,
    requestHandle: REQUEST,
    errorMessage: options.errorMessage ?? null,
    approveAction: noop,
    denyAction: noop,
  }));
}

function syncCard(errorMessage: string | null = null) {
  return renderToStaticMarkup(createElement(BuildSyncConsentCard, {
    redirectUri: "http://127.0.0.1:49152/callback",
    requestHandle: REQUEST,
    errorMessage,
    approveAction: noop,
    denyAction: noop,
  }));
}

function assertCommonRules(html: string, label: string) {
  assert.match(html, /<img src="\/da\/symbole-sombre\.svg" alt="BUILD"/, `${label}: logo BUILD`);
  assert.equal((html.match(/btn--p/g) ?? []).length, 1, `${label}: un seul bouton principal`);
  assert.doesNotMatch(html, CHARACTERS_TO_AVOID, `${label}: tiret long ou puce`);
  assert.doesNotMatch(html, /<li[^>]*>\s*[*-]\s/, `${label}: puce écrite dans une ligne de liste`);
  assert.doesNotMatch(html, SIDE_BAND, `${label}: bande latérale`);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${label}: un seul titre`);
}

test("a verified Claude client shows both real logos, no warning and one primary action", () => {
  const html = mcpCard("Claude", "https://claude.ai/api/mcp/auth_callback");
  assertCommonRules(html, "Claude");
  assert.match(html, /<img src="\/da\/logos\/claude\.svg" alt="Claude"/);
  assert.doesNotMatch(html, /role="note"/);
});

test("a verified ChatGPT client shows the OpenAI logo and no warning", () => {
  const html = mcpCard("Anything", "https://chatgpt.com/connector_platform_oauth_redirect");
  assertCommonRules(html, "ChatGPT");
  assert.match(html, /<img src="\/da\/logos\/openai\.svg" alt="ChatGPT"/);
  assert.doesNotMatch(html, /role="note"/);
});

test("recognized local clients show their logo and a non-verified note", () => {
  for (const [name, uri, logo] of [
    ["Hermes Agent", "http://127.0.0.1:49231/callback", "hermes"],
    ["oh-my-pi", "http://localhost:3000/callback", "omp"],
    ["Cursor", "cursor://anysphere.cursor-mcp/oauth/callback", "cursor"],
  ] as const) {
    const html = mcpCard(name, uri);
    assertCommonRules(html, name);
    assert.match(html, new RegExp(`<img src="/da/logos/${logo}\\.svg"`));
    assert.match(html, /role="note"/);
    assert.doesNotMatch(html, /mx-ico--client"><span/);
  }
});

test("an unknown client gets a neutral tile with its first letter, the warning and its exact return address", () => {
  const html = mcpCard("zeta app", "https://zeta.example.test/callback?x=1&y=2");
  assertCommonRules(html, "client inconnu");
  assert.doesNotMatch(html, /\/da\/logos\//);
  assert.match(html, /mx-ico--client"><span aria-hidden="true">Z<\/span>/);
  assert.match(html, /role="note"/);
  assert.match(html, /<code>https:\/\/zeta\.example\.test\/callback\?x=1&amp;y=2<\/code>/);
});

test("a hostile client name is escaped", () => {
  const html = mcpCard(`<script>alert(1)</script>`, "https://zeta.example.test/callback");
  assert.doesNotMatch(html, /<script>alert/); // React ajoute seulement son propre script de formulaires
  assert.match(html, /&lt;script&gt;/);
});

test("an error message is announced as an alert and the buttons stay usable", () => {
  const html = mcpCard("Claude", "https://claude.ai/api/mcp/auth_callback", {
    errorMessage: "La demande précédente a échoué. Recommence depuis Claude.",
  });
  assertCommonRules(html, "erreur");
  assert.match(html, /role="alert"/);
  assert.match(html, /name="request" value="A{43}"/);
});

test("each access level renders a tier and only the preview includes a limitation note", () => {
  assert.match(mcpCard("Claude", "https://claude.ai/api/mcp/auth_callback", { tier: "beginner" }), /class="mx-tier"/);
  assert.match(mcpCard("Claude", "https://claude.ai/api/mcp/auth_callback", { tier: "full" }), /class="mx-tier"/);
  const preview = mcpCard("Claude", "https://claude.ai/api/mcp/auth_callback", { tier: "preview" });
  assert.match(preview, /<small>/);
  assert.doesNotMatch(mcpCard("Claude", "https://claude.ai/api/mcp/auth_callback", { tier: "full" }), /<small>/);
});

test("the BUILD Sync card shows the logo, four steps and one primary button", () => {
  const html = syncCard();
  assertCommonRules(html, "BUILD Sync");
  assert.equal((html.match(/<li(?:\s|>)/g) ?? []).length, 8);
  assert.match(html, /aria-current="step"/);
  assert.match(html, /<code>http:\/\/127\.0\.0\.1:49152\/callback<\/code>/);
  assert.doesNotMatch(html, /role="alert"/);
});

test("the BUILD Sync card announces an expired request", () => {
  const html = syncCard("La demande a expiré. Relance BUILD Sync.");
  assertCommonRules(html, "BUILD Sync erreur");
  assert.match(html, /role="alert"/);
});
