import assert from "node:assert/strict";
import test from "node:test";
import { readPublishedDoctrine, __resetDoctrineCacheForTests } from "../lib/doctrine/storage";

const encoder = new TextEncoder();
function streamResponse(chunks: Uint8Array[], headers: Record<string, string> = {}) {
  let cancelled = false;
  let pulls = 0;
  const response = new Response(new ReadableStream<Uint8Array>({
    pull(controller) { pulls++; const next = chunks.shift(); if (next) controller.enqueue(next); else controller.close(); },
    cancel() { cancelled = true; },
  }, { highWaterMark: 0 }), { headers });
  return { response, cancelled: () => cancelled, pulls: () => pulls };
}
async function withStorage(responses: Response[], run: (calls: RequestInit[]) => Promise<void>) {
  const originalFetch = globalThis.fetch;
  const oldUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const oldKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://storage.example.invalid";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-secret-never-leak";
  // Each test simulates a distinct remote state; the in-memory read cache
  // must never leak a previous test's result into this one.
  __resetDoctrineCacheForTests();
  const calls: RequestInit[] = [];
  globalThis.fetch = async (_input, init) => { calls.push(init ?? {}); const response = responses.shift(); if (!response) throw new Error("test-secret-never-leak"); return response; };
  try { await run(calls); } finally {
    globalThis.fetch = originalFetch;
    if (oldUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL; else process.env.NEXT_PUBLIC_SUPABASE_URL = oldUrl;
    if (oldKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = oldKey;
  }
}
const bucket = () => Response.json({ id: "skills", name: "skills", public: false });
test("oversized manifest is cancelled before consuming remaining chunks", async () => {
  const body = streamResponse([new Uint8Array(65537), encoder.encode("secret-tail")]);
  await withStorage([bucket(), body.response], async calls => {
    await assert.rejects(readPublishedDoctrine(), { message: "Published doctrine unavailable" });
    assert.equal(body.cancelled(), true);
    assert.equal(body.pulls(), 1);
    assert.equal(calls.length, 2);
  });
});


import { readBoundedResponse } from "../lib/doctrine/readbounded";
for (const length of ["1", "4", "bogus", "9007199254740992"]) {
  test(`reject deceptive content-length ${length}`, async () => {
    const body = streamResponse([encoder.encode("abc")], { "content-length": length });
    await assert.rejects(readBoundedResponse(body.response, 8), { message: "Published doctrine unavailable" });
    if (length !== "4") assert.equal(body.cancelled(), true);
  });
}
test("oversized declared length rejects without reading body", async () => {
  const body = streamResponse([encoder.encode("abc")], { "content-length": "9" });
  await assert.rejects(readBoundedResponse(body.response, 8));
  assert.equal(body.pulls(), 0);
  assert.equal(body.cancelled(), true);
});


test("shared byte budget counts actual bytes across responses", async () => {
  const budget = { remainingBytes: 5, deadline: performance.now() + 1000 };
  await readBoundedResponse(streamResponse([encoder.encode("abc")]).response, 8, budget);
  const body = streamResponse([encoder.encode("def"), encoder.encode("tail")]);
  await assert.rejects(readBoundedResponse(body.response, 8, budget));
  assert.equal(body.cancelled(), true);
  assert.equal(body.pulls(), 1);
});
test("expired total deadline rejects before reading another response", async () => {
  const body = streamResponse([encoder.encode("abc")]);
  await assert.rejects(readBoundedResponse(body.response, 8, { remainingBytes: 8, deadline: performance.now() - 1 }));
  assert.equal(body.pulls(), 0);
  assert.equal(body.cancelled(), true);
});


import { sha256 } from "../lib/doctrine/publication";
function manifestFor(contents: Uint8Array[]) {
  return { schemaVersion: 1, tier: "full", releaseId: "fixture", artifacts: contents.map((bytes, i) => ({ path: `file${i}.md`, bytes: bytes.length, sha256: sha256(bytes) })) };
}
test("stalled stream and never-resolving cancel cannot defeat deadline", async () => {
  let cancelled = false;
  const response = new Response(new ReadableStream({ pull() { return new Promise(() => {}); }, cancel() { cancelled = true; return new Promise(() => {}); } }));
  const result = await Promise.race([
    readBoundedResponse(response, 8, { remainingBytes: 8, deadline: performance.now() + 20 }).then(() => "accepted", () => "rejected"),
    new Promise(resolve => setTimeout(() => resolve("hung"), 100)),
  ]);
  assert.equal(result, "rejected");
  assert.equal(cancelled, true);
});
test("storage refuses aggregate published artifact sizes above 8MB before downloads", async () => {
  const manifest = manifestFor(Array.from({ length: 5 }, () => new Uint8Array(2_000_000).fill(65)));
  await withStorage([bucket(), Response.json(manifest)], async calls => {
    await assert.rejects(readPublishedDoctrine(), { message: "Published doctrine unavailable" });
    assert.equal(calls.length, 2);
  });
});


test("exact streamed UTF-8 artifacts succeed with no-store GETs and no redirect", async () => {
  const bytes = encoder.encode("doctrine é test");
  await withStorage([bucket(), Response.json(manifestFor([bytes])), streamResponse([bytes.slice(0, 10), bytes.slice(10)], { "content-length": String(bytes.length) }).response], async calls => {
    assert.deepEqual(await readPublishedDoctrine(), [{ path: "file0.md", content: "doctrine é test" }]);
    assert.equal(calls.length, 3);
    for (const call of calls) { assert.equal(call.cache, "no-store"); assert.equal(call.method, "GET"); assert.equal(call.redirect, "error"); assert.ok(call.signal?.aborted); }
  });
});
for (const header of [undefined, "1"]) {
  test(`artifact stream limited by published bytes with header ${header}`, async () => {
    const body = streamResponse([encoder.encode("abc"), encoder.encode("tail")], header ? { "content-length": header } : {});
    await withStorage([bucket(), Response.json(manifestFor([encoder.encode("a")])), body.response], async calls => {
      await assert.rejects(readPublishedDoctrine(), { message: "Published doctrine unavailable" });
      assert.equal(body.cancelled(), true); assert.equal(body.pulls(), 1); assert.equal(calls.length, 3);
    });
  });
}
test("published artifact above 2MB is refused without requesting it", async () => {
  const manifest = manifestFor([encoder.encode("a")]); manifest.artifacts[0].bytes = 2_000_001;
  await withStorage([bucket(), Response.json(manifest)], async calls => {
    await assert.rejects(readPublishedDoctrine(), { message: "Published doctrine unavailable" }); assert.equal(calls.length, 2);
  });
});
for (const bytes of [encoder.encode("b"), new Uint8Array([255])]) {
  test(`integrity or fatal UTF-8 failure remains sanitized (${bytes[0]})`, async () => {
    const expected = bytes[0] === 255 ? bytes : encoder.encode("a");
    await withStorage([bucket(), Response.json(manifestFor([expected])), streamResponse([bytes]).response], async () => {
      await assert.rejects(readPublishedDoctrine(), { message: "Published doctrine unavailable" });
    });
  });
}
test("error responses cancel bodies without reading or retrying", async () => {
  let cancelled = false; let pulls = 0;
  const response = new Response(new ReadableStream({ pull() { pulls++; }, cancel() { cancelled = true; } }, { highWaterMark: 0 }), { status: 503 });
  await withStorage([response], async calls => {
    await assert.rejects(readPublishedDoctrine(), { message: "Published doctrine unavailable" });
    assert.equal(calls.length, 1); assert.equal(pulls, 0); assert.equal(cancelled, true);
  });
});
test("transport error containing credentials is sanitized without retry", async () => {
  await withStorage([], async calls => {
    await assert.rejects(readPublishedDoctrine(), { message: "Published doctrine unavailable" }); assert.equal(calls.length, 1);
  });
});
test("cumulative deadline is not reset for each Storage response", async t => {
  let now = 0;
  t.mock.method(performance, "now", () => now);
  const bytes = encoder.encode("abc");
  const delayedBody = (content: Uint8Array) => new Response(new ReadableStream({
    start(controller) { controller.enqueue(content); controller.close(); }
  }));
  await withStorage([bucket(), Response.json(manifestFor([bytes])), delayedBody(bytes)], async calls => {
    const fetch = globalThis.fetch;
    globalThis.fetch = async (input, init) => { const response = await fetch(input, init); now += 4000; return response; };
    await assert.rejects(readPublishedDoctrine(), { message: "Published doctrine unavailable" });
    assert.equal(calls.length, 3);
  });
});
import { withinDoctrineReadDeadline } from "../lib/doctrine/readbounded";
test("deadline includes a transport that never returns headers", async () => {
  await assert.rejects(withinDoctrineReadDeadline(() => new Promise(() => {}), { remainingBytes: 8, deadline: performance.now() + 20 }), { message: "Published doctrine unavailable" });
});
test("browser runtime guard rejects before any request", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { value: {}, configurable: true });
  try {
    await withStorage([], async calls => { await assert.rejects(readPublishedDoctrine(), { message: "Server runtime required" }); assert.equal(calls.length, 0); });
  } finally {
    if (descriptor) Object.defineProperty(globalThis, "window", descriptor);
    else Reflect.deleteProperty(globalThis, "window");
  }
});


test("manifest exactly 64KiB and artifact exactly 2MB are accepted", async () => {
  const bytes = new Uint8Array(2_000_000).fill(65);
  const manifest = encoder.encode(JSON.stringify(manifestFor([bytes])).padEnd(65536, " "));
  await withStorage([bucket(), streamResponse([manifest]).response, streamResponse([bytes]).response], async () => {
    const files = await readPublishedDoctrine(); assert.equal(files[0].content.length, 2_000_000);
  });
});
test("manifest parse errors cannot expose remote text", async () => {
  await withStorage([bucket(), new Response("test-secret-never-leak")], async () => {
    await assert.rejects(readPublishedDoctrine(), { message: "Published doctrine unavailable" });
  });
});
test("public bucket fails before manifest request", async () => {
  await withStorage([Response.json({ public: true })], async calls => {
    await assert.rejects(readPublishedDoctrine(), { message: "Published doctrine unavailable" }); assert.equal(calls.length, 1);
  });
});
test("many small chunks share one bounded output allocation", async () => {
  const bytes = await readBoundedResponse(streamResponse(Array.from({ length: 1024 }, () => new Uint8Array([65]))).response, 1024);
  assert.equal(bytes.length, 1024); assert.ok(bytes.every(value => value === 65));
});

test("unchanged v1 reader accepts all 18 approved artifacts with exact hashes", async () => {
  const { DOCTRINE_INVENTORIES } = await import("../lib/doctrine/inventory");
  const { sha256 } = await import("../lib/doctrine/publication");
  const names = DOCTRINE_INVENTORIES["agentique-v1"];
  const bytes = names.map(name => encoder.encode(`# Synthetic ${name}\n`));
  const manifest = { schemaVersion: 1, tier: "full", releaseId: "corpus18", artifacts: names.map((path, i) => ({ path, bytes: bytes[i].length, sha256: sha256(bytes[i]) })) };
  await withStorage([bucket(), Response.json(manifest), ...bytes.map(b => streamResponse([b]).response)], async calls => {
    const files = await readPublishedDoctrine();
    assert.deepEqual(files.map(f => f.path), [...names]);
    assert.equal(calls.length, 20);
  });
});
