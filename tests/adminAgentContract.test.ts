import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("le registre admin expose exactement les neuf outils prévus", async () => {
  const source = await readFile("lib/adminAgent/tools.ts", "utf8");
  for (const name of [
    "liste_blocs", "envoyer_video", "ecrire_chapitres", "ecrire_resume",
    "choisir_miniature", "demander_publication", "preparer_mail", "statut_video", "journal",
  ]) {
    assert.match(source, new RegExp(`^  ${name}: \\{`, "m"));
  }
  assert.doesNotMatch(source, /changer_palier|supprimer_compte|approuver_demande/);
});

test("la migration garde les jetons hachés, les demandes bornées et les rôles fermés", async () => {
  const sql = await readFile("supabase/migrations/20261023160000_admin_agent.sql", "utf8");
  assert.match(sql, /token_hash text not null unique/);
  assert.doesNotMatch(sql, /token_plain|plain_token|bearer_token/);
  assert.match(sql, /interval '90 days'/);
  assert.match(sql, /interval '7 days'/);
  assert.match(sql, /permissions <@ array/);
  assert.match(sql, /video_lessons_agent_publish_ready_check/);
  assert.match(sql, /force row level security/g);
  assert.match(sql, /revoke all on table public\.admin_agent_tokens from anon, authenticated/);
  assert.match(sql, /for update/);
});

test("les deux adaptateurs utilisent le même registre sans registre secondaire", async () => {
  const [http, mcp] = await Promise.all([
    readFile("app/api/agent/tools/route.ts", "utf8"),
    readFile("lib/adminAgent/mcp.ts", "utf8"),
  ]);
  assert.match(http, /invokeAdminAgentTool/);
  assert.match(mcp, /ADMIN_AGENT_TOOLS/);
  assert.match(mcp, /invokeAdminAgentTool/);
});
