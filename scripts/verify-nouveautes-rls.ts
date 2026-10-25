import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local", quiet: true });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !anonKey || !serviceKey) throw new Error("Supabase verification environment is incomplete.");

const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
const stamp = Date.now();
const password = `Lesson-${stamp}-Aa9!`;
const section = "b1-s0";
const videoId = "RLSprobe001"; // 11 chars, matches the table check
const newsId = "00000000-0000-4000-8000-000000000001";
const results: { check: string; pass: boolean; detail?: string }[] = [];

function record(check: string, pass: boolean, detail?: string) {
  results.push({ check, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${check}${detail && !pass ? `  (${detail})` : ""}`);
}

const denied = (error: { code?: string; message?: string } | null) =>
  Boolean(error) && (error!.code === "42501" || /permission denied|row-level security/i.test(error!.message ?? ""));

async function signedInClient(user: User): Promise<SupabaseClient> {
  const client = createClient(url!, anonKey!, { auth: { persistSession: false } });
  const { error } = await client.auth.signInWithPassword({ email: user.email!, password });
  if (error) throw error;
  return client;
}

async function cleanup(users: User[]) {
  const ids = users.map((user) => user.id);
  if (ids.length) {
    await admin.from("lesson_progress").delete().in("user_id", ids);
    await admin.from("build_news_seen").delete().in("user_id", ids);
    await admin.from("member_nouveautes_seen").delete().in("user_id", ids);
    await admin.from("profiles").delete().in("id", ids);
  }
  await admin.from("build_news").delete().eq("id", newsId);
  await admin.from("youtube_videos").delete().eq("video_id", videoId);
  for (const user of users) await admin.auth.admin.deleteUser(user.id);
}

async function main() {
  const users: User[] = [];
  try {
    for (const suffix of ["a", "b"]) {
      const { data, error } = await admin.auth.admin.createUser({ email: `lesson-rls-${stamp}-${suffix}@example.invalid`, password, email_confirm: true });
      if (error || !data.user) throw error ?? new Error("fixture creation failed");
      users.push(data.user);
    }
    const [a, b] = users;
    const clientA = await signedInClient(a);
    const clientB = await signedInClient(b);
    const anon = createClient(url!, anonKey!, { auth: { persistSession: false } });

    // lesson_progress ---------------------------------------------------------
    const own = await clientA.from("lesson_progress").upsert({ user_id: a.id, section_id: section, position_seconds: 42, completed: false }, { onConflict: "user_id,section_id" });
    record("lesson_progress: member writes own row", !own.error, own.error?.message);

    const seenByB = await clientB.from("lesson_progress").select("*").eq("user_id", a.id);
    record("lesson_progress: another member reads nothing of mine", !seenByB.error && seenByB.data?.length === 0, seenByB.error?.message);

    const forged = await clientB.from("lesson_progress").insert({ user_id: a.id, section_id: "b1-s1", position_seconds: 1 });
    record("lesson_progress: cannot insert a row for someone else", denied(forged.error), forged.error?.message);

    const hijack = await clientB.from("lesson_progress").update({ position_seconds: 999 }).eq("user_id", a.id).select();
    record("lesson_progress: cannot update someone else's row", !hijack.error && (hijack.data?.length ?? 0) === 0, hijack.error?.message);
    const intact = await admin.from("lesson_progress").select("position_seconds").eq("user_id", a.id).eq("section_id", section).single();
    record("lesson_progress: the victim's row is unchanged", intact.data?.position_seconds === 42);

    const del = await clientA.from("lesson_progress").delete().eq("user_id", a.id);
    record("lesson_progress: members cannot delete (no grant)", denied(del.error), del.error?.message);

    const negative = await clientA.from("lesson_progress").upsert({ user_id: a.id, section_id: "b1-s2", position_seconds: -1 }, { onConflict: "user_id,section_id" });
    record("lesson_progress: negative position rejected by the table check", Boolean(negative.error), "accepted");

    const anonRead = await anon.from("lesson_progress").select("*").limit(1);
    record("lesson_progress: anonymous visitors are refused", denied(anonRead.error), anonRead.error?.message);

    // member_nouveautes_seen -------------------------------------------------
    const mark = await clientA.from("member_nouveautes_seen").upsert({ user_id: a.id, seen_at: new Date().toISOString() }, { onConflict: "user_id" });
    record("member_nouveautes_seen: member writes own row", !mark.error, mark.error?.message);
    const markForged = await clientB.from("member_nouveautes_seen").upsert({ user_id: a.id, seen_at: "2000-01-01T00:00:00Z" }, { onConflict: "user_id" });
    record("member_nouveautes_seen: cannot overwrite someone else's marker", denied(markForged.error), markForged.error?.message);
    const markRead = await clientB.from("member_nouveautes_seen").select("*").eq("user_id", a.id);
    record("member_nouveautes_seen: another member reads nothing of mine", !markRead.error && markRead.data?.length === 0);
    const anonMark = await anon.from("member_nouveautes_seen").select("*").limit(1);
    record("member_nouveautes_seen: anonymous visitors are refused", denied(anonMark.error), anonMark.error?.message);

    // build_news_seen --------------------------------------------------------
    const seededNews = await admin.from("build_news").insert({
      id: newsId,
      title: "RLS probe",
      published_at: new Date().toISOString(),
      thumbnail: "/da/symbole-sombre.svg",
      bloc_label: null,
      internal_url: "/nouveautes",
      sentence: "RLS probe.",
      source_key: `rls-probe:${newsId}:1`,
      created_by: a.id,
    }).select("id").single();
    record("build_news_seen: service role seeds a news row", !seededNews.error, seededNews.error?.message);
    const ownNews = await clientA.from("build_news_seen").insert({ user_id: a.id, news_id: newsId });
    record("build_news_seen: member writes own row", !ownNews.error, ownNews.error?.message);
    const forgedNews = await clientB.from("build_news_seen").insert({ user_id: a.id, news_id: newsId });
    record("build_news_seen: another member cannot write my row", denied(forgedNews.error), forgedNews.error?.message);
    const hiddenNews = await clientB.from("build_news_seen").select("*").eq("user_id", a.id);
    record("build_news_seen: another member reads nothing of mine", !hiddenNews.error && hiddenNews.data?.length === 0, hiddenNews.error?.message);
    const anonNews = await anon.from("build_news_seen").select("*").limit(1);
    record("build_news_seen: anonymous visitors are refused", denied(anonNews.error), anonNews.error?.message);

    // youtube_videos -----------------------------------------------------------
    const bad = await admin.from("youtube_videos").insert({ video_id: "not-valid", title: "x", published_at: new Date().toISOString() });
    record("youtube_videos: malformed video id rejected by the table check", Boolean(bad.error), "accepted");
    const seed = await admin.from("youtube_videos").upsert({ video_id: videoId, title: "RLS probe", published_at: new Date().toISOString() }, { onConflict: "video_id" });
    record("youtube_videos: service role can write", !seed.error, seed.error?.message);
    const publicRead = await anon.from("youtube_videos").select("video_id").eq("video_id", videoId);
    record("youtube_videos: public read works without an account", !publicRead.error && publicRead.data?.length === 1, publicRead.error?.message);
    const anonWrite = await anon.from("youtube_videos").insert({ video_id: "AAAAAAAAAAA", title: "x", published_at: new Date().toISOString() });
    record("youtube_videos: anonymous write refused", denied(anonWrite.error), anonWrite.error?.message);
    const memberWrite = await clientA.from("youtube_videos").upsert({ video_id: videoId, title: "defaced", published_at: new Date().toISOString() }, { onConflict: "video_id" });
    record("youtube_videos: a paying member cannot write either", denied(memberWrite.error), memberWrite.error?.message);
    const memberDelete = await clientA.from("youtube_videos").delete().eq("video_id", videoId);
    record("youtube_videos: a member cannot delete", denied(memberDelete.error), memberDelete.error?.message);
    const still = await admin.from("youtube_videos").select("title").eq("video_id", videoId).single();
    record("youtube_videos: the row was not defaced", still.data?.title === "RLS probe");

    // count query used by the nav badge ---------------------------------------
    const count = await clientA.from("build_news").select("id", { count: "exact", head: true }).gt("published_at", "2000-01-01T00:00:00Z");
    record("nav badge count query works for members", !count.error && (count.count ?? 0) >= 1, count.error?.message);
  } finally {
    await cleanup(users);
  }

  const failed = results.filter((result) => !result.pass);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) process.exit(1);
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
