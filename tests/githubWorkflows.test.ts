import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { parse } from "yaml";

const WORKFLOW_DIR = new URL("../.github/workflows/", import.meta.url);
const workflows = readdirSync(WORKFLOW_DIR)
  .filter((name) => /\.ya?ml$/.test(name))
  .map((name) => ({ name, source: readFileSync(new URL(name, WORKFLOW_DIR), "utf8") }));

type Step = { uses?: string; run?: string; with?: Record<string, unknown> };
type Job = { permissions?: Record<string, string> | string; steps?: Step[] };
type Workflow = { on?: unknown; permissions?: Record<string, string> | string; jobs?: Record<string, Job> };

test("there is at least one workflow to check", () => {
  assert.ok(workflows.length > 0);
});

for (const { name, source } of workflows) {
  const workflow = parse(source) as Workflow;
  const jobs = Object.entries(workflow.jobs ?? {});

  test(`${name}: least-privilege token, no privileged trigger on untrusted code`, () => {
    assert.ok(workflow.permissions && typeof workflow.permissions === "object", "top-level permissions must be explicit");
    assert.deepEqual(Object.entries(workflow.permissions).filter(([, level]) => level !== "read" && level !== "none"), [], "no write scope at workflow level");
    for (const [jobName, job] of jobs) {
      if (job.permissions && typeof job.permissions === "object") {
        assert.deepEqual(Object.entries(job.permissions).filter(([, level]) => level === "write"), [], `${jobName} must not request write scopes`);
      }
      assert.notEqual(job.permissions, "write-all", jobName);
    }
    const triggers = JSON.stringify(workflow.on);
    assert.ok(!/pull_request_target|workflow_run/.test(triggers), "pull_request_target and workflow_run run with secrets on fork-controlled input");
    assert.ok(!/pull_request_target/.test(source));
  });

  test(`${name}: every action is pinned to a full commit SHA and checkout drops its credentials`, () => {
    for (const [jobName, job] of jobs) {
      for (const step of job.steps ?? []) {
        if (!step.uses) continue;
        assert.match(step.uses, /^[\w.-]+\/[\w.-]+(\/[\w./-]+)?@[0-9a-f]{40}$/, `${jobName}: ${step.uses} must be pinned by SHA`);
        if (step.uses.startsWith("actions/checkout@")) {
          assert.equal(step.with?.["persist-credentials"], false, `${jobName}: checkout must not keep the token in .git/config`);
        }
      }
    }
  });

  test(`${name}: no event-controlled expression is interpolated into a shell step, and secrets are never echoed`, () => {
    for (const [jobName, job] of jobs) {
      for (const step of job.steps ?? []) {
        if (!step.run) continue;
        assert.doesNotMatch(
          step.run,
          /\$\{\{\s*(github\.event\.|github\.head_ref|github\.ref_name|inputs\.|steps\.[^}]*outputs)/,
          `${jobName}: untrusted context interpolated in run`,
        );
        assert.doesNotMatch(step.run, /\$\{\{\s*secrets\./, `${jobName}: pass secrets through env, never inline in run`);
      }
    }
    assert.doesNotMatch(source, /--no-verify|curl[^\n]*\|\s*(ba)?sh/, "no unverified remote script execution");
  });

  test(`${name}: dependencies are installed without lifecycle scripts`, () => {
    for (const [jobName, job] of jobs) {
      for (const step of job.steps ?? []) {
        if (!step.run) continue;
        for (const line of step.run.split("\n")) {
          if (/\bnpm (ci|install|i)\b/.test(line)) assert.match(line, /--ignore-scripts/, `${jobName}: ${line.trim()}`);
        }
      }
    }
  });
}
