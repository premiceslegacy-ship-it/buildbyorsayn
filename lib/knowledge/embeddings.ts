import { createHash } from "node:crypto";
import { GoogleGenAI } from "@google/genai";

export const EMBEDDING_DIMENSIONS = 768;
export const DEFAULT_EMBEDDING_TOTAL_TIMEOUT_MS = 14_000;
export const DEFAULT_EMBEDDING_ATTEMPT_TIMEOUT_MS = 4_000;
const BATCH_SIZE = 100;
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_BACKOFF_BASE_MS = 250;

export type EmbeddingRequestOptions = {
  totalTimeoutMs?: number;
  attemptTimeoutMs?: number;
  maxAttempts?: number;
  backoffBaseMs?: number;
  signal?: AbortSignal;
};

type ResolvedEmbeddingRequestOptions = {
  totalTimeoutMs: number;
  attemptTimeoutMs: number;
  maxAttempts: number;
  backoffBaseMs: number;
  signal?: AbortSignal;
};

export type EmbeddingTask = "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY";
export type EmbeddingConfig = {
  provider: "gemini" | "openrouter";
  model: string;
  dimensions: 768;
  normalization: "l2-v1";
};

type EmbeddingEnvironment = Record<string, string | undefined>;

export interface EmbeddingProvider {
  readonly config: EmbeddingConfig;
  embedBatch(
    texts: string[],
    taskType: EmbeddingTask,
    options?: EmbeddingRequestOptions
  ): Promise<number[][]>;
}

export function normalizeAndValidateEmbedding(values: unknown): number[] {
  if (!Array.isArray(values) || values.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(`Embedding must contain exactly ${EMBEDDING_DIMENSIONS} values.`);
  }
  if (!values.every((value) => typeof value === "number" && Number.isFinite(value))) {
    throw new Error("Embedding contains a non-finite value.");
  }

  const numericValues = values as number[];
  const norm = Math.sqrt(numericValues.reduce((sum, value) => sum + value * value, 0));
  if (!Number.isFinite(norm) || norm <= Number.EPSILON) {
    throw new Error("Embedding norm must be positive and finite.");
  }

  const normalized = numericValues.map((value) => value / norm);
  const normalizedNorm = Math.sqrt(normalized.reduce((sum, value) => sum + value * value, 0));
  if (Math.abs(normalizedNorm - 1) > 1e-9) {
    throw new Error("Embedding normalization failed.");
  }
  return normalized;
}

export function resolveEmbeddingConfig(env: EmbeddingEnvironment): EmbeddingConfig {
  const provider = env.KNOWLEDGE_EMBEDDING_PROVIDER;
  if (provider !== "gemini" && provider !== "openrouter") {
    throw new Error("KNOWLEDGE_EMBEDDING_PROVIDER must be explicitly set to gemini or openrouter.");
  }

  if (provider === "gemini") {
    if (!env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is required for Gemini embeddings.");
    return {
      provider,
      model: env.KNOWLEDGE_EMBEDDING_MODEL || "gemini-embedding-001",
      dimensions: EMBEDDING_DIMENSIONS,
      normalization: "l2-v1",
    };
  }

  if (!env.OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is required for OpenRouter embeddings.");
  }
  return {
    provider,
    model: env.KNOWLEDGE_EMBEDDING_MODEL || "openai/text-embedding-3-small",
    dimensions: EMBEDDING_DIMENSIONS,
    normalization: "l2-v1",
  };
}

export function embeddingFingerprint(config: EmbeddingConfig): string {
  return createHash("sha256")
    .update(JSON.stringify({
      provider: config.provider,
      model: config.model,
      dimensions: config.dimensions,
      normalization: config.normalization,
      taskStrategy: "document-query-v1",
    }))
    .digest("hex");
}

export class EmbeddingDeadlineError extends Error {
  constructor() {
    super("Embedding request exceeded its total deadline.");
    this.name = "EmbeddingDeadlineError";
  }
}

class EmbeddingResponseError extends Error {}

class EmbeddingHttpError extends Error {
  constructor(readonly status: number, provider: string) {
    super(`${provider} embeddings request failed with status ${status}.`);
  }
}

function positiveNumber(value: number | undefined, fallback: number, name: string): number {
  const resolved = value ?? fallback;
  if (!Number.isFinite(resolved) || resolved <= 0) {
    throw new Error(`${name} must be a positive finite number.`);
  }
  return resolved;
}

function resolveRequestOptions(options: EmbeddingRequestOptions = {}): ResolvedEmbeddingRequestOptions {
  const maxAttempts = positiveNumber(options.maxAttempts, DEFAULT_MAX_ATTEMPTS, "maxAttempts");
  if (!Number.isInteger(maxAttempts)) throw new Error("maxAttempts must be an integer.");
  const backoffBaseMs = options.backoffBaseMs ?? DEFAULT_BACKOFF_BASE_MS;
  if (!Number.isFinite(backoffBaseMs) || backoffBaseMs < 0) {
    throw new Error("backoffBaseMs must be a non-negative finite number.");
  }
  return {
    totalTimeoutMs: positiveNumber(
      options.totalTimeoutMs,
      DEFAULT_EMBEDDING_TOTAL_TIMEOUT_MS,
      "totalTimeoutMs"
    ),
    attemptTimeoutMs: positiveNumber(
      options.attemptTimeoutMs,
      DEFAULT_EMBEDDING_ATTEMPT_TIMEOUT_MS,
      "attemptTimeoutMs"
    ),
    maxAttempts,
    backoffBaseMs,
    signal: options.signal,
  };
}

function deadlineSignal(timeoutMs: number): { signal: AbortSignal; dispose: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new EmbeddingDeadlineError()), timeoutMs);
  return { signal: controller.signal, dispose: () => clearTimeout(timer) };
}

async function abortableSleep(ms: number, signal: AbortSignal): Promise<void> {
  if (signal.aborted) throw signal.reason;
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal.reason);
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function shouldRetryStatus(status: number): boolean {
  return status === 408 || status === 429 || status >= 500;
}

function errorStatus(error: unknown): number | null {
  if (!error || typeof error !== "object" || !("status" in error)) return null;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" && Number.isInteger(status) ? status : null;
}

function isRetryableError(error: unknown): boolean {
  if (error instanceof EmbeddingResponseError) return false;
  const status = error instanceof EmbeddingHttpError ? error.status : errorStatus(error);
  return status === null || shouldRetryStatus(status);
}

async function withRetries<T>(
  operation: (signal: AbortSignal, attemptTimeoutMs: number) => Promise<T>,
  options: ResolvedEmbeddingRequestOptions,
  totalSignal: AbortSignal,
  deadlineAt: number
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < options.maxAttempts; attempt += 1) {
    if (totalSignal.aborted) throw totalSignal.reason ?? new EmbeddingDeadlineError();
    if (Date.now() >= deadlineAt) throw new EmbeddingDeadlineError();
    const remainingMs = Math.max(1, deadlineAt - Date.now());
    const attemptDeadline = deadlineSignal(Math.min(options.attemptTimeoutMs, remainingMs));
    const signal = AbortSignal.any([totalSignal, attemptDeadline.signal]);
    try {
      return await operation(signal, Math.min(options.attemptTimeoutMs, remainingMs));
    } catch (error) {
      lastError = error;
      if (totalSignal.aborted) throw totalSignal.reason ?? new EmbeddingDeadlineError();
      if (Date.now() >= deadlineAt) throw new EmbeddingDeadlineError();
      if (!isRetryableError(error) || attempt === options.maxAttempts - 1) throw error;
      await abortableSleep(options.backoffBaseMs * 2 ** attempt, totalSignal);
    } finally {
      attemptDeadline.dispose();
    }
  }
  throw lastError;
}

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  private client: GoogleGenAI;
  readonly config: EmbeddingConfig;

  constructor(
    apiKey: string,
    model = "gemini-embedding-001",
    dependencies: { client?: GoogleGenAI } = {}
  ) {
    this.client = dependencies.client ?? new GoogleGenAI({ apiKey });
    this.config = {
      provider: "gemini",
      model,
      dimensions: EMBEDDING_DIMENSIONS,
      normalization: "l2-v1",
    };
  }

  async embedBatch(
    texts: string[],
    taskType: EmbeddingTask,
    requestOptions?: EmbeddingRequestOptions
  ): Promise<number[][]> {
    const options = resolveRequestOptions(requestOptions);
    const totalDeadline = deadlineSignal(options.totalTimeoutMs);
    const totalSignal = options.signal
      ? AbortSignal.any([options.signal, totalDeadline.signal])
      : totalDeadline.signal;
    const deadlineAt = Date.now() + options.totalTimeoutMs;
    const results: number[][] = [];
    try {
      for (let index = 0; index < texts.length; index += BATCH_SIZE) {
        const batch = texts.slice(index, index + BATCH_SIZE);
        results.push(...(await withRetries(
          (signal, attemptTimeoutMs) => this.embedOnce(batch, taskType, signal, attemptTimeoutMs),
          options,
          totalSignal,
          deadlineAt
        )));
      }
      return results;
    } finally {
      totalDeadline.dispose();
    }
  }

  private async embedOnce(
    batch: string[],
    taskType: EmbeddingTask,
    signal: AbortSignal,
    attemptTimeoutMs: number
  ): Promise<number[][]> {
    const response = await this.client.models.embedContent({
      model: this.config.model,
      contents: batch,
      config: {
        taskType,
        outputDimensionality: EMBEDDING_DIMENSIONS,
        abortSignal: signal,
        httpOptions: {
          timeout: attemptTimeoutMs,
          retryOptions: { attempts: 1 },
        },
      },
    });
    const embeddings = response.embeddings ?? [];
    if (embeddings.length !== batch.length) {
      throw new EmbeddingResponseError("Embedding provider returned an unexpected result count.");
    }
    try {
      return embeddings.map((embedding) => normalizeAndValidateEmbedding(embedding.values));
    } catch (error) {
      throw new EmbeddingResponseError("Embedding provider returned an invalid embedding.", {
        cause: error,
      });
    }
  }
}

export class OpenRouterEmbeddingProvider implements EmbeddingProvider {
  readonly config: EmbeddingConfig;
  private fetch: typeof fetch;

  constructor(
    private apiKey: string,
    model = "openai/text-embedding-3-small",
    dependencies: { fetch?: typeof fetch } = {}
  ) {
    this.fetch = dependencies.fetch ?? fetch;
    this.config = {
      provider: "openrouter",
      model,
      dimensions: EMBEDDING_DIMENSIONS,
      normalization: "l2-v1",
    };
  }

  async embedBatch(
    texts: string[],
    taskType: EmbeddingTask,
    requestOptions?: EmbeddingRequestOptions
  ): Promise<number[][]> {
    const options = resolveRequestOptions(requestOptions);
    const totalDeadline = deadlineSignal(options.totalTimeoutMs);
    const totalSignal = options.signal
      ? AbortSignal.any([options.signal, totalDeadline.signal])
      : totalDeadline.signal;
    const deadlineAt = Date.now() + options.totalTimeoutMs;
    const results: number[][] = [];
    try {
      for (let index = 0; index < texts.length; index += BATCH_SIZE) {
        const batch = texts.slice(index, index + BATCH_SIZE);
        results.push(...(await withRetries(
          (signal) => this.embedOnce(batch, taskType, signal),
          options,
          totalSignal,
          deadlineAt
        )));
      }
      return results;
    } finally {
      totalDeadline.dispose();
    }
  }

  private async embedOnce(
    batch: string[],
    taskType: EmbeddingTask,
    signal: AbortSignal
  ): Promise<number[][]> {
    const response = await this.fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.model,
        input: batch,
        dimensions: EMBEDDING_DIMENSIONS,
        input_type: taskType === "RETRIEVAL_DOCUMENT" ? "search_document" : "search_query",
      }),
      signal,
    });

    if (!response.ok) throw new EmbeddingHttpError(response.status, "OpenRouter");

    let payload: { data?: unknown };
    try {
      payload = (await response.json()) as { data?: unknown };
    } catch (error) {
      throw new EmbeddingResponseError("Embedding provider returned malformed JSON.", {
        cause: error,
      });
    }
    if (!Array.isArray(payload.data) || payload.data.length !== batch.length) {
      throw new EmbeddingResponseError("Embedding provider returned an unexpected result count.");
    }

    try {
      const indexed = payload.data.map((value) => {
        if (!value || typeof value !== "object") throw new Error("Invalid embedding result.");
        const item = value as { index?: unknown; embedding?: unknown };
        if (!Number.isInteger(item.index) || typeof item.index !== "number") {
          throw new Error("Invalid embedding result index.");
        }
        return { index: item.index, embedding: normalizeAndValidateEmbedding(item.embedding) };
      });
      const seen = new Set(indexed.map((item) => item.index));
      if (seen.size !== batch.length || indexed.some((item) => item.index < 0 || item.index >= batch.length)) {
        throw new Error("Embedding result indices are incomplete or duplicated.");
      }
      return indexed.sort((a, b) => a.index - b.index).map((item) => item.embedding);
    } catch (error) {
      throw new EmbeddingResponseError("Embedding provider returned invalid embedding data.", {
        cause: error,
      });
    }
  }
}

export function createEmbeddingProvider(env: EmbeddingEnvironment = process.env): EmbeddingProvider | null {
  let config: EmbeddingConfig;
  try {
    config = resolveEmbeddingConfig(env);
  } catch {
    return null;
  }

  if (config.provider === "gemini") {
    return new GeminiEmbeddingProvider(env.GEMINI_API_KEY!, config.model);
  }
  return new OpenRouterEmbeddingProvider(env.OPENROUTER_API_KEY!, config.model);
}
