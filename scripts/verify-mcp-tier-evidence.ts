import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  MCP_TIER_THRESHOLDS,
  validateCleanupReadback,
  validateTierThresholds,
} from "./mcp-tier-contract";

const OUTPUT_PATH = resolve(
  "product/accompagnement-site-web/visual-qa/mcp-tier-runtime-verification.json"
);
const TIERS = ["beginner", "full"] as const;
const TIER_CHILD_DEADLINE_MS = 180_000;
const TIER_CHILD_KILL_GRACE_MS = 5_000;
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
  return new Promise((resolveReport, rejectReport) => {
    const child = spawn(
      process.execPath,
      ["--import", "tsx", "scripts/verify-mcp-e2e.ts"],
      {
        cwd: process.cwd(),
        env: { ...process.env, MCP_E2E_TIER: tier },
        stdio: ["ignore", "pipe", "ignore"],
      }
    );
    let stdout = "";
    let settled = false;
    let timedOut = false;
    let deadlineTimer: ReturnType<typeof setTimeout> | undefined;
    let killTimer: ReturnType<typeof setTimeout> | undefined;
    const clearTimers = () => {
      if (deadlineTimer) clearTimeout(deadlineTimer);
      if (killTimer) clearTimeout(killTimer);
    };
    const terminateAfterDeadline = () => {
      if (settled) return;
      timedOut = true;
      child.kill("SIGTERM");
      killTimer = setTimeout(() => {
        if (!settled) child.kill("SIGKILL");
      }, TIER_CHILD_KILL_GRACE_MS);
    };
    deadlineTimer = setTimeout(terminateAfterDeadline, TIER_CHILD_DEADLINE_MS);
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
      if (stdout.length > 256_000) child.kill("SIGTERM");
    });
    child.once("error", () => {
      if (settled) return;
      settled = true;
      clearTimers();
      rejectReport(new Error(`Could not start ${tier} MCP E2E.`));
    });
    child.once("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimers();
      if (timedOut) {
        rejectReport(new Error(`${tier} MCP E2E exceeded its child deadline.`));
        return;
      }
      if (code !== 0) {
        rejectReport(new Error(`${tier} MCP E2E returned a failure.`));
        return;
      }
      try {
        resolveReport(JSON.parse(stdout.trim()) as E2eReport);
      } catch {
        rejectReport(new Error(`${tier} MCP E2E returned invalid evidence.`));
      }
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
