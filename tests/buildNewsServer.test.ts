import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";

if (process.env.BUILD_NEWS_INNER !== "1") {
  test("build_news refuse le non admin et journalise les écritures admin", () => {
    const result = spawnSync(process.execPath, [
      "--import", "./tests/fixtures/serverOnlyStub.mjs",
      "--import", "tsx",
      "--experimental-test-module-mocks",
      "--test",
      "tests/buildNewsServer.test.ts",
    ], {
      encoding: "utf8",
      env: { ...process.env, NODE_ENV: "test", BUILD_NEWS_INNER: "1" },
    });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  });
} else {
  const file = (path: string) => pathToFileURL(resolve(path)).href;
  const ADMIN_ID = "123e4567-e89b-42d3-a456-426614174000";
  const NEWS_ID = "223e4567-e89b-42d3-a456-426614174000";
  let adminDatabaseCalls = 0;
  let memberDatabaseCalls = 0;
  let isAdmin = false;
  const audits: Array<Record<string, unknown>> = [];
  let deleteStoragePath: string | null = null;
  const removedStoragePaths: string[] = [];
  let storageRemoveError: Error | null = null;
  const queuedStoragePaths: string[] = [];
  const NEWS_THUMBNAIL_PATH = "news/123e4567-e89b-42d3-a456-426614174000/aaaaaaaaaaaa.jpg";
  type MockChain = {
    insert: () => MockChain;
    delete: () => MockChain;
    select: () => MockChain;
    eq: () => MockChain;
    upsert: (values: { storage_path?: string }) => Promise<{ error: null }>;
    single: () => Promise<{ data: typeof row; error: null }>;
    maybeSingle: () => Promise<{ data: { id: string; thumbnail_storage_path: string | null }; error: null }>;
  };

  const row = {
    id: NEWS_ID,
    title: "Une nouveauté réelle",
    published_at: "2026-10-23T10:00:00.000Z",
    thumbnail: "/da/mini/b3.jpg",
    bloc_label: "Bloc 3",
    internal_url: "/blocs/3",
    sentence: "Le nouveau chapitre est disponible.",
    created_at: "2026-10-23T10:00:00.000Z",
  };

  mock.module(file("lib/supabase/admin.ts"), {
    namedExports: {
      createAdminSupabase: () => ({
        from: () => {
          adminDatabaseCalls += 1;
          const chain: MockChain = {
            insert: () => chain,
            delete: () => chain,
            select: () => chain,
            eq: () => chain,
            upsert: async (values) => {
              if (values.storage_path) queuedStoragePaths.push(values.storage_path);
              return { error: null };
            },
            single: async () => ({ data: row, error: null }),
            maybeSingle: async () => ({ data: { id: NEWS_ID, thumbnail_storage_path: deleteStoragePath }, error: null }),
          };
          return chain;
        },
        storage: {
          from: () => ({
            remove: async (paths: string[]) => {
              removedStoragePaths.push(...paths);
              return { error: storageRemoveError };
            },
          }),
    },
      }),
    },
  });
  mock.module(file("lib/supabase/server.ts"), {
    namedExports: {
      createClient: async () => ({
        from: () => {
          memberDatabaseCalls += 1;
          const query = {
            select() { return query; },
            order() { return query; },
            limit: async () => ({ data: [row], error: null }),
          };
          return query;
        },
      }),
    },
  });
  mock.module(file("lib/mux/adminServer.ts"), {
    namedExports: {
      getVerifiedAdmin: async () => isAdmin ? { id: ADMIN_ID, app_metadata: { role: "admin" } } : null,
      recordAdminAction: async (entry: Record<string, unknown>) => { audits.push(entry); return "audit-id"; },
    },
  });

  const buildNews = await import("../lib/buildNews/server");
  const actions = await import("../components/admin/news/actions");
  const input = {
    title: row.title,
    publishedAt: row.published_at,
    thumbnail: row.thumbnail,
    blocLabel: row.bloc_label,
    internalUrl: row.internal_url,
    sentence: row.sentence,
  };

  test("un non admin ne peut ni créer ni supprimer", async () => {
    await assert.rejects(() => buildNews.createBuildNews(input), /Accès refusé/);
    await assert.rejects(() => buildNews.deleteBuildNews(NEWS_ID), /Accès refusé/);
    assert.equal(adminDatabaseCalls, 0);
  });

  test("l'action de lecture admin refuse aussi un membre non admin", async () => {
    isAdmin = false;
    const result = await actions.loadBuildNewsAction();
    assert.deepEqual(result, { ok: false, error: "Accès refusé." });
    assert.equal(memberDatabaseCalls, 0);
  });

  test("un admin crée et supprime avec une trace d'audit", async () => {
    isAdmin = true;
    assert.equal((await buildNews.createBuildNews(input)).id, NEWS_ID);
    deleteStoragePath = NEWS_THUMBNAIL_PATH;
    assert.deepEqual(await buildNews.deleteBuildNews(NEWS_ID), { deleted: true });
    assert.deepEqual(removedStoragePaths, [NEWS_THUMBNAIL_PATH]);
    assert.deepEqual(audits.map((entry) => entry.action), ["build_news.create", "build_news.delete"]);
    assert.equal(audits.every((entry) => entry.actorUserId === ADMIN_ID && entry.approved === true), true);
  });
  test("la suppression planifie le nettoyage si Storage échoue", async () => {
    isAdmin = true;
    storageRemoveError = new Error("Storage indisponible");
    deleteStoragePath = NEWS_THUMBNAIL_PATH;
    assert.deepEqual(await buildNews.deleteBuildNews(NEWS_ID), { deleted: true });
    assert.deepEqual(queuedStoragePaths, [NEWS_THUMBNAIL_PATH]);
    storageRemoveError = null;
  });
}
