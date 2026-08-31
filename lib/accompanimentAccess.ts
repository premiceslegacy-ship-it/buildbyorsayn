import type { User } from "@supabase/supabase-js";
import type {
  AccompanimentAssignment,
  AccompanimentAssignmentRow,
  AccompanimentAssignmentStatus,
  AccompanimentWorkspaceContext,
  AccompanimentWorkspaceContextRow,
} from "@/lib/accompanimentTypes";
import type { AccompanimentTrack } from "@/lib/siteWebAccompagnement";

export const SITE_WEB_ACCOMPANIMENT_SLUG = "site-web";
export const ACCOMPANIMENT_ADMIN_EMAIL =
  process.env.BUILD_ADMIN_EMAIL ?? "mbebourasam@gmail.com";

export const ACCOMPANIMENT_ACCESS_STATUSES: AccompanimentAssignmentStatus[] = [
  "active",
  "completed",
];

export function isAccompanimentAdminUser(
  user: Pick<User, "email" | "app_metadata"> | null | undefined
) {
  const role = user?.app_metadata?.role;
  return Boolean(
    user &&
      (user.email === ACCOMPANIMENT_ADMIN_EMAIL ||
        role === "admin" ||
        role === "trainer")
  );
}

export function getUserDisplayName(
  user: Pick<User, "user_metadata"> | null | undefined
): string | null {
  const metadata = user?.user_metadata ?? {};
  const firstName = typeof metadata.first_name === "string" ? metadata.first_name.trim() : "";
  const lastName = typeof metadata.last_name === "string" ? metadata.last_name.trim() : "";
  const fullName = typeof metadata.full_name === "string" ? metadata.full_name.trim() : "";
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || fullName;

  if (!displayName || displayName.includes("@")) return null;
  return displayName;
}

export function isAssignmentCurrentlyAccessible(
  assignment: Pick<AccompanimentAssignment, "status" | "startsOn" | "endsOn">,
  today = new Date().toISOString().slice(0, 10)
) {
  if (!ACCOMPANIMENT_ACCESS_STATUSES.includes(assignment.status)) return false;
  if (assignment.startsOn > today) return false;
  if (assignment.endsOn && assignment.endsOn < today) return false;
  return true;
}

export function normalizeTrack(value: string): AccompanimentTrack {
  if (value === "experimente" || value === "agence") return value;
  return "debutant";
}

export function normalizeAssignmentStatus(value: string): AccompanimentAssignmentStatus {
  if (value === "active" || value === "completed" || value === "revoked") return value;
  return "planned";
}

export function mapAssignmentRow(row: AccompanimentAssignmentRow): AccompanimentAssignment {
  return {
    id: row.id,
    userId: row.user_id,
    accompanimentSlug: row.accompaniment_slug,
    track: normalizeTrack(row.track),
    themeIds: Array.isArray(row.theme_ids) ? row.theme_ids.filter((id) => typeof id === "string") : [],
    status: normalizeAssignmentStatus(row.status),
    startsOn: row.starts_on,
    endsOn: row.ends_on,
    approvedAt: row.approved_at,
    approvedBy: row.approved_by,
    notes: row.notes,
  };
}

export function mapWorkspaceContextRow(
  row: AccompanimentWorkspaceContextRow
): AccompanimentWorkspaceContext {
  return {
    assignmentId: row.assignment_id,
    company: typeof row.company === "string" ? row.company : "",
    project: typeof row.project === "string" ? row.project : "",
    siteUrl: typeof row.site_url === "string" ? row.site_url : "",
    sharedNotes: typeof row.shared_notes === "string" ? row.shared_notes : "",
    updatedBy: typeof row.updated_by === "string" ? row.updated_by : null,
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : null,
  };
}
