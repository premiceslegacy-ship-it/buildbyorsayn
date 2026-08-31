import { createClient, type User } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

loadEnv({ path: ".env.local", quiet: true });

const outputPath = path.join(
  process.cwd(),
  "product/accompagnement-site-web/visual-qa/accompaniment-access-runtime-verification.json"
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

function safeMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replaceAll(serviceKey, "[REDACTED]")
    .replaceAll(anonKey, "[REDACTED]")
    .replaceAll(supabaseUrl, "[REDACTED]");
}

async function listFixtures() {
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return (data.users as User[]).filter((user) => user.email?.startsWith("hermes-accomp-"));
}

async function cleanupUsers(users: User[]) {
  if (!users.length) return;
  const ids = users.map((user) => user.id);
  for (const table of ["accompaniment_assignments", "member_activity_events", "member_presence", "progress"]) {
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
  await cleanupUsers(await listFixtures());

  const stamp = Date.now();
  const password = `Hermes-${stamp}-Aa9!`;
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const users: User[] = [];
  const checks: Record<string, boolean | number> = {};
  const diagnostics: Record<string, string> = {};
  let verdict: "PASS" | "FAIL" = "FAIL";
  let failure: string | null = null;
  let cleanupFailure: string | null = null;

  try {
    for (const suffix of ["a", "b"]) {
      const { data, error } = await admin.auth.admin.createUser({
        email: `hermes-accomp-${stamp}-${suffix}@example.invalid`,
        password,
        email_confirm: true,
      });
      if (error || !data.user) throw error ?? new Error("Fixture creation failed.");
      users.push(data.user);
    }

    const assignmentInsert = await admin.from("accompaniment_assignments").upsert([
      {
        user_id: users[0].id,
        accompaniment_slug: "site-web",
        track: "debutant",
        theme_ids: ["diagnostic", "business-copy"],
        status: "active",
        starts_on: yesterday,
        ends_on: tomorrow,
        notes: "Runtime access fixture",
      },
      {
        user_id: users[1].id,
        accompaniment_slug: "site-web",
        track: "experimente",
        theme_ids: ["diagnostic"],
        status: "planned",
        starts_on: yesterday,
        ends_on: tomorrow,
        notes: "Runtime planned fixture",
      },
    ], { onConflict: "user_id,accompaniment_slug" });
    if (assignmentInsert.error) throw assignmentInsert.error;

    const assignmentLookup = await admin
      .from("accompaniment_assignments")
      .select("id, user_id")
      .in("user_id", users.map((user) => user.id))
      .eq("accompaniment_slug", "site-web");
    if (assignmentLookup.error) throw assignmentLookup.error;
    const assignmentIdByUser = new Map(
      (assignmentLookup.data ?? []).map((row) => [row.user_id as string, row.id as string])
    );
    const activeAssignmentId = assignmentIdByUser.get(users[0].id);
    const plannedAssignmentId = assignmentIdByUser.get(users[1].id);
    if (!activeAssignmentId || !plannedAssignmentId) throw new Error("Assignment fixture lookup failed.");

    const clientA = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const clientB = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
    const loginA = await clientA.auth.signInWithPassword({ email: users[0].email!, password });
    const loginB = await clientB.auth.signInWithPassword({ email: users[1].email!, password });
    if (loginA.error || loginB.error) throw loginA.error ?? loginB.error;

    const ownAssignmentA = await clientA
      .from("accompaniment_assignments")
      .select("id")
      .eq("user_id", users[0].id)
      .eq("accompaniment_slug", "site-web");
    const plannedAssignmentB = await clientB
      .from("accompaniment_assignments")
      .select("id")
      .eq("user_id", users[1].id)
      .eq("accompaniment_slug", "site-web");
    const crossAssignmentB = await clientB
      .from("accompaniment_assignments")
      .select("id")
      .eq("user_id", users[0].id)
      .eq("accompaniment_slug", "site-web");

    checks.activeMemberSeesOwnAssignment = (ownAssignmentA.data?.length ?? 0) === 1;
    checks.plannedMemberSeesNoAssignment = (plannedAssignmentB.data?.length ?? 0) === 0;
    checks.crossMemberSeesNoAssignment = (crossAssignmentB.data?.length ?? 0) === 0;

    const ownInsert = await clientA.from("progress").insert({
      user_id: users[0].id,
      module_id: "web-accompagnement",
      item_id: "web-theme-diagnostic",
    });
    checks.activeMemberCanSaveOwnTheme = !ownInsert.error;

    const plannedOwnInsert = await clientB.from("progress").insert({
      user_id: users[1].id,
      module_id: "web-accompagnement",
      item_id: "web-theme-planned-own",
    });
    checks.plannedMemberCannotSaveOwnTheme = Boolean(plannedOwnInsert.error);

    const crossInsert = await clientB.from("progress").insert({
      user_id: users[0].id,
      module_id: "web-accompagnement",
      item_id: "web-theme-cross-user",
    });
    checks.crossMemberCannotSaveOwnTheme = Boolean(crossInsert.error);

    const crossSelect = await clientB
      .from("progress")
      .select("item_id")
      .eq("user_id", users[0].id)
      .eq("module_id", "web-accompagnement");
    checks.crossMemberSeesNoProgress = (crossSelect.data?.length ?? 0) === 0;

    const ownContextUpsert = await clientA.from("accompaniment_workspace_context").upsert({
      assignment_id: activeAssignmentId,
      company: "Fixture active",
      project: "Projet partagé",
      site_url: "https://example.com",
      shared_notes: "Note membre",
      updated_by: users[0].id,
    });
    checks.activeMemberCanSaveSharedContext = !ownContextUpsert.error;
    if (ownContextUpsert.error) {
      diagnostics.activeMemberSharedContext = safeMessage(JSON.stringify({
        code: ownContextUpsert.error.code,
        message: ownContextUpsert.error.message,
        details: ownContextUpsert.error.details,
        hint: ownContextUpsert.error.hint,
      }));
    }

    const contextBeforeImmutableProbe = await admin
      .from("accompaniment_workspace_context")
      .select("assignment_id, created_at")
      .eq("assignment_id", activeAssignmentId)
      .maybeSingle();
    if (contextBeforeImmutableProbe.error || !contextBeforeImmutableProbe.data) {
      throw contextBeforeImmutableProbe.error ?? new Error("Context immutable probe setup failed.");
    }
    const immutableUpdate = await clientA
      .from("accompaniment_workspace_context")
      .update({
        assignment_id: plannedAssignmentId,
        created_at: "2000-01-01T00:00:00.000Z",
        updated_by: users[0].id,
      })
      .eq("assignment_id", activeAssignmentId)
      .select("assignment_id, created_at")
      .maybeSingle();
    checks.memberCannotChangeImmutableContextColumns =
      !immutableUpdate.error &&
      immutableUpdate.data?.assignment_id === activeAssignmentId &&
      immutableUpdate.data?.created_at === contextBeforeImmutableProbe.data.created_at;

    const activeDelete = await clientA
      .from("accompaniment_workspace_context")
      .delete()
      .eq("assignment_id", activeAssignmentId)
      .select("assignment_id");
    const contextAfterDeleteProbe = await admin
      .from("accompaniment_workspace_context")
      .select("assignment_id")
      .eq("assignment_id", activeAssignmentId)
      .maybeSingle();
    checks.activeMemberCannotDeleteSharedContext =
      (Boolean(activeDelete.error) || (activeDelete.data?.length ?? 0) === 0) &&
      contextAfterDeleteProbe.data?.assignment_id === activeAssignmentId;

    const plannedContextUpsert = await clientB.from("accompaniment_workspace_context").upsert({
      assignment_id: plannedAssignmentId,
      company: "Fixture planifiée",
      project: "Projet fermé",
      site_url: "",
      shared_notes: "Ne doit pas passer",
      updated_by: users[1].id,
    });
    checks.plannedMemberCannotSaveSharedContext = Boolean(plannedContextUpsert.error);

    const crossContextSelect = await clientB
      .from("accompaniment_workspace_context")
      .select("assignment_id")
      .eq("assignment_id", activeAssignmentId);
    checks.crossMemberSeesNoSharedContext = (crossContextSelect.data?.length ?? 0) === 0;

    const crossContextUpsert = await clientB.from("accompaniment_workspace_context").upsert({
      assignment_id: activeAssignmentId,
      company: "Cross-user",
      project: "Interdit",
      site_url: "",
      shared_notes: "Ne doit pas passer",
      updated_by: users[1].id,
    });
    checks.crossMemberCannotWriteSharedContext = Boolean(crossContextUpsert.error);

    const trainerContextUpdate = await admin
      .from("accompaniment_workspace_context")
      .update({ shared_notes: "Note formateur", updated_by: users[1].id })
      .eq("assignment_id", activeAssignmentId);
    if (trainerContextUpdate.error) throw trainerContextUpdate.error;
    const ownContextAfterTrainer = await clientA
      .from("accompaniment_workspace_context")
      .select("shared_notes")
      .eq("assignment_id", activeAssignmentId)
      .maybeSingle();
    checks.activeMemberSeesTrainerContextUpdate = ownContextAfterTrainer.data?.shared_notes === "Note formateur";
    if (ownContextAfterTrainer.error) {
      diagnostics.memberReadAfterTrainer = safeMessage(JSON.stringify({
        code: ownContextAfterTrainer.error.code,
        message: ownContextAfterTrainer.error.message,
        details: ownContextAfterTrainer.error.details,
        hint: ownContextAfterTrainer.error.hint,
      }));
    }

    const revoke = await admin
      .from("accompaniment_assignments")
      .update({ status: "revoked", updated_at: new Date().toISOString() })
      .eq("user_id", users[0].id)
      .eq("accompaniment_slug", "site-web");
    if (revoke.error) throw revoke.error;

    const revokedAssignmentA = await clientA
      .from("accompaniment_assignments")
      .select("id")
      .eq("user_id", users[0].id)
      .eq("accompaniment_slug", "site-web");
    checks.revokedMemberSeesNoAssignment = (revokedAssignmentA.data?.length ?? 0) === 0;

    const revokedInsert = await clientA.from("progress").insert({
      user_id: users[0].id,
      module_id: "web-accompagnement",
      item_id: "web-theme-after-revoke",
    });
    checks.revokedMemberCannotSaveTheme = Boolean(revokedInsert.error);

    const revokedContextSelect = await clientA
      .from("accompaniment_workspace_context")
      .select("assignment_id")
      .eq("assignment_id", activeAssignmentId);
    checks.revokedMemberSeesNoSharedContext = (revokedContextSelect.data?.length ?? 0) === 0;

    const revokedContextUpdate = await clientA
      .from("accompaniment_workspace_context")
      .update({ shared_notes: "Après révocation", updated_by: users[0].id })
      .eq("assignment_id", activeAssignmentId)
      .select("assignment_id");
    checks.revokedMemberCannotWriteSharedContext =
      Boolean(revokedContextUpdate.error) || (revokedContextUpdate.data?.length ?? 0) === 0;

    verdict = Object.values(checks).every((value) => value === true) ? "PASS" : "FAIL";
  } catch (error) {
    failure = safeMessage(error);
  } finally {
    try {
      await cleanupUsers(users);
    } catch (error) {
      cleanupFailure = safeMessage(error);
      verdict = "FAIL";
    }
  }

  const remainingFixtures = (await listFixtures()).length;
  if (remainingFixtures !== 0) verdict = "FAIL";

  const report = {
    verdict,
    verifiedAt: new Date().toISOString(),
    migrations: [
      "20260830110000_accompaniment_assignments.sql",
      "20260831193000_accompaniment_workspace_context.sql",
      "20260831204500_accompaniment_workspace_postgrest_grants.sql",
    ],
    checks,
    diagnostics,
    failure,
    cleanupFailure,
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
  console.error(safeMessage(error));
  process.exit(1);
});
