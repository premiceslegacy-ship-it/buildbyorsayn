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

test("la migration de durcissement crée atomiquement les demandes et plafonne la file", async () => {
  const sql = await readFile("supabase/migrations/20261023180000_agent_hardening.sql", "utf8");
  assert.match(sql, /create or replace function public\.create_admin_agent_request/);
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /v_pending_for_token >= 20/);
  assert.match(sql, /v_pending_total >= 100/);
  assert.match(sql, /agent_video_missing/);
  assert.match(sql, /agent_video_published/);
  assert.match(sql, /agent_video_missing_transcript/);
  assert.match(sql, /agent_video_missing_summary/);
  assert.match(sql, /agent_video_missing_chapters/);
  assert.match(sql, /agent_video_missing_thumbnail/);
  assert.match(sql, /trim\(coalesce\(v_video\.transcript, ''\)\)/);
  assert.match(sql, /v_video\.status is distinct from 'ready'/);
  assert.match(sql, /account\.last_sign_in_at <= now\(\) - interval '90 days'/);
  assert.match(sql, /v_audience not in \('all', 'free', 'beginner', 'full'\)/);
  assert.match(sql, /on conflict \(idempotency_key\) do nothing/);
  assert.match(sql, /revoke all on function public\.create_admin_agent_request[\s\S]*from public, anon, authenticated/);
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

test("la surface agent ne peut ni approuver ni refuser une demande", async () => {
  const [registry, mcp] = await Promise.all([
    readFile("lib/adminAgent/tools.ts", "utf8"),
    readFile("lib/adminAgent/mcp.ts", "utf8"),
  ]);
  assert.doesNotMatch(registry, /^\s+(?:approuver|refuser|decideRequest):/m);
  assert.doesNotMatch(mcp, /decideRequest/);
});
