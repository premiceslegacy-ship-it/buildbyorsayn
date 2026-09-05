import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  MCP_TIER_THRESHOLDS,
  validateCleanupReadback,
  validateTierThresholds,
} from "./mcp-tier-contract";
import { isProcessGroupAlive, signalProcessTree } from "./mcp-process-tree";
import { appendBoundedOutput } from "./mcp-output-buffer";

const OUTPUT_PATH = resolve(
  "product/accompagnement-site-web/visual-qa/mcp-tier-runtime-verification.json"
);
const TIERS = ["beginner", "full"] as const;
const TIER_CHILD_DEADLINE_MS = 180_000;
const TIER_CHILD_KILL_GRACE_MS = 5_000;
const PROCESS_GROUP_DRAIN_POLL_MS = 25;
const PROCESS_GROUP_DRAIN_TIMEOUT_MS = TIER_CHILD_KILL_GRACE_MS + 5_000;
const TIER_LABELS = {
  beginner: "Fondations",
  full: "LE COFFRE",
} as const;

type E2eTier = (typeof TIERS)[number];
type E2eReport = {
  verdict?: unknown;
  tier?: unknown;
  tierBoundary?: unknown;
  performance?: Record<string, unknown>;
  thresholds?: Record<string, unknown>;
  cleanup?: unknown;
  cleanupReadback?: Record<string, unknown>;
};

type TierRun = {
  label: string;
  tier: E2eTier;
  tierBoundary: "PASS";
  toolsListP50Ms: number;
  toolsListP95Ms: number;
  concurrentRequests: number;
  concurrentDurationMs: number;
  knowledgeSearchDurationMs: number;
  cleanupReadback: Record<string, number>;
};

function runTier(tier: E2eTier): Promise<E2eReport> {
  if (process.platform === "win32") {
    return Promise.reject(new Error("MCP tier evidence requires POSIX process groups."));
  }
  return new Promise((resolveReport, rejectReport) => {
    const child = spawn(
      process.execPath,
      ["--import", "tsx", "scripts/verify-mcp-e2e.ts"],
      {
        cwd: process.cwd(),
        env: { ...process.env, MCP_E2E_TIER: tier },
        detached: true,
        stdio: ["ignore", "pipe", "ignore"],
      }
    );
    let stdout = "";
    let settled = false;
    let closeObserved = false;
    let closeCode: number | null = null;
    let terminationReason: "deadline" | "output-overflow" | "orphaned-descendant" | "child-error" | null = null;
    let terminationFailure: Error | undefined;
    let deadlineTimer: ReturnType<typeof setTimeout> | undefined;
    let killTimer: ReturnType<typeof setTimeout> | undefined;
    let drainTimer: ReturnType<typeof setTimeout> | undefined;
    let terminationWatchdogTimer: ReturnType<typeof setTimeout> | undefined;
    let drainStartedAt: number | undefined;

    const clearTimers = () => {
      if (deadlineTimer) clearTimeout(deadlineTimer);
      if (killTimer) clearTimeout(killTimer);
      if (drainTimer) clearTimeout(drainTimer);
      if (terminationWatchdogTimer) clearTimeout(terminationWatchdogTimer);
    };

    const failClosed = (error: Error) => {
      if (settled) return;
      settled = true;
      clearTimers();
      rejectReport(error);
    };

    const settle = () => {
      if (settled || !closeObserved) return;
      settled = true;
      clearTimers();
      if (terminationFailure) {
        rejectReport(terminationFailure);
        return;
      }
      if (terminationReason === "deadline") {
        rejectReport(new Error(`${tier} MCP E2E exceeded its child deadline.`));
        return;
      }
      if (terminationReason === "output-overflow") {
        rejectReport(new Error(`${tier} MCP E2E exceeded its child output limit.`));
        return;
      }
      if (terminationReason === "orphaned-descendant") {
        rejectReport(new Error(`${tier} MCP E2E left a descendant process alive.`));
        return;
      }
      if (terminationReason === "child-error") {
        rejectReport(new Error(`Could not start ${tier} MCP E2E.`));
        return;
      }
      if (closeCode !== 0) {
        rejectReport(new Error(`${tier} MCP E2E returned a failure.`));
        return;
      }
      try {
        resolveReport(JSON.parse(stdout.trim()) as E2eReport);
      } catch {
        rejectReport(new Error(`${tier} MCP E2E returned invalid evidence.`));
      }
    };

    const waitForGroupDrain = () => {
      if (settled) return;
      if (isProcessGroupAlive(child.pid)) {
        drainStartedAt ??= Date.now();
        if (Date.now() - drainStartedAt >= PROCESS_GROUP_DRAIN_TIMEOUT_MS) {
          const failure = terminationFailure ?? new Error(`${tier} MCP E2E process group did not drain.`);
          failClosed(failure);
          return;
        }
        drainTimer = setTimeout(waitForGroupDrain, PROCESS_GROUP_DRAIN_POLL_MS);
        return;
      }
      if (closeObserved) settle();
    };

    const requestTermination = (
      reason: "deadline" | "output-overflow" | "orphaned-descendant" | "child-error"
    ) => {
      if (terminationReason || settled) return;
      terminationReason = reason;
      try {
        signalProcessTree(child, "SIGTERM");
      } catch (error) {
        terminationFailure ??= error instanceof Error
          ? error
          : new Error("MCP process-group termination failed.");
      }
      terminationWatchdogTimer = setTimeout(() => {
        if (settled) return;
        const failure = terminationFailure ?? new Error(`${tier} MCP E2E process group did not drain.`);
        failClosed(failure);
      }, PROCESS_GROUP_DRAIN_TIMEOUT_MS);
      killTimer = setTimeout(() => {
        if (settled) return;
        try {
          signalProcessTree(child, "SIGKILL");
        } catch (error) {
          terminationFailure ??= error instanceof Error
            ? error
            : new Error("MCP process-group termination failed.");
        }
        waitForGroupDrain();
      }, TIER_CHILD_KILL_GRACE_MS);
      waitForGroupDrain();
    };

    const terminateAfterDeadline = () => {
      requestTermination("deadline");
    };

    deadlineTimer = setTimeout(terminateAfterDeadline, TIER_CHILD_DEADLINE_MS);
    child.stdout.on("data", (chunk: Buffer) => {
      if (terminationReason) return;
      const bounded = appendBoundedOutput(stdout, chunk.toString("utf8"));
      stdout = bounded.output;
      if (bounded.overflow) requestTermination("output-overflow");
    });
    child.once("error", (error) => {
      if (settled) return;
      terminationFailure = new Error(`Could not start ${tier} MCP E2E: ${error.message}`);
      closeObserved = true;
      requestTermination("child-error");
    });
    child.once("close", (code) => {
      if (settled) return;
      closeObserved = true;
      closeCode = code;
      if (!terminationReason && isProcessGroupAlive(child.pid)) {
        requestTermination("orphaned-descendant");
        return;
      }
      waitForGroupDrain();
    });
  });
}

function finiteNumber(report: E2eReport, key: string): number {
  const value = report.performance?.[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Missing numeric performance field ${key}.`);
  }
  return value;
}

function verifyTierReport(report: E2eReport, tier: E2eTier): TierRun {
  if (report.verdict !== "PASS" || report.tier !== tier || report.cleanup !== "PASS") {
    throw new Error(`${tier} MCP E2E did not pass its complete contract.`);
  }
  if (report.tierBoundary !== "PASS") {
    throw new Error(`${tier} MCP tier boundary was not proven.`);
  }
  const limits = validateTierThresholds(report.thresholds);
  const toolsListP50Ms = finiteNumber(report, "toolsListP50Ms");
  const toolsListP95Ms = finiteNumber(report, "toolsListP95Ms");
  const concurrentDurationMs = finiteNumber(report, "concurrentDurationMs");
  const knowledgeSearchDurationMs = finiteNumber(report, "knowledgeSearchDurationMs");
  if (
    toolsListP50Ms >= limits.toolsListP50MsLessThan ||
    toolsListP95Ms >= limits.toolsListP95MsLessThan ||
    concurrentDurationMs >= limits.concurrentBatchMsLessThan ||
    knowledgeSearchDurationMs >= limits.knowledgeSearchMsLessThan
  ) {
    throw new Error(`${tier} MCP E2E exceeded a published performance threshold.`);
  }
  const cleanupReadback = validateCleanupReadback(report.cleanupReadback);
  const concurrentRequests = report.performance?.concurrentRequests;
  const toolsListSamples = report.performance?.toolsListSamples;
  if (concurrentRequests !== 8 || toolsListSamples !== 20) {
    throw new Error(`${tier} MCP E2E did not execute the declared load sample.`);
  }
  return {
    label: TIER_LABELS[tier],
    tier,
    tierBoundary: "PASS",
    toolsListP50Ms,
    toolsListP95Ms,
    concurrentRequests,
    concurrentDurationMs,
    knowledgeSearchDurationMs,
    cleanupReadback,
  };
}

async function writeEvidence(report: Record<string, unknown>): Promise<void> {
  await mkdir(resolve("product/accompagnement-site-web/visual-qa"), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);
}

async function main(): Promise<void> {
  const verifiedAt = new Date().toISOString();
  try {
    const tierReports: TierRun[] = [];
    for (const tier of TIERS) {
      tierReports.push(verifyTierReport(await runTier(tier), tier));
    }
    const report = {
      verdict: "PASS",
      generatedBy: "scripts/verify-mcp-tier-evidence.ts",
      verifiedAt,
      environment: "local production build with Next start on the isolated MCP E2E port",
      commercialGate: "closed",
      tierMapping: {
        preview: "preview",
        Fondations: "beginner",
        "LE COFFRE": "full",
      },
      commands: {
        tierHttp: "npm run test:mcp-tiers",
      },
      tierHttpRuns: tierReports,
      thresholds: MCP_TIER_THRESHOLDS,
      clientProofStatus: {
        claude: "pending real client connection and MCP tool call",
        chatgpt: "pending real client connection and MCP tool call",
      },
    };
    await writeEvidence(report);
    console.log(JSON.stringify(report, null, 2));
  } catch {
    const report = {
      verdict: "FAIL",
      generatedBy: "scripts/verify-mcp-tier-evidence.ts",
      verifiedAt,
      commercialGate: "closed",
      failure: "MCP tier evidence generation failed; inspect the E2E output directly.",
    };
    await writeEvidence(report);
    console.error(JSON.stringify(report, null, 2));
    process.exitCode = 1;
  }
}

await main();
