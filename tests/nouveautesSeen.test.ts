import assert from "node:assert/strict";
import test from "node:test";
import { formatNouveautesBadge, isNewVideo, markNouveautesSeen, readNouveautesSeenAt } from "../lib/nouveautes/seen";

test("isNewVideo is strict: only videos published after the last visit are new", () => {
  assert.equal(isNewVideo("2026-10-10T10:00:00Z", "2026-10-10T09:59:59Z"), true);
  assert.equal(isNewVideo("2026-10-10T10:00:00Z", "2026-10-10T10:00:00Z"), false);
  assert.equal(isNewVideo("2026-10-09T10:00:00Z", "2026-10-10T10:00:00Z"), false);
  assert.equal(isNewVideo("garbage", "2026-10-10T10:00:00Z"), false);
});

test("formatNouveautesBadge hides zero and unknown counts and caps at 9+", () => {
  assert.equal(formatNouveautesBadge(null), null);
  assert.equal(formatNouveautesBadge(0), null);
  assert.equal(formatNouveautesBadge(1), "1");
  assert.equal(formatNouveautesBadge(9), "9");
  assert.equal(formatNouveautesBadge(10), "9+");
  assert.equal(formatNouveautesBadge(400), "9+");
});

function fakeSupabase(row: { seen_at: string } | null, error: Error | null = null) {
  const writes: unknown[] = [];
  const client = {
    from(table: string) {
      assert.equal(table, "member_nouveautes_seen");
      return {
        select: () => ({ eq: (column: string, value: string) => { assert.deepEqual([column, value], ["user_id", "u1"]); return { maybeSingle: async () => ({ data: row, error }) }; } }),
        upsert: async (value: unknown, options: unknown) => { writes.push({ value, options }); return { error }; },
      };
    },
  };
  return { client: client as never, writes };
}

test("readNouveautesSeenAt falls back to the account creation date for first-time visitors", async () => {
  const user = { id: "u1", created_at: "2026-01-01T00:00:00Z" };
  assert.equal(await readNouveautesSeenAt(fakeSupabase(null).client, user), "2026-01-01T00:00:00Z");
  assert.equal(await readNouveautesSeenAt(fakeSupabase({ seen_at: "2026-10-01T00:00:00Z" }).client, user), "2026-10-01T00:00:00Z");
  await assert.rejects(readNouveautesSeenAt(fakeSupabase(null, new Error("rls")).client, user), /rls/);
});

test("markNouveautesSeen upserts the caller's own row keyed on user_id", async () => {
  const { client, writes } = fakeSupabase(null);
  await markNouveautesSeen(client, "u1", new Date("2026-10-19T12:00:00Z"));
  assert.deepEqual(writes, [{ value: { user_id: "u1", seen_at: "2026-10-19T12:00:00.000Z" }, options: { onConflict: "user_id" } }]);
});
