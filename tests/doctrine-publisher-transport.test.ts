import assert from "node:assert/strict";
import test from "node:test";
import { createDoctrinePublisherTransport } from "../lib/doctrine/publishertransport";
import { DOCTRINE_MANIFEST_MAX_BYTES } from "../lib/doctrine/readbounded";
import { parseDoctrineManifest, doctrineArtifactPath, withDoctrinePublicationLock } from "../lib/doctrine/publication";
const manifest = (size = 800_000, count = 9) => parseDoctrineManifest({ schemaVersion: 1, tier: "full", releaseId: "fixture", artifacts: Array.from({ length: count }, (_, i) => ({ path: `file${i}.md`, bytes: size, sha256: "a".repeat(64) })) });
function body(size: number, headers: Record<string, string> = {}) {
  let pulls = 0; let cancelled = false;
  return { response: new Response(new ReadableStream<Uint8Array>({
    pull(c) { if (pulls++ === 0) c.enqueue(new Uint8Array(size).fill(65)); else c.close(); },
    cancel() { cancelled = true; },
  }, { highWaterMark: 0 }), { headers }), pulls: () => pulls, cancelled: () => cancelled };
}

test("publisher shared budget permits all 27 maximum artifacts and controls, rejects cumulative overflow", async () => {
  const m = manifest();
  let size = DOCTRINE_MANIFEST_MAX_BYTES; let completed = 0;
  const client = createDoctrinePublisherTransport("https://publisher.invalid", "fixture", m, { fetch: async () => body(size).response });
  await assert.rejects(client.run(async () => {
    for (let i = 0; i < 13; i++) await client.fetch("https://publisher.invalid/control");
    await client.download("doctrine/v1/manifest.json");
    size = 800_000;
    for (let pass = 0; pass < 3; pass++) for (const artifact of m.artifacts) {
      assert.equal((await client.download(doctrineArtifactPath(m, artifact.path))).length, 800_000); completed++;
    }
    await client.download(doctrineArtifactPath(m, m.artifacts[0].path));
  }));
  assert.equal(completed, 27);
});

for (const length of [undefined, "1", "800001", "bogus", "9007199254740992"]) test(`publisher bounds synthetic artifact stream with content-length ${length}`, async () => {
  const m = manifest(); const b = body(800_001, length ? { "content-length": length } : {});
  const client = createDoctrinePublisherTransport("https://publisher.invalid", "fixture", m, { fetch: async () => b.response });
  await assert.rejects(client.run(() => client.download(doctrineArtifactPath(m, m.artifacts[0].path))));
  assert.equal(b.cancelled(), true);
  assert.equal(b.pulls(), length && length !== "1" ? 0 : 1);
});

test("SDK control responses are bounded before parsing", async () => {
  const b = body(DOCTRINE_MANIFEST_MAX_BYTES + 1);
  const client = createDoctrinePublisherTransport("https://publisher.invalid", "fixture", manifest(), { fetch: async () => b.response });
  await assert.rejects(client.run(() => client.fetch("https://publisher.invalid")));
  assert.equal(b.cancelled(), true); assert.equal(b.pulls(), 1);
});

test("one absolute deadline spans multiple requests rather than resetting", async t => {
  let now = 0; let calls = 0;
  t.mock.method(performance, "now", () => now);
  const m = manifest(4);
  const client = createDoctrinePublisherTransport("https://publisher.invalid", "fixture", m, { timeoutMs: 100, fetch: async () => { calls++; now += 40; return body(4).response; } });
  await assert.rejects(client.run(async () => { for (const artifact of m.artifacts) await client.download(doctrineArtifactPath(m, artifact.path)); }));
  assert.equal(calls, 3);
});

test("global publication deadline bounds non-transport waits and blocks late writes and release", async () => {
  let resume!: () => void; let requests = 0; const rpc: string[] = [];
  const client = createDoctrinePublisherTransport("https://publisher.invalid", "fixture", manifest(), { timeoutMs: 40, fetch: async () => { requests++; return Response.json(true); } });
  const lock = { rpc: async (name: string) => { rpc.push(name); return { data: true, error: null }; } };
  await assert.rejects(client.run(() => withDoctrinePublicationLock(lock, async () => {
    await new Promise<void>(resolve => { resume = resolve; });
    await client.fetch("https://publisher.invalid", { method: "POST" });
  })));
  resume(); await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests, 0); assert.deepEqual(rpc, ["acquire_skill_publication_lock"]);
});

test("stalled stream cancels without awaiting a stalled cancel", async () => {
  let cancelled = false;
  const response = new Response(new ReadableStream({ pull() { return new Promise(() => {}); }, cancel() { cancelled = true; return new Promise(() => {}); } }, { highWaterMark: 0 }));
  const client = createDoctrinePublisherTransport("https://publisher.invalid", "fixture", manifest(), { timeoutMs: 40, fetch: async () => response });
  await assert.rejects(client.run(() => client.download("doctrine/v1/manifest.json")));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(cancelled, true);
});

test("late headers after timeout are cancelled and cannot resume publication", async () => {
  let deliver!: (response: Response) => void; let signal: AbortSignal | undefined;
  const client = createDoctrinePublisherTransport("https://publisher.invalid", "fixture", manifest(), { timeoutMs: 40, fetch: async (_input, init) => { signal = init?.signal as AbortSignal; return new Promise<Response>(resolve => { deliver = resolve; }); } });
  await assert.rejects(client.run(() => client.download("doctrine/v1/manifest.json")));
  assert.equal(signal?.aborted, true);
  const b = body(4); deliver(b.response); await new Promise(resolve => setImmediate(resolve));
  assert.equal(b.cancelled(), true); assert.equal(b.pulls(), 0);
});

test("publisher refuses an app-incompatible corpus before any network", () => {
  let calls = 0;
  assert.throws(() => createDoctrinePublisherTransport("https://publisher.invalid", "fixture", manifest(2_000_000), { fetch: async () => { calls++; return Response.json(true); } }));
  assert.equal(calls, 0);
});

test("18-file shared budget permits exactly three passes and N+5 controls", async () => {
  const m = manifest(400_000, 18);
  let size = DOCTRINE_MANIFEST_MAX_BYTES; let completed = 0;
  const client = createDoctrinePublisherTransport("https://publisher.invalid", "fixture", m, { fetch: async () => body(size).response });
  await assert.rejects(client.run(async () => {
    for (let i = 0; i < 22; i++) await client.fetch("https://publisher.invalid/control");
    await client.download("doctrine/v1/manifest.json");
    size = 400_000;
    for (let pass = 0; pass < 3; pass++) for (const artifact of m.artifacts) {
      assert.equal((await client.download(doctrineArtifactPath(m, artifact.path))).length, size); completed++;
    }
    await client.download(doctrineArtifactPath(m, m.artifacts[0].path));
  }));
  assert.equal(completed, 54);
});
