import assert from "node:assert/strict";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";

let user: { id: string; email: string; user_metadata: Record<string, unknown>; app_metadata: Record<string, unknown> } | null = null;
let tier: string | null = null;
let profileReads = 0;

const query = {
  select() { return query; },
  eq() { return query; },
  async maybeSingle() {
    profileReads += 1;
    return { data: { tier }, error: null };
  },
};
const supabase = {
  auth: { getUser: async () => ({ data: { user }, error: null }) },
  from(name: string) { assert.equal(name, "profiles"); return query; },
};
const file = (path: string) => pathToFileURL(resolve(path)).href;
mock.module(file("lib/supabase/server.ts"), {
  namedExports: { createClient: async () => supabase },
});
mock.module("next/navigation", {
  namedExports: {
    redirect: (destination: string) => {
      throw new Error(`REDIRECT:${destination}`);
    },
  },
});

const { requirePageAccess } = await import(file("lib/auth/paidPageAccess.server.ts"));

test("une session absente repart vers la connexion sans lecture du profil", async () => {
  user = null;
  profileReads = 0;
  await assert.rejects(
    requirePageAccess("full", "/intro"),
    /REDIRECT:\/login\?next=%2Fintro/,
  );
  assert.equal(profileReads, 0);
});

test("les paliers sont vérifiés à nouveau dans le Server Component", async () => {
  user = { id: "user-1", email: "member@example.com", user_metadata: {}, app_metadata: {} };
  tier = "free";
  await assert.rejects(requirePageAccess("beginner", "/sources"), /REDIRECT:\/checkout/);
  tier = "beginner";
  await assert.rejects(requirePageAccess("full", "/intro"), /REDIRECT:\/checkout/);
  const identity = await requirePageAccess("beginner", "/sources");
  assert.equal(identity.tier, "beginner");
  assert.equal(identity.user.id, "user-1");
});
