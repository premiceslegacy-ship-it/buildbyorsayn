import assert from "node:assert/strict";
import test from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  AUTO_NEWS_FALLBACK_THUMBNAIL,
  autoNewsSourceKey,
  diffSkillsManifests,
  publishVideoNews,
  recordAutoNews,
  skillsNewsEntry,
  skillsNewsText,
  videoNewsText,
} from "../lib/nouveautes/autoNews";
import { isMcpEntryVisible } from "../lib/mcp/entryVisibility";

const VIDEO_ID = "31fa9543-f089-4405-b2ca-25a1a14c87a4";

type Row = Record<string, unknown>;

function fakeClient(video: Row | null) {
  const news = new Map<string, Row>();
  const upserts: Row[] = [];
  const client = {
    from(table: string) {
      if (table === "video_lessons") {
        const chain = { select: () => chain, eq: () => chain, maybeSingle: async () => ({ data: video, error: null }) };
        return chain;
      }
      assert.equal(table, "build_news");
      let key: unknown;
      const chain = {
        select: () => chain,
        eq: (_column: string, value: unknown) => { key = value; return chain; },
        maybeSingle: async () => ({ data: news.get(String(key)) ?? null, error: null }),
        upsert: (row: Row, options: { onConflict: string; ignoreDuplicates: boolean }) => {
          assert.equal(options.onConflict, "source_key");
          assert.equal(options.ignoreDuplicates, true);
          upserts.push(row);
          const inserted = !news.has(String(row.source_key));
          if (inserted) news.set(String(row.source_key), { id: `news-${news.size + 1}`, ...row });
          return { select: async () => ({ data: inserted ? [{ id: news.get(String(row.source_key))!.id }] : [], error: null }) };
        },
      };
      return chain;
    },
  } as unknown as SupabaseClient;
  return { client, news, upserts };
}

const publishedVideo = {
  id: VIDEO_ID,
  bloc_id: "b1",
  position: 1,
  title: "Pourquoi tout processiser",
  duration_seconds: 1080,
  thumbnail: "mux:12",
  playback_id: "pb",
  published_at: "2026-10-24T09:00:00.000Z",
  replaced_at: null,
};

const deps = (client: SupabaseClient, loadThumbnail?: () => Promise<{ url: string; path: string | null } | null>) => ({
  client,
  loadThumbnail: loadThumbnail ?? (async () => ({ url: "https://cdn.example/news/a.jpg", path: `news/${VIDEO_ID}/aaaaaaaaaaaa.jpg` })),
  blocLabelFor: () => "Bloc 1",
  createdBy: "admin-1",
});

test("le texte d'une vidéo est factuel, en français, sans tiret cadratin", () => {
  const text = videoNewsText({ title: "Pourquoi tout processiser", blocLabel: "Bloc 1", durationSeconds: 1080 });
  assert.equal(text.title, "Pourquoi tout processiser");
  assert.equal(text.sentence, "Nouvelle vidéo\u00a0: Pourquoi tout processiser. Bloc 1, durée 18 min.");
  assert.doesNotMatch(`${text.title}${text.sentence}`, /[—–]/);
  assert.equal(videoNewsText({ title: "Fini !", blocLabel: null, durationSeconds: null }).sentence, "Nouvelle vidéo\u00a0: Fini !");
});

test("publier une vidéo crée une Nouveauté immédiate liée à la vidéo", async () => {
  const { client, news } = fakeClient(publishedVideo);
  const result = await publishVideoNews(VIDEO_ID, deps(client));
  assert.equal(result.status, "created");
  const row = news.get(autoNewsSourceKey("video", VIDEO_ID, 1))!;
  assert.equal(row.internal_url, "/blocs/b1?video=1");
  assert.equal(row.published_at, publishedVideo.published_at);
  assert.equal(row.bloc_label, "Bloc 1");
  assert.equal(row.created_by, "admin-1");
  assert.equal(row.thumbnail, "https://cdn.example/news/a.jpg");
});

test("une double publication ou une relance du rattrapage ne crée aucun doublon", async () => {
  const { client, news, upserts } = fakeClient(publishedVideo);
  const [first, second] = await Promise.all([publishVideoNews(VIDEO_ID, deps(client)), publishVideoNews(VIDEO_ID, deps(client))]);
  assert.deepEqual([first.status, second.status].sort(), ["created", "exists"]);
  const third = await publishVideoNews(VIDEO_ID, deps(client));
  assert.equal(third.status, "exists");
  assert.equal(news.size, 1);
  assert.ok(upserts.length >= 1);
});

test("aucun e-mail ni appel réseau n'est déclenché par une Nouveauté automatique", async () => {
  const originalFetch = globalThis.fetch;
  let networkCalls = 0;
  globalThis.fetch = (async () => { networkCalls += 1; throw new Error("réseau interdit"); }) as typeof fetch;
  try {
    const { client } = fakeClient(publishedVideo);
    await publishVideoNews(VIDEO_ID, deps(client));
    await recordAutoNews(client, skillsNewsEntry({ releaseId: "r1", publishedAt: "2026-10-25T08:00:00.000Z", added: ["A"], changed: [] })!);
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert.equal(networkCalls, 0);
});

test("une vidéo non publiée ou absente ne crée rien", async () => {
  const draft = fakeClient({ ...publishedVideo, published_at: null });
  assert.deepEqual(await publishVideoNews(VIDEO_ID, deps(draft.client)), { status: "skipped", reason: "video_not_published" });
  const missing = fakeClient(null);
  assert.deepEqual(await publishVideoNews(VIDEO_ID, deps(missing.client)), { status: "skipped", reason: "video_missing" });
  assert.equal(draft.news.size + missing.news.size, 0);
});

test("sans miniature stable, la Nouveauté garde une image de repli et reste publiée", async () => {
  const { client, news } = fakeClient(publishedVideo);
  const result = await publishVideoNews(VIDEO_ID, deps(client, async () => { throw new Error("miniature indisponible"); }));
  assert.equal(result.status, "created");
  assert.equal([...news.values()][0].thumbnail, AUTO_NEWS_FALLBACK_THUMBNAIL);
});

test("la Nouveauté skills liste les packs ajoutés ou modifiés d'après la référence précédente", () => {
  const diff = diffSkillsManifests(
    [{ fileName: "a.md", sha256: "1" }, { fileName: "b.zip", sha256: "2" }, { fileName: "c.zip", sha256: "3" }],
    [{ fileName: "a.md", sha256: "1" }, { fileName: "b.zip", sha256: "9" }, { fileName: "c.zip", sha256: "3" }, { fileName: "d.zip", sha256: "4" }],
  );
  assert.deepEqual(diff, { added: ["d.zip"], changed: ["b.zip"] });
  const text = skillsNewsText(["Pack D"], ["Pack B", "Pack E"]);
  assert.equal(text.title, "Skills mis à jour");
  assert.match(text.sentence, /Nouveau pack\u00a0: Pack D\./);
  assert.match(text.sentence, /Packs mis à jour\u00a0: Pack B, Pack E\./);
  assert.doesNotMatch(text.sentence, /[—–]/);
  assert.equal(skillsNewsEntry({ releaseId: "r", publishedAt: "2026-10-25T08:00:00.000Z", added: [], changed: [] }), null);
});

test("la même release de skills n'est enregistrée qu'une fois", async () => {
  const { client, news } = fakeClient(null);
  const entry = skillsNewsEntry({ releaseId: "20261025T080000000Z-abcd1234", publishedAt: "2026-10-25T08:00:00.000Z", added: ["Pack D"], changed: [] })!;
  assert.equal((await recordAutoNews(client, entry)).status, "created");
  assert.equal((await recordAutoNews(client, entry)).status, "exists");
  assert.equal(news.size, 1);
  assert.equal(entry.createdBy, null);
});

test("les points d'entrée du connecteur restent cachés tant que le connecteur est fermé", () => {
  assert.equal(isMcpEntryVisible({}), false);
  assert.equal(isMcpEntryVisible({ NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE: "false", NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED: "false" }), false);
  assert.equal(isMcpEntryVisible({ NEXT_PUBLIC_MCP_CONNECTOR_BETA_VISIBLE: "true" }), true);
  assert.equal(isMcpEntryVisible({ NEXT_PUBLIC_MCP_CONNECTOR_LAUNCHED: "true" }), true);
});
