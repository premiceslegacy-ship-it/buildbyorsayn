import assert from "node:assert/strict";
import test from "node:test";
import { loadNouveautesVideos, YOUTUBE_VIDEOS_CACHE_TAG } from "../lib/nouveautes/loadVideos";

function withEnv<T>(run: () => Promise<T>) {
  const previous = { url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY };
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
  return run().finally(() => {
    for (const [name, value] of [["NEXT_PUBLIC_SUPABASE_URL", previous.url], ["NEXT_PUBLIC_SUPABASE_ANON_KEY", previous.key]] as const) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  });
}

test("the public list is one cacheable, cookie-free anon request tagged for on-demand invalidation", () => withEnv(async () => {
  let seen: { url: string; init: RequestInit & { next?: unknown } } | null = null;
  const rows = [{ video_id: "AAAAAAAAAAA", title: "t", published_at: "2026-10-10T09:00:00+00:00" }];
  const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
    seen = { url: String(input), init: init as never };
    return Response.json(rows);
  }) as typeof fetch;
  assert.deepEqual(await loadNouveautesVideos(fetchImpl), rows);
  const { url, init } = seen!;
  const parsed = new URL(url);
  assert.equal(parsed.origin + parsed.pathname, "https://example.supabase.co/rest/v1/youtube_videos");
  assert.equal(parsed.searchParams.get("order"), "published_at.desc");
  assert.equal(parsed.searchParams.get("limit"), "60");
  assert.deepEqual(init.headers, { apikey: "anon-key" }, "no Authorization/cookie: those would opt the response out of the shared cache");
  assert.deepEqual(init.next, { revalidate: 300, tags: [YOUTUBE_VIDEOS_CACHE_TAG] });
}));

test("a failing or malformed backend yields an empty list instead of crashing the page", () => withEnv(async () => {
  const original = console.error;
  const logged: unknown[] = [];
  console.error = (...args: unknown[]) => { logged.push(args); };
  try {
    assert.deepEqual(await loadNouveautesVideos((async () => new Response("{}", { status: 404 })) as typeof fetch), []);
    assert.deepEqual(await loadNouveautesVideos((async () => { throw new Error("network down"); }) as typeof fetch), []);
    assert.equal(logged.length, 2);
  } finally {
    console.error = original;
  }
}));

test("missing Supabase configuration is an empty list, not a request to undefined", async () => {
  const previous = process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  try {
    const fetchImpl = (async () => { throw new Error("must not be called"); }) as typeof fetch;
    assert.deepEqual(await loadNouveautesVideos(fetchImpl), []);
  } finally {
    if (previous !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = previous;
  }
});
