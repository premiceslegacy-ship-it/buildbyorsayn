import assert from "node:assert/strict";
import test from "node:test";
import { parseActivityPayload } from "../lib/activity";

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
