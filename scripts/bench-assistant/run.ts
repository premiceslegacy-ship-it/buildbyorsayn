import { spawn, type ChildProcess } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { config as loadEnv } from "dotenv";
import { ASSISTANT_BENCH_CASES, BENCH_TIERS, validateBenchCases, type BenchCase, type BenchTier } from "./cases";
import { connectTier, createOfflineTier, credentialsForTier, type ConnectedTier, type ToolObservation } from "./mcpClient";
import { answerBatch, judgeBatch, SCORE_KEYS, type PreparedCase } from "./models";
import { buildAssistantInstructions } from "../../lib/mcp/assistantInstructions";

loadEnv({ path: ".env.local", quiet: true });
loadEnv({ path: ".env.e2e.local", quiet: true, override: true });

type Split = "iteration" | "holdout" | "all";
type CaseResult = {
  id: string;
  split: BenchCase["split"];
  tier: BenchTier;
  category: string;
  question: string;
  expected: BenchCase["expected"];
  observations: ToolObservation[];
  answer: string;
  judgement: Awaited<ReturnType<typeof judgeBatch>>[number];
  retrieval: {
    evaluated: boolean;
    expectedInTop3: boolean | null;
    hitAt3: boolean | null;
  };
};

type Options = {
  baseUrl: string;
  label: string;
  split: Split;
  batchSize: number;
  startServer: boolean;
  serverCwd: string;
  caseIds: Set<string> | null;
  maxCases: number | null;
  offline: boolean;
  offlineBaseline: boolean;
  instructionsFile: string | null;
};

function argument(name: string): string | undefined {
  return process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
}

function parseOptions(): Options {
  const split = argument("split") ?? "all";
  if (split !== "iteration" && split !== "holdout" && split !== "all") {
    throw new Error("--split must be iteration, holdout or all.");
  }
  const batchSize = Number(argument("batch-size") ?? "5");
  if (!Number.isSafeInteger(batchSize) || batchSize < 1 || batchSize > 10) {
    throw new Error("--batch-size must be an integer between 1 and 10.");
  }
  const maxCasesRaw = argument("max-cases");
  const maxCases = maxCasesRaw === undefined ? null : Number(maxCasesRaw);
  if (maxCases !== null && (!Number.isSafeInteger(maxCases) || maxCases < 1)) {
    throw new Error("--max-cases must be a positive integer.");
  }
  const casesRaw = argument("cases");
  return {
    baseUrl: argument("base-url") ?? "http://127.0.0.1:3312",
    label: argument("label") ?? `run-${Date.now()}`,
    split,
    batchSize,
    startServer: process.argv.includes("--start-server"),
    serverCwd: resolve(argument("server-cwd") ?? process.cwd()),
    caseIds: casesRaw ? new Set(casesRaw.split(",").filter(Boolean)) : null,
    maxCases,
    offline: process.argv.includes("--offline"),
    offlineBaseline: process.argv.includes("--offline-baseline"),
    instructionsFile: argument("instructions-file") ?? null,
  };
}

async function waitForServer(baseUrl: string, child: ChildProcess | null): Promise<void> {
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (child && child.exitCode !== null) throw new Error(`Next server exited with ${child.exitCode}.`);
    try {
      const response = await fetch(`${baseUrl}/.well-known/oauth-authorization-server`, {
        signal: AbortSignal.timeout(2_000),
      });
      if (response.ok) return;
    } catch {
      // Server is not ready yet.
    }
    await delay(250);
  }
  throw new Error("Next server did not become ready within 90 seconds.");
}

function startServer(options: Options): ChildProcess {
  const port = new URL(options.baseUrl).port || "3312";
  return spawn(
    process.execPath,
    [resolve(options.serverCwd, "node_modules/next/dist/bin/next"), "start", "-p", port, "-H", "127.0.0.1"],
    {
      cwd: options.serverCwd,
      env: {
        ...process.env,
        MCP_OAUTH_ISSUER: options.baseUrl,
        NEXT_PUBLIC_APP_URL: options.baseUrl,
        MCP_ALLOWED_ORIGINS: "https://claude.ai,https://chatgpt.com",
      },
      stdio: ["ignore", "ignore", "ignore"],
    },
  );
}

async function stopServer(child: ChildProcess | null): Promise<void> {
  if (!child || child.exitCode !== null) return;
  child.kill("SIGTERM");
  await Promise.race([
    new Promise<void>((resolveExit) => child.once("exit", () => resolveExit())),
    delay(5_000).then(() => {
      if (child.exitCode === null) child.kill("SIGKILL");
    }),
  ]);
}

function batches<T>(items: readonly T[], size: number): T[][] {
  const output: T[][] = [];
  for (let index = 0; index < items.length; index += size) output.push(items.slice(index, index + size));
  return output;
}

function tierRank(tier: string): number {
  return ["free", "preview", "beginner", "full"].indexOf(tier);
}

function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function retrievalResult(definition: BenchCase, observations: ToolObservation[]) {
  if (!definition.retrieval) {
    return { evaluated: false, expectedInTop3: null, hitAt3: null };
  }
  const search = observations.find((observation) => observation.name === "search_knowledge");
  const top3 = search?.matches.slice(0, 3) ?? [];
  const titleNeedles = definition.retrieval.titleIncludes?.map(normalize) ?? [];
  const contentNeedles = definition.retrieval.contentIncludes?.map(normalize) ?? [];
  const hitAt3 = top3.some((match) => {
    if (match.source !== definition.retrieval?.source) return false;
    const title = normalize(match.title);
    const content = normalize(match.content);
    const titleMatches = titleNeedles.length === 0 || titleNeedles.some((needle) => title.includes(needle));
    const contentMatches = contentNeedles.length === 0 || contentNeedles.some((needle) => content.includes(needle));
    return titleMatches && contentMatches;
  });
  return {
    evaluated: true,
    expectedInTop3: definition.retrieval.expectedInTop3,
    hitAt3,
  };
}

function percentile(samples: number[], fraction: number): number | null {
  if (samples.length === 0) return null;
  const sorted = [...samples].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1);
  return Math.round(sorted[index] * 10) / 10;
}

function scoreSummary(results: CaseResult[]) {
  const criterionMeans = Object.fromEntries(SCORE_KEYS.map((key) => {
    const total = results.reduce((sum, result) => sum + result.judgement.scores[key], 0);
    return [key, results.length === 0 ? null : Math.round((total / results.length) * 100) / 100];
  }));
  const obtained = results.reduce(
    (sum, result) => sum + SCORE_KEYS.reduce((caseSum, key) => caseSum + result.judgement.scores[key], 0),
    0,
  );
  const maximum = results.length * SCORE_KEYS.length * 2;
  return {
    cases: results.length,
    obtained,
    maximum,
    percent: maximum === 0 ? null : Math.round((obtained / maximum) * 10_000) / 100,
    criteria: criterionMeans,
    fatalTierLeaks: results.filter((result) => result.judgement.fatalTierLeak).length,
  };
}

function buildSummary(results: CaseResult[], toolNames: Record<string, string[]>, instructionsLength: number) {
  const searches = results.flatMap((result) => result.observations.filter((item) => item.name === "search_knowledge"));
  const recallCases = results.filter((result) => result.retrieval.evaluated && result.retrieval.expectedInTop3 === true);
  const recallHits = recallCases.filter((result) => result.retrieval.hitAt3 === true).length;
  const leaks = results.flatMap((result) => result.observations.flatMap((observation) =>
    observation.matches.filter((match) => tierRank(match.tier_required) > tierRank(result.tier))
      .map((match) => ({ caseId: result.id, requesterTier: result.tier, returnedTier: match.tier_required, source: match.source })),
  ));
  return {
    score: scoreSummary(results),
    iteration: scoreSummary(results.filter((result) => result.split === "iteration")),
    holdout: scoreSummary(results.filter((result) => result.split === "holdout")),
    retrieval: {
      evaluatedCases: recallCases.length,
      hitsAt3: recallHits,
      recallAt3: recallCases.length === 0 ? null : Math.round((recallHits / recallCases.length) * 10_000) / 100,
      crossTierLeaks: leaks.length,
      leakDetails: leaks,
      searchSamples: searches.length,
      p50Ms: percentile(searches.map((item) => item.durationMs), 0.5),
      p95Ms: percentile(searches.map((item) => item.durationMs), 0.95),
    },
    instructionsLength,
    toolNames,
  };
}

async function main(): Promise<void> {
  validateBenchCases();
  const options = parseOptions();
  let selected = ASSISTANT_BENCH_CASES.filter((item) => options.split === "all" || item.split === options.split);
  if (options.caseIds) selected = selected.filter((item) => options.caseIds?.has(item.id));
  if (options.maxCases !== null) selected = selected.slice(0, options.maxCases);
  if (selected.length === 0) throw new Error("No benchmark cases selected.");

  await mkdir("/tmp/cx", { recursive: true });
  if (options.offline && options.startServer) throw new Error("--offline and --start-server cannot be combined.");
  const server = options.startServer ? startServer(options) : null;
  const connections = new Map<BenchTier, ConnectedTier>();
  const results: CaseResult[] = [];
  try {
    if (!options.offline) await waitForServer(options.baseUrl, server);
    const offlineInstructions = options.instructionsFile
      ? await readFile(options.instructionsFile, "utf8")
      : buildAssistantInstructions({ syncOrigin: options.baseUrl });
    for (const [index, tier] of BENCH_TIERS.entries()) {
      if (options.offline) {
        connections.set(tier, await createOfflineTier({
          tier,
          instructions: offlineInstructions,
          baseline: options.offlineBaseline,
        }));
      } else {
        const credentials = credentialsForTier(tier);
        connections.set(tier, await connectTier({
          baseUrl: options.baseUrl,
          tier,
          ...credentials,
          address: `203.0.113.${180 + index}`,
        }));
      }
      process.stderr.write(`Connected ${tier}.\n`);
    }
    const firstConnection = connections.get("free")!;
    const instructions = firstConnection.instructions;
    for (const [batchIndex, definitions] of batches(selected, options.batchSize).entries()) {
      const prepared: PreparedCase[] = [];
      for (const definition of definitions) {
        const connection = connections.get(definition.tier)!;
        const observations: ToolObservation[] = [];
        for (const call of definition.tools) observations.push(await connection.callTool(call));
        prepared.push({ definition, observations });
      }
      const runId = `${options.label}-${String(batchIndex + 1).padStart(2, "0")}`;
      const answers = await answerBatch({ instructions, batch: prepared, runId });
      const judgements = await judgeBatch({ batch: prepared, answers, runId });
      const answerById = new Map(answers.map((answer) => [answer.id, answer.answer]));
      const judgementById = new Map(judgements.map((judgement) => [judgement.id, judgement]));
      for (const item of prepared) {
        results.push({
          id: item.definition.id,
          split: item.definition.split,
          tier: item.definition.tier,
          category: item.definition.category,
          question: item.definition.question,
          expected: item.definition.expected,
          observations: item.observations,
          answer: answerById.get(item.definition.id)!,
          judgement: judgementById.get(item.definition.id)!,
          retrieval: retrievalResult(item.definition, item.observations),
        });
      }
      process.stderr.write(`Completed batch ${batchIndex + 1}/${Math.ceil(selected.length / options.batchSize)}.\n`);
    }

    const toolNames = Object.fromEntries([...connections].map(([tier, connection]) => [tier, connection.toolNames]));
    const report = {
      schemaVersion: 1,
      label: options.label,
      generatedAt: new Date().toISOString(),
      split: options.split,
      executionMode: options.offline ? "offline-local-corpus-proxy" : "live-mcp-http",
      limitations: options.offline
        ? ["No TCP transport, OAuth, remote embeddings, Supabase RPC or live latency was exercised in this proxy run."]
        : [],
      responder: { model: "gpt-5.6-sol", reasoningEffort: "high", sandbox: "read-only" },
      judge: { model: "gpt-5.6-sol", reasoningEffort: "xhigh", sandbox: "read-only", blind: true },
      summary: buildSummary(results, toolNames, instructions.length),
      results,
    };
    const outputPath = `/tmp/cx/assistant-bench-${options.label}.json`;
    await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    console.log(JSON.stringify({ outputPath, summary: report.summary }, null, 2));
  } finally {
    const cleanup = await Promise.allSettled([...connections.values()].map((connection) => connection.close()));
    await stopServer(server);
    if (cleanup.some((result) => result.status === "rejected")) {
      throw new Error("Benchmark cleanup was not fully verified.");
    }
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Assistant benchmark failed.";
  console.error(message.replace(/[A-Za-z0-9_-]{43,}/g, "[REDACTED]"));
  process.exitCode = 1;
});
