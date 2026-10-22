/**
 * Preuve locale (Docker, PostgreSQL jetable) : une vidéo publiée avec transcription devient des
 * extraits MCP, retrouvés par match_mcp_knowledge_chunks pour le bon palier seulement.
 * Chemin réel : publish_video_lesson -> collectVideoTranscriptDocuments -> chunkText -> hash ->
 * buildIngestionPlan -> apply_mcp_knowledge_snapshot -> match_mcp_knowledge_chunks.
 * Seul l'embedding est remplacé par une fonction déterministe (aucun appel réseau).
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { chunkText, computeContentHash } from "../lib/knowledge/chunk";
import { collectVideoTranscriptDocuments, type PublishedVideoTranscriptRow } from "../lib/knowledge/sources";
import { buildIngestionPlan, type PreparedKnowledgeChunk } from "../lib/knowledge/ingestionPlan";
import { EMBEDDING_DIMENSIONS, embeddingFingerprint, normalizeAndValidateEmbedding } from "../lib/knowledge/embeddings";

const container = process.env.MCP_PG_CONTAINER ?? "build-mcp-pgtest";
const database = `video_mcp_${process.pid}_${Date.now()}`;
const root = process.cwd();

function docker(args: string[], input?: string): string {
  const result = spawnSync("docker", args, { cwd: root, encoding: "utf8", input });
  if (result.status !== 0) throw new Error(`docker failed: ${result.stderr || result.stdout}`);
  return result.stdout.trim();
}
const psql = (extra: string[], input?: string) =>
  docker(["exec", "-i", container, "psql", "-X", "-qAt", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", database, ...extra], input);
const sql = (statement: string) => psql(["-c", statement]);
const applyFile = (path: string) => { psql([], readFileSync(resolve(root, path), "utf8")); };

function fakeEmbedding(text: string): number[] {
  const vector = new Array<number>(EMBEDDING_DIMENSIONS).fill(0);
  for (const word of text.toLowerCase().normalize("NFD").replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((w) => w.length > 3)) {
    const digest = createHash("sha256").update(word).digest();
    vector[digest.readUInt16BE(0) % EMBEDDING_DIMENSIONS] += 1;
    vector[digest.readUInt16BE(2) % EMBEDDING_DIMENSIONS] += 0.5;
  }
  if (!vector.some((value) => value !== 0)) vector[0] = 1;
  return normalizeAndValidateEmbedding(vector);
}
const vectorLiteral = (values: number[]) => `[${values.join(",")}]`;
const fingerprint = embeddingFingerprint({ provider: "openrouter", model: "fake-deterministic", dimensions: EMBEDDING_DIMENSIONS, normalization: "l2-v1" } as never);

docker(["exec", container, "createdb", "-U", "postgres", database]);
process.on("exit", () => { spawnSync("docker", ["exec", container, "dropdb", "-U", "postgres", "--if-exists", database], { stdio: "ignore" }); });

applyFile("tests/fixtures/mcp-postgres-bootstrap.sql");
sql("alter table auth.users add column if not exists raw_app_meta_data jsonb not null default '{}'::jsonb");
for (const migration of [
  "20260904151355_mcp_knowledge_base", "20260904151436_mcp_oauth", "20260904180000_mcp_security_hardening",
  "20260904190000_mcp_final_hardening", "20260904230000_mcp_bounded_cleanup", "20260904233000_mcp_dcr_capacity_recovery",
  "20260905000000_mcp_cleanup_deadline_reserve", "20260905001000_mcp_knowledge_entitlement_boundary",
  "20260905002000_mcp_consent_user_binding", "20261022133000_oauth_authorization_request_limits",
  "20261022134000_mcp_dcr_short_lease", "20261022141000_mcp_rate_limit_cleanup_capacity",
  "20261023120000_video_lessons_admin",
]) applyFile(`supabase/migrations/${migration}.sql`);

const ids = { admin: "a0000000-0000-4000-8000-000000000001", preview: "b0000000-0000-4000-8000-000000000001", beginner: "b0000000-0000-4000-8000-000000000002", full: "b0000000-0000-4000-8000-000000000003" };
const resource = "http://127.0.0.1:3100/api/mcp";
const clientId = "mcp_test_client_00000000000000000001";
sql(`insert into auth.users(id,email,raw_app_meta_data) values ('${ids.admin}','admin@x.invalid','{"role":"admin"}'),('${ids.preview}','p@x.invalid','{}'),('${ids.beginner}','b@x.invalid','{}'),('${ids.full}','f@x.invalid','{}');
insert into public.profiles(id,tier) values ('${ids.admin}','full'),('${ids.preview}','preview'),('${ids.beginner}','beginner'),('${ids.full}','full');
insert into public.mcp_oauth_clients(client_id,client_name,redirect_uris,grant_types,token_endpoint_auth_method) values ('${clientId}','video test',array['http://127.0.0.1:4567/callback'],array['authorization_code','refresh_token'],'none');`);
const tokenHash = (tier: keyof typeof ids) => createHash("sha256").update(`token-${tier}`).digest("hex");
for (const tier of ["preview", "beginner", "full"] as const) {
  sql(`insert into public.mcp_access_tokens(token_hash,client_id,user_id,scope,resource,expires_at) values ('${tokenHash(tier)}','${clientId}','${ids[tier]}','mcp','${resource}',now()+interval '1 hour')`);
}

const chapters = '[{"index":1,"title":"Départ","startSeconds":0},{"index":2,"title":"Suite","startSeconds":60}]';
const videos = [
  { id: "11111111-0000-4000-8000-000000000001", section: "b1-s0", tier: "preview", word: "aurore", up: "u1", asset: "a1" },
  { id: "11111111-0000-4000-8000-000000000002", section: "b1-s2", tier: "beginner", word: "bruyere", up: "u2", asset: "a2" },
  { id: "11111111-0000-4000-8000-000000000003", section: "b2-s1", tier: "full", word: "cormoran", up: "u3", asset: "a3" },
];
for (const video of videos) {
  const transcript = `[0:00] Introduction sur le sujet ${video.word} pour le chapitre.\n[1:10] Suite détaillée autour de ${video.word} et de ses usages.`;
  sql(`insert into public.video_lessons(id,section_id,title,transcript,tier_required,status,mux_upload_id,mux_asset_id,playback_id,duration_seconds,chapters,created_by)
       values ('${video.id}','${video.section}','Vidéo ${video.word}','${transcript.replaceAll("'", "''")}','${video.tier}','ready','${video.up}','${video.asset}','pb-${video.up}',200,'${chapters}'::jsonb,'${ids.admin}')`);
  sql(`set role service_role; select count(*) from public.publish_video_lesson('${video.id}','${ids.admin}')`);
}
// Brouillon prêt mais NON publié : ne doit jamais entrer dans le corpus.
sql(`insert into public.video_lessons(id,section_id,title,transcript,tier_required,status,mux_upload_id,mux_asset_id,playback_id,duration_seconds,chapters,created_by)
     values ('11111111-0000-4000-8000-000000000009','b3-s1','Brouillon','[0:00] Brouillon secret sur le sujet pelican à ne jamais indexer.','full','ready','u9','a9','pb9',100,'[{"index":1,"title":"A","startSeconds":0}]'::jsonb,'${ids.admin}')`);

// Même requête que scripts/ingest-knowledge.ts
const published = JSON.parse(sql(`select coalesce(json_agg(t),'[]') from (select id,section_id,title,transcript,chapters,duration_seconds,tier_required from public.video_lessons where status='ready' and published_at is not null) t`)) as PublishedVideoTranscriptRow[];
assert.equal(published.length, 3);
const documents = collectVideoTranscriptDocuments(published);
const prepared: PreparedKnowledgeChunk[] = documents.flatMap((document) => chunkText(document.title, document.content).map((draft) => ({
  source: document.source, sourceId: document.sourceId, chunkIndex: draft.chunkIndex, title: draft.title, content: draft.content,
  tier: document.tier, contentHash: computeContentHash(document.tier, draft.title, draft.content, document.metadata), metadata: document.metadata,
})));
const plan = buildIngestionPlan(prepared, [], new Set(["blocs"]), Number.POSITIVE_INFINITY, fingerprint);
const rows = plan.toEmbed.map((chunk) => ({
  source: chunk.source, source_id: chunk.sourceId, chunk_index: chunk.chunkIndex, title: chunk.title, content: chunk.content,
  content_hash: chunk.contentHash, tier_required: chunk.tier, embedding: fakeEmbedding(chunk.content),
  metadata: { ...chunk.metadata, embeddingFingerprint: fingerprint },
}));
const inventory = plan.inventory.map((i) => ({ source: i.source, source_id: i.sourceId, chunk_index: i.chunkIndex }));
const lit = (value: unknown) => `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
const applied = psql([], `select upserted_count || ':' || deleted_count from public.apply_mcp_knowledge_snapshot(${lit(rows)},${lit(inventory)},array['blocs'],true);`);
assert.equal(applied, `${rows.length}:0`);

function search(tier: "preview" | "beginner" | "full", query: string): { title: string; tier_required: string }[] {
  const out = psql([], `select coalesce(json_agg(json_build_object('title', title, 'tier_required', tier_required)),'[]') from public.match_mcp_knowledge_chunks('${vectorLiteral(fakeEmbedding(query))}'::extensions.vector,'${tokenHash(tier)}','${resource}',20,null,'${fingerprint}');`);
  return JSON.parse(out);
}
const visible = (tier: "preview" | "beginner" | "full") => new Set(search(tier, "aurore bruyere cormoran pelican introduction sujet").map((r) => videos.find((v) => r.title.includes(v.word))?.section ?? r.title));
assert.deepEqual([...visible("preview")].sort(), ["b1-s0"]);
assert.deepEqual([...visible("beginner")].sort(), ["b1-s0", "b1-s2"]);
assert.deepEqual([...visible("full")].sort(), ["b1-s0", "b1-s2", "b2-s1"]);
// Une requête ciblée sur la vidéo COFFRE ne ramène rien de ce chapitre aux paliers inférieurs.
for (const tier of ["preview", "beginner"] as const) {
  assert.equal(search(tier, "cormoran").some((r) => r.title.includes("cormoran")), false);
  assert.equal(search(tier, "cormoran").some((r) => r.tier_required === "full"), false);
}
assert.equal(search("full", "cormoran")[0]?.title.includes("cormoran"), true);
assert.equal(search("full", "pelican").some((r) => r.title.includes("Brouillon")), false, "un brouillon non publié ne doit pas être indexé");
assert.equal(sql("select count(*) from public.knowledge_chunks where source_id like 'video:b3-s1%'"), "0");
// Retrait : une vidéo dépubliée disparaît au prochain snapshot complet de la source.
const withdrawn = psql([], `select upserted_count || ':' || deleted_count from public.apply_mcp_knowledge_snapshot('[]'::jsonb,'[]'::jsonb,array['blocs'],true);`);
assert.match(withdrawn, /^0:\d+$/);
assert.equal(search("full", "cormoran").length, 0);
console.log(JSON.stringify({ video_transcript_to_mcp: "passed", chunks: rows.length, tiers: { preview: 1, beginner: 2, full: 3 }, draft_excluded: true, withdrawal: "passed" }));
