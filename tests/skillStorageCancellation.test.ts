import assert from "node:assert/strict";
import test from "node:test";
import { getStoredSkillContent } from "../lib/skills/storage";
import { SKILLS_CATALOG } from "../lib/skillsCatalog";

test("skill storage combines caller cancellation with its internal timeout", async () => {
  const skill = SKILLS_CATALOG.find((item) => item.fileName.endsWith(".md"));
  assert.ok(skill);

  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const controller = new AbortController();
  let observedSignal: AbortSignal | null = null;

  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "synthetic-test-key";
  globalThis.fetch = async (_input, init) => {
    observedSignal = init?.signal ?? null;
    return new Response("upstream unavailable", { status: 503 });
  };

  try {
    controller.abort(new Error("caller_cancelled"));
    const stored = await getStoredSkillContent(skill, {
      signal: controller.signal,
      timeoutMs: 2_000,
    });
    assert.equal(stored, null);
    assert.equal(observedSignal?.aborted, true);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
    if (originalKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
  }
});
