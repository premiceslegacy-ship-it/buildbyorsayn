import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { AGENT_PERMISSION_VALUES } from "../lib/adminAgent/types";

const read = (path: string) => readFile(path, "utf8");

test("une publication, quel que soit son auteur, clôt les demandes de publication en attente", async () => {
  const [execution, route, admin] = await Promise.all([
    read("lib/adminAgent/execution.ts"),
    read("app/api/admin/videos/[id]/publish/route.ts"),
    read("lib/adminAgent/admin.ts"),
  ]);
  assert.match(execution, /export async function closePublicationRequests/);
  assert.match(execution, /\.eq\("kind", "publication"\)[\s\S]*\.eq\("status", "pending"\)/);
  const publication = execution.slice(execution.indexOf("export async function executeAgentPublication"));
  assert.match(publication, /closePublicationRequests\(videoId, actorUserId, signal\)/);
  assert.match(route, /closePublicationRequests\(id, user\.id, request\.signal\)/);
  assert.match(admin, /request\.videoPreview\.published \|\| request\.videoPreview\.replaced/);
  assert.match(admin, /isVideoPublished\(claimed\.request_target_id\)/);
});

test("valider une demande dont la vidéo est déjà en ligne ne tente pas de republier", async () => {
  const admin = await read("lib/adminAgent/admin.ts");
  const decide = admin.slice(admin.indexOf("export async function decideRequest"));
  assert.ok(decide.indexOf("isVideoPublished") < decide.indexOf("executeAgentPublication(claimed.request_target_id"));
});

test("publier_video est une permission explicite, hors du préréglage « Préparer »", async () => {
  const [tools, client, migration] = await Promise.all([
    read("lib/adminAgent/tools.ts"),
    read("components/admin/agent/AgentClient.tsx"),
    read("supabase/migrations/20261118100000_agent_publier_video.sql"),
  ]);
  assert.ok((AGENT_PERMISSION_VALUES as readonly string[]).includes("publier_video"));
  assert.match(tools, /^  publier_video: \{/m);
  const tool = tools.slice(tools.indexOf("  publier_video: {"), tools.indexOf("  preparer_mail: {"));
  assert.match(tool, /permission: "publier_video"/);
  assert.match(tool, /isVideoPublished/);
  assert.doesNotMatch(tool, /expectedTokenId|created_by_agent_token_id/);
  assert.match(client, /PREPARE_PERMISSIONS[^\n]*!== "publier_video"/);
  assert.match(migration, /'publier_video'/);
  assert.match(migration, /cardinality\(permissions\) <= 17/);
  assert.equal(AGENT_PERMISSION_VALUES.length, 17);
});

test("les boutons de la fiche vidéo battent la règle globale .da button", async () => {
  const css = await read("app/admin/videos.css");
  for (const selector of [".vd-primary", ".vd-secondary", ".vd-episode", ".vd-icon-button", ".vd-section-head"]) {
    const own = new RegExp(`^(\\.vd-root )?${selector.replace(".", "\\.")}(?![\\w-])`);
    const rules = css.split("\n").filter((line) => own.test(line));
    assert.ok(rules.length > 0, selector);
    assert.ok(rules.every((line) => line.startsWith(".vd-root ")), `${selector} doit être préfixé par .vd-root`);
  }
  assert.doesNotMatch(css, /\.vd-primary:hover[^}]*#fff\b/);
});

test("la fiche vidéo n'affiche plus deux fois les chapitres et suit les changements de l'agent", async () => {
  const video = await read("app/admin/AdminVideoManager.tsx");
  assert.doesNotMatch(video, /<ol>\{chaptersParsed\.chapters\.map/);
  assert.match(video, /addEventListener\("focus", refresh\)/);
  assert.match(video, /draft === before\.summary \? after\.summary : draft/);
});
