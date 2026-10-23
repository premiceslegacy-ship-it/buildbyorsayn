import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test, { mock } from "node:test";

if (process.env.ADMIN_AGENT_FIX4_INNER !== "1") {
  test("Agent admin applique le moindre privilège et garde la révocation visible", () => {
    const result = spawnSync(process.execPath, [
      "--import", "./tests/fixtures/serverOnlyStub.mjs",
      "--import", "tsx",
      "--experimental-test-module-mocks",
      "--test",
      "tests/adminAgentFix4.test.ts",
    ], {
      encoding: "utf8",
      env: { ...process.env, NODE_ENV: "test", ADMIN_AGENT_FIX4_INNER: "1" },
    });
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  });
} else {
  const file = (path: string) => pathToFileURL(resolve(path)).href;
  const TOKEN_ID = "123e4567-e89b-42d3-a456-426614174000";
  const ADMIN_ID = "223e4567-e89b-42d3-a456-426614174000";
  let insertedToken: Record<string, unknown> | null = null;
  let updatedToken: Record<string, unknown> | null = null;
  const auditActions: Array<Record<string, unknown>> = [];

  type QueryResult = { data: Record<string, unknown> | null; error: null };
  type MockChain = {
    insert: (values: Record<string, unknown>) => MockChain;
    update: (values: Record<string, unknown>) => MockChain;
    select: () => MockChain;
    eq: () => MockChain;
    is: () => MockChain;
    single: () => Promise<QueryResult>;
    maybeSingle: () => Promise<QueryResult>;
  };

  function table(name: string) {
    const state: { operation: "select" | "insert" | "update"; values?: Record<string, unknown> } = {
      operation: "select",
    };
    const chain: MockChain = {
      insert(values: Record<string, unknown>) {
        state.operation = "insert";
        state.values = values;
        if (name === "admin_agent_tokens") insertedToken = values;
        return chain;
      },
      update(values: Record<string, unknown>) {
        state.operation = "update";
        state.values = values;
        if (name === "admin_agent_tokens") updatedToken = values;
        return chain;
      },
      select() { return chain; },
      eq() { return chain; },
      is() { return chain; },
      single() {
        return Promise.resolve({
          data: state.operation === "insert"
            ? {
                id: TOKEN_ID,
                name: state.values?.name,
                last_four: state.values?.last_four,
                permissions: state.values?.permissions,
                expires_at: state.values?.expires_at,
                created_at: new Date().toISOString(),
              }
            : null,
          error: null,
        });
      },
      maybeSingle() {
        return Promise.resolve({
          data: state.operation === "update" ? { id: TOKEN_ID } : null,
          error: null,
        });
      },
    };
    return chain;
  }

  mock.module(file("lib/supabase/admin.ts"), {
    namedExports: {
      createAdminSupabase: () => ({ from: table }),
    },
  });
  mock.module(file("lib/mux/adminServer.ts"), {
    namedExports: {
      getVerifiedAdmin: async () => ({ id: ADMIN_ID, app_metadata: { role: "admin" } }),
      recordAdminAction: async (input: Record<string, unknown>) => {
        auditActions.push(input);
        return "audit-id";
      },
    },
  });
  mock.module(file("lib/adminAgent/execution.ts"), {
    namedExports: {
      executeAgentPublication: async () => undefined,
      executePreparedMail: async () => undefined,
    },
  });
  mock.module(file("lib/adminAgent/security.ts"), {
    namedExports: {
      DEFAULT_AGENT_TOKEN_DAYS: 90,
      generateAgentToken: () => `btv_agt_${"a".repeat(43)}`,
      hashAgentToken: () => "hash",
    },
  });

  const admin = await import("../lib/adminAgent/admin");

  test("un jeton créé sans droits explicites ne reçoit que les trois droits de lecture", async () => {
    const created = await admin.createAgentToken({ name: "Lecture" });
    assert.deepEqual(admin.DEFAULT_AGENT_PERMISSIONS, ["liste_blocs", "statut_video", "journal"]);
    assert.deepEqual(insertedToken?.permissions, ["liste_blocs", "statut_video", "journal"]);
    assert.deepEqual(created.permissions, ["liste_blocs", "statut_video", "journal"]);
    assert.equal((auditActions[0].details as { permissionCount: number }).permissionCount, 3);
  });

  test("la révocation active immédiatement la date et répond qu'elle a réussi", async () => {
    const result = await admin.revokeAgentToken(TOKEN_ID);
    assert.equal(result.revoked, true);
    assert.equal(typeof updatedToken?.revoked_at, "string");
    assert.equal(auditActions.some((entry) => entry.action === "agent.token_revoke"), true);
  });

  test("le formulaire, les interrupteurs et la liste des jetons exposent le flux attendu", async () => {
    const [client, adminCss, daCss] = await Promise.all([
      readFile("components/admin/agent/AgentClient.tsx", "utf8"),
      readFile("app/admin/admin.css", "utf8"),
      readFile("app/da.css", "utf8"),
    ]);
    const defaultSelection = client.match(/const DEFAULT_NEW_TOKEN_PERMISSIONS:[\s\S]*?= \[([\s\S]*?)\];/)?.[1] ?? "";
    assert.match(defaultSelection, /"liste_blocs"/);
    assert.match(defaultSelection, /"statut_video"/);
    assert.match(defaultSelection, /"journal"/);
    for (const forbidden of ["envoyer_video", "ecrire_chapitres", "ecrire_resume", "choisir_miniature", "demander_publication", "preparer_mail"]) {
      assert.doesNotMatch(defaultSelection, new RegExp(forbidden));
    }
    assert.match(client, /role="switch" aria-checked=\{checked\}/);
    assert.match(client, /playAppSound\("select"\)/);
    assert.match(adminCss, /\.adm-switch \{[^}]*width: 52px;[^}]*height: 44px;/);
    assert.match(adminCss, /\.adm-switch-track \{[^}]*width: 36px;[^}]*height: 22px;/);
    assert.match(adminCss, /aria-checked="true"[^}]*background: var\(--em\)/);
    assert.match(adminCss, /--sp-vif-d/);
    assert.match(daCss, /\.da :focus-visible \{ outline: 2px solid var\(--em\) !important;/);
    assert.match(client, /<\/details><div className="mt-4 border-t[^>]*><button[^>]*[\s\S]*?>Révoquer<\/button>/);
    assert.match(client, /await load\(\)/);
    assert.doesNotMatch(client, /location\.reload/);
    assert.match(client, /Révoqué le/);
    assert.match(client, /dateLabel\(token\.revokedAt\)/);
    const reveal = client.match(/\{freshToken && <div([\s\S]*?)\}\n/)?.[1] ?? "";
    assert.match(reveal, /bg-white\/\[\.055\]/);
    assert.match(reveal, /emerald/);
    assert.doesNotMatch(reveal, /amber|border-l/);
  });
}
