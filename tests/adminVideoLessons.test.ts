import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import Mux from "@mux/ts";
import {
  ADMIN_VIDEO_CONFIRMATION,
  MAX_ADMIN_VIDEO_BYTES,
  adminVideoCreateSchema,
  buildMuxPassthrough,
  parseMuxPassthrough,
  parseTranscriptSegments,
  publishVideoSchema,
  tierForBloc,
  validateChapterTimeline,
} from "../lib/mux/adminLessons";

const validCreate = {
  blocNumero: 2,
  position: 1,
  title: "Une vidéo",
  summary: "Résumé",
  transcript: "[0:00] Une transcription relue assez longue.",
  deliverables: ["Un livrable"],
  chapters: [{ index: 1, title: "Départ", startSeconds: 0 }],
  file: { name: "video.mp4", size: 1000, type: "video/mp4" },
};

test("admin video inputs reject oversized and non-video files", () => {
  assert.equal(adminVideoCreateSchema.safeParse(validCreate).success, true);
  assert.equal(adminVideoCreateSchema.safeParse({ ...validCreate, file: { ...validCreate.file, type: "text/plain" } }).success, false);
  assert.equal(adminVideoCreateSchema.safeParse({ ...validCreate, file: { ...validCreate.file, size: MAX_ADMIN_VIDEO_BYTES + 1 } }).success, false);
  assert.equal(adminVideoCreateSchema.safeParse({ ...validCreate, transcript: "trop court" }).success, true);
});

test("chapter timelines start at zero, stay consecutive and fit the asset", () => {
  assert.equal(validateChapterTimeline([
    { index: 1, title: "A", startSeconds: 0 },
    { index: 2, title: "B", startSeconds: 30 },
  ], 60), null);
  assert.match(validateChapterTimeline([{ index: 1, title: "A", startSeconds: 1 }]) ?? "", /0 seconde/);
  assert.match(validateChapterTimeline([
    { index: 1, title: "A", startSeconds: 0 },
    { index: 3, title: "B", startSeconds: 30 },
  ]) ?? "", /consécutifs/);
  assert.match(validateChapterTimeline([
    { index: 1, title: "A", startSeconds: 0 },
    { index: 2, title: "B", startSeconds: 60 },
  ], 60) ?? "", /dépasse/);
});

test("block tier is derived on the server and never accepted from the browser", () => {
  assert.equal(tierForBloc("1"), "beginner");
  assert.equal(tierForBloc("2"), "full");
  assert.equal(tierForBloc("7"), "full");
  assert.throws(() => tierForBloc("b2-s1"));
});

test("Mux passthrough accepts only the opaque v4 video id", () => {
  const id = "123e4567-e89b-42d3-a456-426614174000";
  assert.equal(buildMuxPassthrough(id), `build-video:${id}`);
  assert.equal(parseMuxPassthrough(`build-video:${id}`), id);
  assert.equal(parseMuxPassthrough("b2-s1"), null);
});

test("timestamped transcription keeps exact segment positions and has a safe untimed fallback", () => {
  assert.deepEqual(parseTranscriptSegments("[0:00] Départ\n[2:10] Deuxième idée\ncontinue"), [
    { startSeconds: 0, text: "Départ" },
    { startSeconds: 130, text: "Deuxième idée continue" },
  ]);
  assert.deepEqual(parseTranscriptSegments("Texte sans repère\nqui continue"), [
    { startSeconds: 0, text: "Texte sans repère qui continue" },
  ]);
});

test("publication requires the explicit human confirmation", () => {
  assert.equal(publishVideoSchema.safeParse({ approved: true, confirmation: ADMIN_VIDEO_CONFIRMATION }).success, true);
  assert.equal(publishVideoSchema.safeParse({ approved: false, confirmation: ADMIN_VIDEO_CONFIRMATION }).success, false);
  assert.equal(publishVideoSchema.safeParse({ approved: true, confirmation: "oui" }).success, false);
});

test("video admin routes authorize before Mux and the webhook unwraps the raw signed body", async () => {
  const createRoute = await readFile("app/api/admin/videos/route.ts", "utf8");
  const webhookRoute = await readFile("app/api/mux/webhook/route.ts", "utf8");
  assert.ok(createRoute.indexOf("getVerifiedAdmin()") < createRoute.indexOf("video.uploads.create"));
  assert.match(createRoute, /playback_policies:\s*\["signed"\]/);
  assert.match(createRoute, /generated_subtitles/);
  assert.match(webhookRoute, /webhooks\.unwrap\(bounded\.text, request\.headers\)/);
  assert.match(webhookRoute, /pickSignedPlaybackId/);
  assert.match(webhookRoute, /syncMuxTranscriptForReadyAsset/);
  assert.doesNotMatch(webhookRoute, /request\.json\(\)/);
});
test("la publication refuse les vidéos remplacées et Mux reçoit le numéro affiché", async () => {
  const migration = await readFile("supabase/migrations/20261024110000_block_video_lessons.sql", "utf8");
  const adminRoute = await readFile("app/api/admin/videos/route.ts", "utf8");
  const agent = await readFile("lib/adminAgent/tools.ts", "utf8");
  assert.match(migration, /v_video\.replaced_at is not null/);
  assert.match(migration, /pg_advisory_xact_lock/);
  assert.match(adminRoute, /external_id: `\$\{parsed\.data\.blocNumero\}:/);
  assert.match(agent, /external_id: `\$\{input\.blocNumero\}:/);
});
test("la taille Mux n'est pas inventée et la durée reste plafonnée", async () => {
  const [agent, webhook, docs, migration] = await Promise.all([
    readFile("lib/adminAgent/tools.ts", "utf8"),
    readFile("app/api/mux/webhook/route.ts", "utf8"),
    readFile("docs/ADMIN-AGENT.md", "utf8"),
    readFile("supabase/migrations/20261024110000_block_video_lessons.sql", "utf8"),
  ]);
  assert.doesNotMatch(agent, /asset[\s\S]{0,40}filesize/);
  assert.doesNotMatch(webhook, /asset[\s\S]{0,40}filesize/);
  assert.match(agent, /MAX_ADMIN_VIDEO_DURATION_SECONDS/);
  assert.match(webhook, /MAX_ADMIN_VIDEO_DURATION_SECONDS/);
  assert.match(docs, /Mux n'impose pas de taille maximale/);
  assert.match(migration, /select \* into v_video[\s\S]*pg_catalog\.pg_advisory_xact_lock[\s\S]*for update/);
  assert.match(migration, /values \(v_previous_asset, v_previous_video_id\)/);
});

test("le nettoyage Mux est borné, protégé par CRON_SECRET et planifié", async () => {
  const [route, schedule] = await Promise.all([
    readFile("app/api/cron/mux-cleanup/route.ts", "utf8"),
    readFile("vercel.json", "utf8"),
  ]);
  assert.match(route, /verifyMcpCleanupAuthorization/);
  assert.ok(route.indexOf("verifyMcpCleanupAuthorization") < route.indexOf("cleanupPendingMuxAssets"));
  assert.match(route, /cleanupPendingMuxAssets/);
  assert.match(route, /status: 401/);
  assert.match(route, /maxDuration = 30/);
  assert.match(schedule, /\/api\/cron\/mux-cleanup/);
});

test("Mux rejects a missing or forged webhook signature and accepts the exact raw signed body", async () => {
  const secret = "local-webhook-test-secret";
  const timestamp = Math.floor(Date.now() / 1000);
  const body = JSON.stringify({ id: "evt-local", type: "video.asset.ready", data: { id: "asset-local" } });
  const signature = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  const mux = new Mux({ webhookSecret: secret });

  await assert.rejects(() => mux.webhooks.unwrap(body, {}), /mux-signature/);
  await assert.rejects(
    () => mux.webhooks.unwrap(body, { "mux-signature": `t=${timestamp},v1=${"0".repeat(64)}` }),
    /No signatures found matching/,
  );
  const event = await mux.webhooks.unwrap(body, { "mux-signature": `t=${timestamp},v1=${signature}` });
  assert.equal(event.id, "evt-local");
});
