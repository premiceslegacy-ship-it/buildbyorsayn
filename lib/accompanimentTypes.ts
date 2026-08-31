import type { AccompanimentTrack } from "@/lib/siteWebAccompagnement";

export type AccompanimentAssignmentStatus =
  | "planned"
  | "active"
  | "completed"
  | "revoked";

export type AccompanimentAssignment = {
  id: string;
  userId: string;
  accompanimentSlug: string;
  track: AccompanimentTrack;
  themeIds: string[];
  status: AccompanimentAssignmentStatus;
  startsOn: string;
  endsOn: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  notes: string | null;
};

export type AccompanimentAssignmentRow = {
  id: string;
  user_id: string;
  accompaniment_slug: string;
  track: string;
  theme_ids: string[] | null;
  status: string;
  starts_on: string;
  ends_on: string | null;
  approved_at: string | null;
  approved_by: string | null;
  notes: string | null;
};

export type AccompanimentPerson = {
  id: string;
  email: string;
  displayName: string | null;
};

export type AccompanimentWorkspaceContext = {
  assignmentId: string;
  company: string;
  project: string;
  siteUrl: string;
  sharedNotes: string;
  updatedBy: string | null;
  updatedAt: string | null;
};

export type AccompanimentWorkspaceContextRow = {
  assignment_id: string;
  company: string | null;
  project: string | null;
  site_url: string | null;
  shared_notes: string | null;
  updated_by: string | null;
  updated_at: string | null;
};
