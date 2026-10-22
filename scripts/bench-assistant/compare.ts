import { readFile } from "node:fs/promises";
import { SCORE_KEYS } from "./models";

type Report = {
  label: string;
  summary: {
    score: { percent: number; criteria: Record<string, number>; fatalTierLeaks: number };
    holdout: { percent: number | null; criteria: Record<string, number | null>; fatalTierLeaks: number };
    retrieval: { recallAt3: number; crossTierLeaks: number; p50Ms: number; p95Ms: number };
  };
};

async function load(path: string): Promise<Report> {
  return JSON.parse(await readFile(path, "utf8")) as Report;
}

const paths = process.argv.slice(2);
if (paths.length < 2) throw new Error("Usage: compare.ts <before.json> <after.json> [after-repeat.json]");
const reports = await Promise.all(paths.map(load));
const before = reports[0];
const after = reports[1];
const delta = (left: number | null, right: number | null) =>
  left === null || right === null ? null : Math.round((right - left) * 100) / 100;

const comparison = {
  before: before.label,
  after: after.label,
  global: { before: before.summary.score.percent, after: after.summary.score.percent, delta: delta(before.summary.score.percent, after.summary.score.percent) },
  criteria: Object.fromEntries(SCORE_KEYS.map((key) => [key, {
    before: before.summary.score.criteria[key],
    after: after.summary.score.criteria[key],
    delta: delta(before.summary.score.criteria[key], after.summary.score.criteria[key]),
  }])),
  retrieval: {
    recallAt3: { before: before.summary.retrieval.recallAt3, after: after.summary.retrieval.recallAt3, delta: delta(before.summary.retrieval.recallAt3, after.summary.retrieval.recallAt3) },
    crossTierLeaks: { before: before.summary.retrieval.crossTierLeaks, after: after.summary.retrieval.crossTierLeaks },
    p50Ms: { before: before.summary.retrieval.p50Ms, after: after.summary.retrieval.p50Ms },
    p95Ms: { before: before.summary.retrieval.p95Ms, after: after.summary.retrieval.p95Ms },
  },
  holdout: after.summary.holdout,
};

if (reports[2]) {
  const repeat = reports[2];
  Object.assign(comparison, {
    repeat: repeat.label,
    stable: {
      scoreDeltaPoints: delta(after.summary.score.percent, repeat.summary.score.percent),
      recallEqual: after.summary.retrieval.recallAt3 === repeat.summary.retrieval.recallAt3,
      zeroLeaksBoth: after.summary.retrieval.crossTierLeaks === 0 && repeat.summary.retrieval.crossTierLeaks === 0,
      withinOnePoint: Math.abs(repeat.summary.score.percent - after.summary.score.percent) <= 1,
    },
  });
}

console.log(JSON.stringify(comparison, null, 2));
