import test from "node:test";
import assert from "node:assert/strict";
import * as publication from "../lib/doctrine/publication";
import { readFileSync } from "node:fs";

for (const response of [{ data: true, error: new Error("network") }, { data: null, error: null }, { data: "true", error: null }]) {
  test("ambiguous acquisition never begins publication", async () => {
    let writes = 0;
    await assert.rejects(() => publication.withDoctrinePublicationLock({ rpc: async () => response }, async () => { writes += 1; }));
    assert.equal(writes, 0);
  });
}

test("failed or timed-out writes keep the lock for operator recovery", async () => {
  const calls: string[] = [];
  const client = { rpc: async (name: string) => { calls.push(name); return { data: true, error: null }; } };
  await assert.rejects(() => publication.withDoctrinePublicationLock(client, async () => { throw new Error("ambiguous write"); }), /ambiguous write/);
  assert.deepEqual(calls, ["acquire_skill_publication_lock"]);
});

test("unverified release cannot produce a success result", async () => {
  const client = { rpc: async (name: string) => ({ data: name.startsWith("acquire"), error: null }) };
  await assert.rejects(() => publication.withDoctrinePublicationLock(client, async () => "published"), /release unverified/);
});

test("the CLI wraps Storage writes and their readbacks in the doctrine lock", () => {
  const script = readFileSync(new URL("../scripts/publish-doctrine.ts", import.meta.url), "utf8");
  assert.match(script, /await withDoctrinePublicationLock\(admin, async \(\) => \{/);
  assert.ok(script.indexOf("await withDoctrinePublicationLock(admin") < script.indexOf("await storage.upload("));
});

test("a competing doctrine publisher cannot begin storage writes", async () => {
  assert.equal(typeof publication.withDoctrinePublicationLock, "function");
  const calls: string[] = [];
  const client = { rpc: async (name: string) => {
    calls.push(name);
    return { data: false, error: null };
  } };
  await assert.rejects(() => publication.withDoctrinePublicationLock(client, async () => {
    calls.push("storage-write");
  }), /lock/i);
  assert.deepEqual(calls, ["acquire_skill_publication_lock"]);
});

test("successful doctrine publication releases only after the final verified readback", async () => {
  const calls: string[] = [];
  const tokens: string[] = [];
  const client = { rpc: async (name: string, args: { requested_lock_key: string; requested_lock_token: string }) => {
    assert.equal(args.requested_lock_key, "doctrine");
    tokens.push(args.requested_lock_token);
    calls.push(name);
    return { data: true, error: null };
  } };
  const result = await publication.withDoctrinePublicationLock(client, async () => {
    calls.push("storage-write", "verified-readback");
    return "verified";
  });
  assert.equal(result, "verified");
  assert.deepEqual(calls, ["acquire_skill_publication_lock", "storage-write", "verified-readback", "release_skill_publication_lock"]);
  assert.equal(tokens.length, 2);
  assert.equal(tokens[0], tokens[1]);
});
