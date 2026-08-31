import assert from "node:assert/strict";
import test from "node:test";
import {
  ACCOMPANIMENT_ACCESS_STATUSES,
  isAccompanimentAdminUser,
  isAssignmentCurrentlyAccessible,
  mapAssignmentRow,
  mapWorkspaceContextRow,
  normalizeAssignmentStatus,
  normalizeTrack,
} from "../lib/accompanimentAccess";

test("only active and completed assignments are member-access statuses", () => {
  assert.deepEqual(ACCOMPANIMENT_ACCESS_STATUSES, ["active", "completed"]);
  assert.equal(
    isAssignmentCurrentlyAccessible(
      { status: "active", startsOn: "2026-08-01", endsOn: "2026-08-30" },
      "2026-08-30"
    ),
    true
  );
  assert.equal(
    isAssignmentCurrentlyAccessible(
      { status: "completed", startsOn: "2026-08-01", endsOn: null },
      "2026-08-30"
    ),
    true
  );
});

test("planned, revoked, future and expired assignments are denied", () => {
  const today = "2026-08-30";
  assert.equal(
    isAssignmentCurrentlyAccessible(
      { status: "planned", startsOn: "2026-08-01", endsOn: null },
      today
    ),
    false
  );
  assert.equal(
    isAssignmentCurrentlyAccessible(
      { status: "revoked", startsOn: "2026-08-01", endsOn: null },
      today
    ),
    false
  );
  assert.equal(
    isAssignmentCurrentlyAccessible(
      { status: "active", startsOn: "2026-09-01", endsOn: null },
      today
    ),
    false
  );
  assert.equal(
    isAssignmentCurrentlyAccessible(
      { status: "active", startsOn: "2026-07-01", endsOn: "2026-08-29" },
      today
    ),
    false
  );
});

test("trainer authorization uses the server user role or the configured admin identity", () => {
  assert.equal(isAccompanimentAdminUser(null), false);
  assert.equal(
    isAccompanimentAdminUser({ email: "trainer@example.com", app_metadata: { role: "trainer" } }),
    true
  );
  assert.equal(
    isAccompanimentAdminUser({ email: "admin@example.com", app_metadata: { role: "admin" } }),
    true
  );
  assert.equal(
    isAccompanimentAdminUser({ email: "member@example.com", app_metadata: {} }),
    false
  );
});

test("assignment rows are normalized before they reach the member interface", () => {
  assert.equal(normalizeTrack("unexpected"), "debutant");
  assert.equal(normalizeAssignmentStatus("unexpected"), "planned");
  assert.deepEqual(
    mapAssignmentRow({
      id: "assignment-1",
      user_id: "user-1",
      accompaniment_slug: "site-web",
      track: "agence",
      theme_ids: ["diagnostic", 42 as never, "business-copy"],
      status: "active",
      starts_on: "2026-08-01",
      ends_on: null,
      approved_at: "2026-08-01T10:00:00.000Z",
      approved_by: "trainer-1",
      notes: "Objectif clair",
    }),
    {
      id: "assignment-1",
      userId: "user-1",
      accompanimentSlug: "site-web",
      track: "agence",
      themeIds: ["diagnostic", "business-copy"],
      status: "active",
      startsOn: "2026-08-01",
      endsOn: null,
      approvedAt: "2026-08-01T10:00:00.000Z",
      approvedBy: "trainer-1",
      notes: "Objectif clair",
    }
  );
});

test("workspace context rows are normalized before rendering", () => {
  assert.deepEqual(
    mapWorkspaceContextRow({
      assignment_id: "assignment-1",
      company: "Atelier Exemple",
      project: "Refonte du site",
      site_url: "https://example.com",
      shared_notes: "Prochaine étape validée.",
      updated_by: "user-1",
      updated_at: "2026-08-31T18:00:00.000Z",
    }),
    {
      assignmentId: "assignment-1",
      company: "Atelier Exemple",
      project: "Refonte du site",
      siteUrl: "https://example.com",
      sharedNotes: "Prochaine étape validée.",
      updatedBy: "user-1",
      updatedAt: "2026-08-31T18:00:00.000Z",
    }
  );
});
