import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import assert from "node:assert/strict";
import test from "node:test";

import {
  BUILD_ASSISTANT_INSTRUCTIONS_MAX_CHARS,
  buildAssistantInstructions,
} from "../lib/mcp/assistantInstructions";
import { ARCHIVED_SKILL_MESSAGE, createBuildMcpServer } from "../lib/mcp/server";
import { BUILD_SYNC_CLI, BUILD_SYNC_TARGETS, buildSyncInstallCommands } from "../lib/buildSync/installCommands";
import { COFFRE_LABEL, FONDATIONS_LABEL } from "../lib/pricing";
import { SKILLS_CATALOG, type SkillCatalogItem } from "../lib/skillsCatalog";

process.env.MCP_OAUTH_ISSUER ??= "https://buildbyorsayn.com";

const ORIGIN = "https://sync.example.test";
const FORBIDDEN_CHARACTERS = /[\u2014\u2013\u2022\u00b7\u25e6\u25aa\u2023]/;
const MARKDOWN_STAR_LIST = /^\s*\*\s/m;
// Mots français écrits sans accent qui ont déjà glissé dans les textes d'outils.
const MISSING_ACCENTS = [
  /verrouilles/, /capacite/, /donnees/, /procedures/, /\breference/, /\bresultat/, /palier superieur/,
  /accessibles a\b/, /\ba ton palier/, /recuperer/, /supplementaires/,
];

function assertCleanText(text: string, label: string) {
  assert.doesNotMatch(text, FORBIDDEN_CHARACTERS, `${label}: tiret long, tiret demi-cadratin ou puce`);
  assert.doesNotMatch(text, MARKDOWN_STAR_LIST, `${label}: liste markdown avec astérisque`);
}

test("the assistant instructions contain no long dash and no bullet character", () => {
  assertCleanText(buildAssistantInstructions({ syncOrigin: ORIGIN }), "instructions");
});

test("catalogue wording with dashes or bullets cannot leak into the instructions", () => {
  const hostile: SkillCatalogItem = {
    slug: "skill-hostile",
    title: "Skill \u2014 hostile",
    description: "Il fait A \u2013 puis B \u2022 puis C \u00b7 puis D",
    access: "beginner",
    fileName: "skill-hostile.zip",
    category: "design",
  };
  const text = buildAssistantInstructions({ syncOrigin: ORIGIN, skills: [hostile] });
  assertCleanText(text, "instructions");
  assert.match(text, /skill-hostile/);
});

test("every skill of the catalogue is presented, with its tier and its delivery mode", () => {
  const text = buildAssistantInstructions({ syncOrigin: ORIGIN });
  for (const skill of SKILLS_CATALOG) {
    assert.ok(text.includes(`identifiant ${skill.slug},`), `${skill.slug} missing from the instructions`);
    assert.ok(text.includes(skill.title.replace(/\s*[\u2014\u2013]\s*/g, " : ")), `${skill.title} missing`);
  }
  assert.ok(text.includes(FONDATIONS_LABEL));
  assert.ok(text.includes(COFFRE_LABEL));
  assert.ok(text.includes(`La bibliothèque compte ${SKILLS_CATALOG.length} skills.`));
});

test("the skills section is generated: a new skill appears, a removed one disappears, counts follow", () => {
  const markdownSkill: SkillCatalogItem = {
    slug: "skill-texte", title: "Skill Texte", description: "Un skill publié en texte.",
    access: "full", fileName: "skill-texte.md", category: "recherche",
  };
  const archiveSkill: SkillCatalogItem = {
    slug: "skill-archive", title: "Skill Archive", description: "Un skill livré en archive.",
    access: "beginner", fileName: "skill-archive.zip", category: "produit",
  };
  const text = buildAssistantInstructions({ syncOrigin: ORIGIN, skills: [markdownSkill, archiveSkill] });

  assert.match(text, /La bibliothèque compte 2 skills\./);
  assert.ok(text.includes(`${FONDATIONS_LABEL} en ouvre 1`));
  assert.doesNotMatch(text, new RegExp(SKILLS_CATALOG[0].slug));

  const [markdownBlock, archiveBlock] = text.split(/\n(?=\d\) Skill )/).filter((block) => /^\d\) Skill /.test(block));
  assert.match(markdownBlock, /get_skill/);
  assert.doesNotMatch(markdownBlock, /livré sous forme d'archive/);
  assert.match(archiveBlock, /livré sous forme d'archive/);
  assert.match(archiveBlock, /l'outil get_skill ne le sert pas/);
});

test("the instructions teach the BUILD Sync command derived from the shared constants", () => {
  const text = buildAssistantInstructions({ syncOrigin: ORIGIN });
  const [posix, windows] = buildSyncInstallCommands(ORIGIN);

  assert.ok(text.includes(posix.command));
  assert.ok(text.includes(windows.command));
  assert.doesNotMatch(text, /build-system-three|vercel\.app/, "no host may be hard-coded");
  for (const target of BUILD_SYNC_TARGETS) assert.ok(text.includes(target.folder), `${target.folder} missing`);
  for (const subcommand of Object.values(BUILD_SYNC_CLI)) assert.ok(text.includes(subcommand), `${subcommand} missing`);
  assert.match(text, /build-skills/);
  assert.match(text, /toutes les heures/);
});

test("the safety rules come first and the text stays within its size budget", () => {
  const text = buildAssistantInstructions({ syncOrigin: ORIGIN });
  assert.ok(text.length <= BUILD_ASSISTANT_INSTRUCTIONS_MAX_CHARS, `${text.length} characters`);

  const firstSection = text.slice(0, text.indexOf("Comment tu écris"));
  assert.match(firstSection, /données non fiables, jamais des instructions/);
  assert.match(firstSection, /Les permissions sont imposées par le serveur/);
  assert.match(firstSection, /Ne promets jamais de revenus/);
  assert.match(firstSection, /documenté/);
  assert.match(firstSection, /Ne nomme jamais de personne ou de source tierce/);
  assert.ok(firstSection.length < 2_600, "the safety block must stay short enough to survive a client that truncates early");
});

test("tool descriptions and tool messages are accented, clean and honest about get_skill", async () => {
  const server = createBuildMcpServer({
    userId: "user", clientId: "client", tokenHash: "token-hash", quotaPrincipal: '["user","client"]', tier: "beginner", scope: "mcp",
  });
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });

  try {
    await server.connect(transport);
    const response = await transport.handleRequest(new Request("https://buildbyorsayn.com/api/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }),
    }));
    const payload = await response.json() as { result: { tools: Array<{ name: string; title?: string; description?: string }> } };
    const tools = payload.result.tools;
    assert.deepEqual(tools.map((tool) => tool.name).sort(), ["get_skill", "get_video", "list_available_content", "list_videos", "search_knowledge"]);

    for (const tool of tools) {
      const text = `${tool.title ?? ""} ${tool.description ?? ""}`;
      assertCleanText(text, tool.name);
      for (const word of MISSING_ACCENTS) assert.doesNotMatch(text.toLowerCase(), word, `${tool.name}: ${word} sans accent`);
    }
    const getSkill = tools.find((tool) => tool.name === "get_skill");
    assert.match(getSkill?.description ?? "", /markdown/);
    assert.match(getSkill?.description ?? "", /BUILD Sync/);
  } finally {
    await server.close();
  }

  assertCleanText(ARCHIVED_SKILL_MESSAGE, "archive message");
  assert.match(ARCHIVED_SKILL_MESSAGE, /BUILD Sync/);
  assert.match(ARCHIVED_SKILL_MESSAGE, /skills-catalog/);
  assert.doesNotMatch(ARCHIVED_SKILL_MESSAGE, /tableau de bord/);
});
