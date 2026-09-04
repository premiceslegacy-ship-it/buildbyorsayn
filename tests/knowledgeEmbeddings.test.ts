import assert from "node:assert/strict";
import test from "node:test";
import {
  embeddingFingerprint,
  GeminiEmbeddingProvider,
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

test("embedding provider selection is explicit and never depends on key precedence", () => {
  assert.deepEqual(
    resolveEmbeddingConfig({ KNOWLEDGE_EMBEDDING_PROVIDER: "gemini", GEMINI_API_KEY: "present" }),
    {
      provider: "gemini",
      model: "gemini-embedding-001",
      dimensions: 768,
      normalization: "l2-v1",
    }
  );
  assert.throws(() =>
    resolveEmbeddingConfig({ GEMINI_API_KEY: "present", OPENROUTER_API_KEY: "present" })
  );
  assert.throws(() => resolveEmbeddingConfig({ KNOWLEDGE_EMBEDDING_PROVIDER: "openrouter" }));
});

test("embedding fingerprint changes with provider or model", () => {
  const gemini = embeddingFingerprint({
    provider: "gemini",
    model: "gemini-embedding-001",
    dimensions: 768,
    normalization: "l2-v1",
  });
  const openrouter = embeddingFingerprint({
    provider: "openrouter",
    model: "openai/text-embedding-3-small",
    dimensions: 768,
    normalization: "l2-v1",
  });
  assert.notEqual(gemini, openrouter);
  assert.match(gemini, /^[a-f0-9]{64}$/);
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

test("Gemini aborts stalled SDK calls and disables SDK retries per attempt", async () => {
  const configs: Array<Record<string, unknown>> = [];
  const fakeClient = {
    models: {
      embedContent: async ({ config }: { config: Record<string, unknown> }) => {
        configs.push(config);
        const signal = config.abortSignal as AbortSignal;
        return new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => reject(signal.reason), { once: true });
        });
      },
    },
  };
  const provider = new GeminiEmbeddingProvider("test-key", "test-model", {
    client: fakeClient as never,
  });

  await assert.rejects(
    provider.embedBatch(["query"], "RETRIEVAL_QUERY", {
      totalTimeoutMs: 80,
      attemptTimeoutMs: 20,
      maxAttempts: 5,
      backoffBaseMs: 10,
    }),
    /deadline/i
  );

  assert.ok(configs.length >= 1 && configs.length < 5);
  for (const config of configs) {
    assert.ok(config.abortSignal instanceof AbortSignal);
    const httpOptions = config.httpOptions as {
      timeout: number;
      retryOptions: { attempts: number };
    };
    assert.ok(httpOptions.timeout > 0 && httpOptions.timeout <= 20);
    assert.deepEqual(httpOptions.retryOptions, { attempts: 1 });
  }
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

test("Gemini does not retry non-retryable or malformed responses", async () => {
  const cases = [
    async () => {
      throw Object.assign(new Error("bad request"), { status: 400 });
    },
    async () => ({ embeddings: [] }),
  ];

  for (const embedContent of cases) {
    let attempts = 0;
    const provider = new GeminiEmbeddingProvider("test-key", "test-model", {
      client: {
        models: {
          embedContent: async () => {
            attempts += 1;
            return embedContent();
          },
        },
      } as never,
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
