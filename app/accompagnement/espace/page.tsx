export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { SiteWebWorkspace } from "@/components/accompagnement/SiteWebWorkspace";
import { createClient } from "@/lib/supabase/server";
import {
  ACCOMPANIMENT_ACCESS_STATUSES,
  SITE_WEB_ACCOMPANIMENT_SLUG,
  getUserDisplayName,
  mapAssignmentRow,
  mapWorkspaceContextRow,
} from "@/lib/accompanimentAccess";
import type {
  AccompanimentAssignmentRow,
  AccompanimentWorkspaceContextRow,
} from "@/lib/accompanimentTypes";
import { SITE_WEB_THEME_IDS } from "@/lib/siteWebAccompagnement";

export const metadata = {
  title: "Espace membre | BUILD",
  description: "Un thème à la fois, une compétence gagnée à la fois.",
};

export default async function SiteWebAccompanimentWorkspacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=${encodeURIComponent("/accompagnement/espace")}`);

  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("accompaniment_assignments")
    .select(
      "id, user_id, accompaniment_slug, track, theme_ids, status, starts_on, ends_on, approved_at, approved_by, notes"
    )
    .eq("user_id", user.id)
    .eq("accompaniment_slug", SITE_WEB_ACCOMPANIMENT_SLUG)
    .in("status", ACCOMPANIMENT_ACCESS_STATUSES)
    .lte("starts_on", today)
    .or(`ends_on.is.null,ends_on.gte.${today}`)
    .limit(1)
    .maybeSingle();

  if (error || !data) redirect("/accompagnement?access=restricted");

  const assignment = mapAssignmentRow(data as AccompanimentAssignmentRow);
  const validThemeIds = assignment.themeIds.filter((id) => SITE_WEB_THEME_IDS.includes(id));

  if (validThemeIds.length === 0) redirect("/accompagnement?access=restricted");

  const { data: contextData } = await supabase
    .from("accompaniment_workspace_context")
    .select("assignment_id, company, project, site_url, shared_notes, updated_by, updated_at")
    .eq("assignment_id", assignment.id)
    .maybeSingle();
  const workspaceContext = contextData
    ? mapWorkspaceContextRow(contextData as AccompanimentWorkspaceContextRow)
    : null;

  return (
    <SiteWebWorkspace
      memberName={getUserDisplayName(user)}
      assignment={{ ...assignment, themeIds: validThemeIds }}
      workspaceContext={workspaceContext}
    />
  );
}
