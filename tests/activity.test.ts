import assert from "node:assert/strict";
import test from "node:test";
import {
  ACTIVITY_ACCOUNT_PER_HOUR,
  ACTIVITY_BURST_PER_MINUTE,
  activityRateLimitChecks,
  parseActivityPayload,
} from "../lib/activity";

test("activity accepts only the small member-presence contract", () => {
  assert.deepEqual(
    parseActivityPayload({
      eventType: "page_view",
      path: "/dashboard",
      metadata: { title: "Tableau de bord", visibilityState: "visible" },
    }),
    {
      eventType: "page_view",
      path: "/dashboard",
      metadata: { title: "Tableau de bord", visibilityState: "visible" },
    }
  );

  assert.equal(parseActivityPayload({ eventType: "admin_override", path: "/" }), null);
  assert.equal(parseActivityPayload({ eventType: "heartbeat", path: "https://evil.test" }), null);
  assert.equal(
    parseActivityPayload({ eventType: "page_view", path: "/", metadata: { nested: { payload: true } } }),
    null
  );
  assert.equal(
    parseActivityPayload({ eventType: "page_view", path: "/", metadata: { title: "x".repeat(201) } }),
    null
  );
});

test("activity quotas bind both the account+address pair and the account alone, so rotating addresses cannot lift the account ceiling", () => {
  const pepper = "p".repeat(32);
  const user = "11111111-1111-4111-8111-111111111111";
  const fromParis = activityRateLimitChecks(user, "203.0.113.7", pepper);
  const fromElsewhere = activityRateLimitChecks(user, "198.51.100.9", pepper);
  assert.equal(fromParis.length, 2);
  assert.notEqual(fromParis[0].p_subject, fromElsewhere[0].p_subject, "burst key depends on the address");
  assert.equal(fromParis[1].p_subject, fromElsewhere[1].p_subject, "account key never depends on the address");
  assert.equal(fromParis[1].p_window_seconds, 3600);
  assert.equal(fromParis[1].p_max_per_window, ACTIVITY_ACCOUNT_PER_HOUR);
  assert.ok(ACTIVITY_ACCOUNT_PER_HOUR >= 60 * 5, "a normal hour of heartbeats and navigation fits under the account cap");
  assert.ok(ACTIVITY_ACCOUNT_PER_HOUR < ACTIVITY_BURST_PER_MINUTE * 60, "the account cap is stricter than sustained burst traffic");
  const other = activityRateLimitChecks("22222222-2222-4222-8222-222222222222", "203.0.113.7", pepper);
  assert.notEqual(other[1].p_subject, fromParis[1].p_subject);
  assert.match(fromParis[0].p_subject, /^activity:[0-9a-f]{64}$/);
  assert.doesNotMatch(JSON.stringify(fromParis), new RegExp(user), "raw ids never reach the rate-limit table");
  assert.throws(() => activityRateLimitChecks(user, "203.0.113.7", "short"));
});
