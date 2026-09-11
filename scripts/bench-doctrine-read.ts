/**
 * Standalone benchmark for readPublishedDoctrine(), isolated from HTTP and
 * page rendering - measures the parallelized-download gain from
 * lib/doctrine/publication.ts directly. Run: npx tsx scripts/bench-doctrine-read.ts
 */
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local", quiet: true });

const RUNS = Number(process.argv[2] ?? 5);

async function main() {
  const { readPublishedDoctrine, __resetDoctrineCacheForTests } = await import("../lib/doctrine/storage");

  const durations: number[] = [];
  for (let i = 0; i < RUNS; i++) {
    __resetDoctrineCacheForTests();
    const start = performance.now();
    try {
      await readPublishedDoctrine();
    } catch (error) {
      console.error(`Run ${i + 1}/${RUNS} failed:`, error);
      process.exitCode = 1;
      return;
    }
    durations.push(performance.now() - start);
  }

  durations.sort((a, b) => a - b);
  const min = durations[0];
  const max = durations[durations.length - 1];
  const mean = durations.reduce((sum, d) => sum + d, 0) / durations.length;
  const p95 = durations[Math.floor(durations.length * 0.95)] ?? max;

  console.log(`readPublishedDoctrine() - ${RUNS} cold runs (cache reset each time)`);
  console.log(`  min:  ${min.toFixed(1)}ms`);
  console.log(`  mean: ${mean.toFixed(1)}ms`);
  console.log(`  p95:  ${p95.toFixed(1)}ms`);
  console.log(`  max:  ${max.toFixed(1)}ms`);
}

main();
