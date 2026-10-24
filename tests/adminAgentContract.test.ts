import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("le registre admin expose les quatorze outils autorisés", async () => {
  const source = await readFile("lib/adminAgent/tools.ts", "utf8");
  for (const name of [
    "liste_blocs", "lister_videos", "envoyer_video", "lire_transcription",
    "ecrire_chapitres", "ecrire_resume", "choisir_miniature", "deposer_miniature",
    "demander_publication", "synchroniser_video", "deposer_sous_titres",
    "preparer_mail", "statut_video", "journal",
  ]) {
    assert.match(source, new RegExp(`^  ${name}: \\{`, "m"));
  }
  assert.doesNotMatch(source, /changer_palier|supprimer_compte|approuver_demande/);
});

test("la transcription agent reste paginée, avertie et accessible avant publication", async () => {
  const source = await readFile("lib/adminAgent/tools.ts", "utf8");
  const section = source.slice(source.indexOf("  lire_transcription:"), source.indexOf("  deposer_sous_titres:"));
  assert.doesNotMatch(section, /published_at\) throw/);
  assert.match(section, /avertissement:/);
  assert.match(section, /delimiteurDebut:/);
  assert.match(section, /delimiteurFin:/);
  assert.match(section, /offset/);
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
test("publication vidéo refuse les remplacements et conserve le nettoyage durable", async () => {
  const sql = await readFile("supabase/migrations/20261024110000_block_video_lessons.sql", "utf8");
  assert.match(sql, /v_video\.replaced_at is not null/);
  assert.match(sql, /video_asset_cleanup/);
  assert.match(sql, /pg_advisory_xact_lock/);
  assert.match(sql, /created_by_agent_token_id/);
});

test("le mode autonome exige le même jeton que celui de l'envoi", async () => {
  const source = await readFile("lib/adminAgent/tools.ts", "utf8");
  const publication = source.slice(source.indexOf("  demander_publication:"), source.indexOf("  preparer_mail:"));
  assert.match(publication, /created_by_agent_token_id === context\.id/);
  assert.match(publication, /return createRequest\(context, "publication", input\.videoId, \{\s*videoId: input\.videoId,\s*\}\)/);
  assert.doesNotMatch(publication, /reason:/);
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
