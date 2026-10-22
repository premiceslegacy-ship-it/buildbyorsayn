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

test("a verified Claude client shows both real logos, no warning and the authorize button", () => {
  const html = mcpCard("Claude", "https://claude.ai/api/mcp/auth_callback");
  assertCommonRules(html, "Claude");
  assert.match(html, /<img src="\/da\/logos\/claude\.svg" alt="Claude"/);
  assert.match(html, /Connecter Claude à BUILD/);
  assert.match(html, /Autoriser Claude/);
  assert.match(html, /Tu retourneras sur claude\.ai/);
  assert.doesNotMatch(html, /Application non confirmée/);
});

test("a verified ChatGPT client shows the OpenAI logo and no warning", () => {
  const html = mcpCard("Anything", "https://chatgpt.com/connector_platform_oauth_redirect");
  assertCommonRules(html, "ChatGPT");
  assert.match(html, /<img src="\/da\/logos\/openai\.svg" alt="ChatGPT"/);
  assert.match(html, /Connecter ChatGPT à BUILD/);
  assert.match(html, /Tu retourneras sur chatgpt\.com/);
  assert.doesNotMatch(html, /Application non confirmée/);
});

test("an unknown client gets a neutral tile with its first letter, the warning and its exact return address", () => {
  const html = mcpCard("zeta app", "https://zeta.example.test/callback?x=1&y=2");
  assertCommonRules(html, "client inconnu");
  assert.doesNotMatch(html, /\/da\/logos\//);
  assert.match(html, /mx-ico--client"><span aria-hidden="true">Z<\/span>/);
  assert.match(html, /Application non confirmée/);
  assert.match(html, /L’identité de cette application n’a pas pu être confirmée/);
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
  assert.match(html, /role="alert">La demande précédente a échoué\. Recommence depuis Claude\./);
  assert.match(html, /Autoriser Claude/);
  assert.match(html, /name="request" value="A{43}"/);
});

test("the tier label follows the access level and the demo tier explains what stays protected", () => {
  assert.match(mcpCard("Claude", "https://claude.ai/api/mcp/auth_callback", { tier: "beginner" }), /mx-tier">Fondations</);
  assert.match(mcpCard("Claude", "https://claude.ai/api/mcp/auth_callback", { tier: "full" }), /mx-tier">LE\u00a0?COFFRE</);
  const preview = mcpCard("Claude", "https://claude.ai/api/mcp/auth_callback", { tier: "preview" });
  assert.match(preview, /mx-tier">Démo gratuite</);
  assert.match(preview, /resteront protégés/);
  assert.doesNotMatch(mcpCard("Claude", "https://claude.ai/api/mcp/auth_callback", { tier: "full" }), /resteront protégés/);
});

test("the BUILD Sync card shows the logo, the steps, one primary button and the revoke command", () => {
  const html = syncCard();
  assertCommonRules(html, "BUILD Sync");
  assert.match(html, /Étape 2 sur 4, autorisation/);
  assert.match(html, /L’installation reprendra automatiquement dans ton terminal/);
  assert.match(html, /toutes les heures/);
  assert.match(html, /aria-current="step"/);
  assert.match(html, /<code>build-skills logout<\/code>/);
  assert.match(html, /<code>http:\/\/127\.0\.0\.1:49152\/callback<\/code>/);
  assert.doesNotMatch(html, /role="alert"/);
});

test("the BUILD Sync card announces an expired request", () => {
  const html = syncCard("La demande a expiré. Relance BUILD Sync.");
  assertCommonRules(html, "BUILD Sync erreur");
  assert.match(html, /role="alert">La demande a expiré\. Relance BUILD Sync\./);
});
