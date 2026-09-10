// Synthetic transport for the real publisher child process. Never delegates to network.
import { writeFileSync } from 'node:fs';
let now = 0;
if (process.env.PUBLISH_TEST_MODE === "deadline-after-pointer") Object.defineProperty(performance, "now", { value: () => now });
const objects = new Map();
const log = { calls: [], pulls: 0, cancelled: false };
process.on('exit', () => writeFileSync(process.env.PUBLISH_TEST_LOG, JSON.stringify(log)));
globalThis.fetch = async (input, init = {}) => {
  const url = new URL(typeof input === 'string' ? input : input.url ?? String(input));
  if (url.origin !== 'https://publisher.invalid') throw new Error('Network forbidden');
  const path = url.pathname;
  const method = init.method ?? 'GET';
  log.calls.push({ path, method, cache: init.cache, redirect: init.redirect });
  if (path.includes('/rpc/')) return Response.json(true);
  if (path === '/storage/v1/bucket/skills') return Response.json({ public: false });
  if (!path.startsWith('/storage/v1/object/skills/')) throw new Error('Unexpected request');
  if (method !== 'GET') {
    objects.set(path, Buffer.from(init.body));
    if (process.env.PUBLISH_TEST_MODE === "deadline-after-pointer" && path.endsWith("manifest.json")) now = 120001;
    return Response.json({ Key: path });
  }
  const bytes = objects.get(path);
  if (!bytes) return new Response(null, { status: 404 });
  let chunks = [bytes.subarray(0, 2), bytes.subarray(2)];
  let headers = {};
  if (process.env.PUBLISH_TEST_MODE === 'overflow') chunks = [Buffer.alloc(bytes.length + 1, 65), Buffer.from('unread-tail')];
  if (process.env.PUBLISH_TEST_MODE === 'manifest-overflow' && path.endsWith('manifest.json')) chunks = [Buffer.alloc(65537), Buffer.from('unread-tail')];
  if (process.env.PUBLISH_TEST_MODE === 'bad-length') headers = { 'content-length': 'bogus' };
  return new Response(new ReadableStream({
    pull(controller) { log.pulls++; const chunk = chunks.shift(); if (chunk) controller.enqueue(chunk); else controller.close(); },
    cancel() { log.cancelled = true; },
  }, { highWaterMark: 0 }), { headers });
};
