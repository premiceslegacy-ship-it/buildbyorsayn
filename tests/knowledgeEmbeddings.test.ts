import assert from "node:assert/strict";
import test from "node:test";
import {
  embeddingFingerprint,
  normalizeAndValidateEmbedding,
  OpenRouterEmbeddingProvider,
  resolveEmbeddingConfig,
} from "../lib/knowledge/embeddings";

test("embedding validation requires 768 finite non-zero values and normalizes them", () => {
  const normalized = normalizeAndValidateEmbedding(Array.from({ length: 768 }, () => 2));
  const norm = Math.sqrt(normalized.reduce((sum, value) => sum + value * value, 0));
  assert.ok(Math.abs(norm - 1) < 1e-9);
  assert.throws(() => normalizeAndValidateEmbedding([]));
  assert.throws(() => normalizeAndValidateEmbedding(Array.from({ length: 767 }, () => 1)));
  assert.throws(() => normalizeAndValidateEmbedding(Array.from({ length: 768 }, () => 0)));
  assert.throws(() =>
    normalizeAndValidateEmbedding([Number.NaN, ...Array.from({ length: 767 }, () => 1)])
  );
});

test("embedding provider selection is explicit and matches the disclosed OpenRouter processor", () => {
  assert.deepEqual(
    resolveEmbeddingConfig({
      KNOWLEDGE_EMBEDDING_PROVIDER: "openrouter",
      OPENROUTER_API_KEY: "present",
    }),
    {
      provider: "openrouter",
      model: "openai/text-embedding-3-small",
      dimensions: 768,
      normalization: "l2-v1",
    }
  );
  assert.throws(() =>
    resolveEmbeddingConfig({ KNOWLEDGE_EMBEDDING_PROVIDER: "gemini", GEMINI_API_KEY: "present" })
  );
  assert.throws(() => resolveEmbeddingConfig({ KNOWLEDGE_EMBEDDING_PROVIDER: "openrouter" }));
});

test("embedding fingerprint changes with the selected OpenRouter model", () => {
  const first = embeddingFingerprint({
    provider: "openrouter",
    model: "openai/text-embedding-3-small",
    dimensions: 768,
    normalization: "l2-v1",
  });
  const second = embeddingFingerprint({
    provider: "openrouter",
    model: "openai/text-embedding-3-large",
    dimensions: 768,
    normalization: "l2-v1",
  });
  assert.notEqual(first, second);
  assert.match(first, /^[a-f0-9]{64}$/);
});

test("OpenRouter aborts stalled attempts within the total embedding budget", async () => {
  let attempts = 0;
  const stalledFetch: typeof fetch = async (_input, init) => {
    attempts += 1;
    return new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(init.signal?.reason), { once: true });
    });
  };
  const provider = new OpenRouterEmbeddingProvider("test-key", "test-model", {
    fetch: stalledFetch,
  });
  const startedAt = Date.now();

  await assert.rejects(
    provider.embedBatch(["query"], "RETRIEVAL_QUERY", {
      totalTimeoutMs: 80,
      attemptTimeoutMs: 20,
      maxAttempts: 5,
      backoffBaseMs: 1_000,
    }),
    /deadline/i
  );

  assert.equal(attempts, 1);
  assert.ok(Date.now() - startedAt < 500);
});

test("OpenRouter combines caller cancellation with its internal embedding deadlines", async () => {
  const controller = new AbortController();
  let observedSignal: AbortSignal | null = null;
  const provider = new OpenRouterEmbeddingProvider("test-key", "test-model", {
    fetch: async (_input, init) => {
      observedSignal = init?.signal ?? null;
      return new Promise<Response>((_resolve, reject) => {
        observedSignal?.addEventListener("abort", () => reject(observedSignal?.reason), { once: true });
      });
    },
  });
  const pending = provider.embedBatch(["query"], "RETRIEVAL_QUERY", {
    signal: controller.signal,
    totalTimeoutMs: 2_000,
    attemptTimeoutMs: 2_000,
    maxAttempts: 1,
  });

  controller.abort(new Error("caller_cancelled"));
  await assert.rejects(pending, /caller_cancelled/);
  assert.equal(observedSignal?.aborted, true);
});


test("OpenRouter does not retry non-retryable or malformed responses", async () => {
  for (const response of [
    new Response("bad request", { status: 400 }),
    Response.json({ data: [] }),
  ]) {
    let attempts = 0;
    const provider = new OpenRouterEmbeddingProvider("test-key", "test-model", {
      fetch: async () => {
        attempts += 1;
        return response;
      },
    });

    await assert.rejects(
      provider.embedBatch(["query"], "RETRIEVAL_QUERY", {
        totalTimeoutMs: 500,
        attemptTimeoutMs: 100,
        maxAttempts: 3,
        backoffBaseMs: 1,
      })
    );
    assert.equal(attempts, 1);
  }
});
