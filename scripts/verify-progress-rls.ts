import { createClient, type User } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

loadEnv({ path: ".env.local", quiet: true });

const outputPath = path.join(
  process.cwd(),
  "product/accompagnement-site-web/visual-qa/rls-runtime-verification.json"
);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !anonKey || !serviceKey) {
  throw new Error("Supabase verification environment is incomplete.");
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

async function listHermesFixtures() {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return (data.users as User[]).filter(
    (user) =>
      user.email?.startsWith("hermes-rls-") ||
      user.email?.startsWith("hermes-browser-")
  );
}

async function cleanupUsers(users: User[]) {
  if (!users.length) return;
  const ids = users.map((user) => user.id);
  for (const table of ["member_activity_events", "member_presence", "progress"]) {
    const { error } = await admin.from(table).delete().in("user_id", ids);
    if (error) throw new Error(`${table}: ${error.message}`);
  }
  const profileByUserId = await admin.from("profiles").delete().in("user_id", ids);
  if (profileByUserId.error) {
    const profileById = await admin.from("profiles").delete().in("id", ids);
    if (profileById.error) throw new Error(`profiles: ${profileById.error.message}`);
  }
  for (const user of users) {
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw new Error(`auth cleanup: ${error.message}`);
  }
}

async function main() {
  await cleanupUsers(await listHermesFixtures());

  const stamp = Date.now();
  const password = `Hermes-${stamp}-Aa9!`;
  const itemId = `hermes-rls-${stamp}`;
  const users: User[] = [];
  const checks: Record<string, boolean | number> = {};
  let verdict: "PASS" | "FAIL" = "FAIL";
  let failure: string | null = null;

  try {
    for (const suffix of ["a", "b"]) {
      const { data, error } = await admin.auth.admin.createUser({
        email: `hermes-rls-${stamp}-${suffix}@example.invalid`,
        password,
        email_confirm: true,
      });
      if (error || !data.user) throw error ?? new Error("Fixture creation failed.");
      users.push(data.user);
    }

    const clientA = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const clientB = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const loginA = await clientA.auth.signInWithPassword({ email: users[0].email!, password });
    const loginB = await clientB.auth.signInWithPassword({ email: users[1].email!, password });
    if (loginA.error || loginB.error) throw loginA.error ?? loginB.error;

    const ownInsert = await clientA.from("progress").insert({
      user_id: users[0].id,
      module_id: "hermes-rls-verification",
      item_id: itemId,
    });
    checks.ownInsert = !ownInsert.error;

    const ownSelect = await clientA
      .from("progress")
      .select("item_id")
      .eq("user_id", users[0].id)
      .eq("item_id", itemId);
    checks.ownSelectCount = ownSelect.data?.length ?? -1;

    const crossSelect = await clientB
      .from("progress")
      .select("item_id")
      .eq("user_id", users[0].id)
      .eq("item_id", itemId);
    checks.crossSelectCount = crossSelect.data?.length ?? -1;

    const crossInsert = await clientB.from("progress").insert({
      user_id: users[0].id,
      module_id: "hermes-rls-verification",
      item_id: `${itemId}-cross`,
    });
    checks.crossInsertDenied = Boolean(crossInsert.error);

    const crossDelete = await clientB
      .from("progress")
      .delete({ count: "exact" })
      .eq("user_id", users[0].id)
      .eq("item_id", itemId);
    checks.crossDeleteCount = crossDelete.count ?? -1;

    const stillExists = await clientA
      .from("progress")
      .select("item_id")
      .eq("user_id", users[0].id)
      .eq("item_id", itemId);
    checks.rowStillExistsAfterCrossDelete = (stillExists.data?.length ?? 0) === 1;

    const ownDelete = await clientA
      .from("progress")
      .delete({ count: "exact" })
      .eq("user_id", users[0].id)
      .eq("item_id", itemId);
    checks.ownDeleteCount = ownDelete.count ?? -1;

    verdict =
      checks.ownInsert === true &&
      checks.ownSelectCount === 1 &&
      checks.crossSelectCount === 0 &&
      checks.crossInsertDenied === true &&
      checks.crossDeleteCount === 0 &&
      checks.rowStillExistsAfterCrossDelete === true &&
      checks.ownDeleteCount === 1
        ? "PASS"
        : "FAIL";
  } catch (error) {
    failure = error instanceof Error ? error.message : String(error);
  } finally {
    await cleanupUsers(users);
  }

  const remainingFixtures = (await listHermesFixtures()).length;
  if (remainingFixtures !== 0) verdict = "FAIL";

  const report = {
    verdict,
    verifiedAt: new Date().toISOString(),
    migration: "20260830052000_progress_rls.sql",
    checks,
    failure,
    fixtureCleanup: {
      temporaryUsersRemaining: remainingFixtures,
    },
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report, null, 2));
  if (verdict !== "PASS") process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
