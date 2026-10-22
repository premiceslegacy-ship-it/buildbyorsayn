import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("video lessons and admin audit stay service-role only", async () => {
  const sql = await readFile("supabase/migrations/20261023120000_video_lessons_admin.sql", "utf8");
  for (const table of ["video_lessons", "admin_action_audit"]) {
    assert.match(sql, new RegExp(`alter table public\\.${table} force row level security`));
    assert.match(sql, new RegExp(`revoke all on table public\\.${table} from anon, authenticated`));
  }
  assert.match(sql, /video_lessons_one_published_per_section/);
  assert.match(sql, /status = 'ready'[\s\S]*mux_asset_id is not null[\s\S]*playback_id is not null/);
  assert.match(sql, /create or replace function public\.publish_video_lesson/);
  assert.match(sql, /create or replace function public\.set_admin_user_tier/);
  assert.match(sql, /raw_app_meta_data->>'role' = 'admin'/);
  assert.doesNotMatch(sql, /grant .* to (anon|authenticated)/i);
});

test("tier changes and email sends use an approval-aware audit path", async () => {
  const tierAction = await readFile("app/actions/setUserTier.ts", "utf8");
  const emailRoute = await readFile("app/api/admin/send-email/route.ts", "utf8");
  const composer = await readFile("components/AdminMailComposer.tsx", "utf8");
  assert.match(tierAction, /rpc\("set_admin_user_tier"/);
  assert.match(emailRoute, /approved:\s*z\.literal\(true\)/);
  assert.match(emailRoute, /confirmation:\s*z\.literal\("ENVOYER"\)/);
  assert.match(emailRoute, /action:\s*"email\.broadcast"/);
  assert.match(composer, /Je confirme cet envoi réel/);
});
