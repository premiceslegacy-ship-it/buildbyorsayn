import assert from "node:assert/strict";
import test from "node:test";
import { createPositionReporter, type LessonPositionSnapshot } from "../lib/lessons/positionReporter";

function setup() {
  let clock = 1_000_000;
  const saved: LessonPositionSnapshot[] = [];
  const resolvers: (() => void)[] = [];
  let completions = 0;
  const report = createPositionReporter({
    now: () => clock,
    onCompleted: () => { completions += 1; },
    save: (snapshot) => new Promise<void>((resolve) => { saved.push(snapshot); resolvers.push(resolve); }),
  });
  const settle = async () => { resolvers.splice(0).forEach((resolve) => resolve()); await new Promise((r) => setImmediate(r)); };
  return { report, saved, settle, advance: (ms: number) => { clock += ms; }, completions: () => completions };
}

test("saves at most once per 15 seconds while playing", async () => {
  const t = setup();
  t.report(10, 600);
  await t.settle();
  t.advance(5_000); t.report(15, 600); await t.settle();
  t.advance(9_999); t.report(25, 600); await t.settle();
  assert.equal(t.saved.length, 1);
  t.advance(1); t.report(26, 600); await t.settle();
  assert.deepEqual(t.saved.map((s) => s.positionSeconds), [10, 26]);
});

test("a forced report (pause/end) bypasses the throttle and the in-flight guard", async () => {
  const t = setup();
  t.report(10, 600);                       // in flight, not settled
  t.advance(20_000); t.report(30, 600);    // throttle elapsed but a save is in flight: skipped
  assert.equal(t.saved.length, 1);
  t.report(31, 600, true);                 // pause must never be dropped
  assert.deepEqual(t.saved.map((s) => s.positionSeconds), [10, 31]);
});

test("completion fires once at 90% and is persisted as completed", async () => {
  const t = setup();
  t.report(539, 600); await t.settle();
  assert.equal(t.completions(), 0);
  assert.equal(t.saved.at(-1)?.completed, false);
  t.advance(15_000); t.report(540, 600); await t.settle();
  assert.equal(t.completions(), 1);
  assert.equal(t.saved.at(-1)?.completed, true);
  t.advance(15_000); t.report(600, 600, true); await t.settle();
  t.report(601, 600, true); await t.settle();
  assert.equal(t.completions(), 1, "never re-notified");
});

test("completed stays true if the viewer scrubs back after finishing", async () => {
  const t = setup();
  t.report(560, 600, true); await t.settle();
  t.report(5, 600, true); await t.settle();
  assert.deepEqual(t.saved.at(-1), { positionSeconds: 5, completed: true });
});

test("ignores unusable readings and floors the position", async () => {
  const t = setup();
  t.report(NaN, 600); t.report(10, 0); t.report(10, NaN); t.report(Infinity, 600, true); t.report(-5, 600, true);
  await t.settle();
  assert.deepEqual(t.saved, [{ positionSeconds: 0, completed: false }]);
  t.report(12.9, 600, true);
  assert.equal(t.saved.at(-1)?.positionSeconds, 12);
});

test("a failing save is logged, not thrown, and does not block the next report", async () => {
  let calls = 0;
  const errors: unknown[] = [];
  const original = console.error;
  console.error = (...args: unknown[]) => { errors.push(args); };
  try {
    const report = createPositionReporter({
      now: () => 0,
      onCompleted: () => {},
      save: async () => { calls += 1; if (calls === 1) throw new Error("rls"); },
    });
    report(10, 600, true);
    await new Promise((r) => setImmediate(r));
    report(20, 600, true);
    await new Promise((r) => setImmediate(r));
    assert.equal(calls, 2);
    assert.equal(errors.length, 1);
  } finally {
    console.error = original;
  }
});
