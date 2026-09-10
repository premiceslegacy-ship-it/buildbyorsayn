// Binary counterpart of lib/mcp/http.ts: check before retention, cancel without waiting.
export const DOCTRINE_MANIFEST_MAX_BYTES = 64 * 1024;
export const DOCTRINE_TOTAL_MAX_BYTES = 8_000_000;
export const DOCTRINE_READ_TIMEOUT_MS = 10_000;
export type DoctrineReadBudget = { remainingBytes: number; deadline: number };
const unavailable = () => new Error("Published doctrine unavailable");

// Absolute monotonic deadline is shared by fetch headers and every body read.
export async function withinDoctrineReadDeadline<T>(operation: () => Promise<T>, budget: DoctrineReadBudget): Promise<T> {
  const remaining = budget.deadline - performance.now();
  if (!Number.isFinite(remaining) || remaining <= 0) throw unavailable();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation(),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(unavailable()), remaining); }),
    ]);
  } finally { if (timer !== undefined) clearTimeout(timer); }
}

export async function readBoundedResponse(
  response: Response, maxBytes: number,
  budget: DoctrineReadBudget = { remainingBytes: DOCTRINE_TOTAL_MAX_BYTES, deadline: performance.now() + DOCTRINE_READ_TIMEOUT_MS },
): Promise<Uint8Array> {
  const reader = response.body?.getReader();
  let total = 0;
  try {
    if (!response.ok || !reader || !Number.isSafeInteger(maxBytes) || maxBytes < 0 ||
        !Number.isSafeInteger(budget.remainingBytes) || budget.remainingBytes < 0 ||
        !Number.isFinite(budget.deadline) || performance.now() >= budget.deadline) throw unavailable();
    const raw = response.headers.get("content-length");
    const declared = raw === null ? undefined : Number(raw);
    if (raw !== null && (!/^\d+$/.test(raw) || !Number.isSafeInteger(declared) || declared! > Math.min(maxBytes, budget.remainingBytes))) throw unavailable();
    // One bounded allocation also prevents per-chunk object overhead on tiny chunks.
    const result = new Uint8Array(Math.min(maxBytes, declared ?? maxBytes, budget.remainingBytes));
    while (true) {
      if (performance.now() >= budget.deadline) throw unavailable();
      const { done, value } = await withinDoctrineReadDeadline(() => reader.read(), budget);
      if (performance.now() >= budget.deadline) throw unavailable();
      if (done) break;
      if (value.byteLength > Math.min(maxBytes - total, (declared ?? maxBytes) - total, budget.remainingBytes)) throw unavailable();
      result.set(value, total);
      total += value.byteLength;
      budget.remainingBytes -= value.byteLength;
    }
    if (declared !== undefined && total !== declared) throw unavailable();
    return result.subarray(0, total);
  } catch {
    if (reader) void reader.cancel().catch(() => undefined);
    throw unavailable();
  } finally { reader?.releaseLock(); }
}
