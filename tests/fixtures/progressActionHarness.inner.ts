import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";

let authenticated = true;
let tier: string | null = "full";
const calls: Array<{ name: string; args: unknown }> = [];

const profileQuery = {
  select() { return profileQuery; },
  eq() { return profileQuery; },
  async maybeSingle() { return { data: { tier }, error: null }; },
};
const supabase = {
  auth: { getUser: async () => ({ data: { user: authenticated ? { id: "user-1" } : null } }) },
  from(name: string) { assert.equal(name, "profiles"); return profileQuery; },
  async rpc(name: string, args: unknown) {
    calls.push({ name, args });
    return { data: [1, 2], error: null };
  },
};

const file = (path: string) => pathToFileURL(resolve(path)).href;
mock.module(file("lib/supabase/server.ts"), {
  namedExports: { createClient: async () => supabase },
});
mock.module("next/cache", { namedExports: { revalidatePath: () => undefined } });

const { toggleBlocCompletion } = await import(file("app/actions/progress.ts"));

test("un identifiant absent du catalogue est refusé avant Supabase", async () => {
  calls.length = 0;
  assert.deepEqual(await toggleBlocCompletion(999), { success: false, completedBlocks: [] });
  assert.deepEqual(calls, []);
});

test("Fondations ne peut valider que le bloc 1", async () => {
  authenticated = true;
  tier = "beginner";
  calls.length = 0;
  assert.deepEqual(await toggleBlocCompletion(2), { success: false, completedBlocks: [] });
  assert.deepEqual(calls, []);
  assert.deepEqual(await toggleBlocCompletion(1), { success: true, completedBlocks: [1, 2] });
  assert.deepEqual(calls, [{ name: "toggle_block_progress", args: { p_bloc_id: 1 } }]);
});

test("LE COFFRE passe par une seule RPC atomique et une session absente est refusée", async () => {
  tier = "full";
  calls.length = 0;
  assert.deepEqual(await toggleBlocCompletion(7), { success: true, completedBlocks: [1, 2] });
  assert.deepEqual(calls, [{ name: "toggle_block_progress", args: { p_bloc_id: 7 } }]);
  authenticated = false;
  calls.length = 0;
  assert.deepEqual(await toggleBlocCompletion(1), { success: false, completedBlocks: [] });
  assert.deepEqual(calls, []);
});
