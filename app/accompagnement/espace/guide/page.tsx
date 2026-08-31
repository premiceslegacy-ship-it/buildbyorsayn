export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { AutonomyGuidePrint } from "@/components/accompagnement/AutonomyGuidePrint";
import { createClient } from "@/lib/supabase/server";
import {
  ACCOMPANIMENT_ACCESS_STATUSES,
  SITE_WEB_ACCOMPANIMENT_SLUG,
  getUserDisplayName,
  mapAssignmentRow,
} from "@/lib/accompanimentAccess";
import type { AccompanimentAssignmentRow } from "@/lib/accompanimentTypes";
import { isThemeUnderstood, THEMES } from "@/lib/siteWebAccompagnement";

export const metadata = {
  title: "Guide d'autonomie | BUILD",
  description: "Le guide pour continuer à progresser avec tes agents IA.",
};

export default async function AutonomyGuidePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/accompagnement/espace/guide")}`);

  const today = new Date().toISOString().slice(0, 10);
  const { data: assignmentData, error: assignmentError } = await supabase
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

  if (assignmentError || !assignmentData) redirect("/accompagnement?access=restricted");

  const assignment = mapAssignmentRow(assignmentData as AccompanimentAssignmentRow);
  const themes = THEMES.filter((theme) => assignment.themeIds.includes(theme.id));
  if (!themes.length) redirect("/accompagnement?access=restricted");

  const { data: progressData } = await supabase
    .from("progress")
    .select("item_id")
    .eq("module_id", "web-accompagnement")
    .like("item_id", "web-%");
  const completedItems = new Set(
    (progressData ?? [])
      .map((item) => item.item_id)
      .filter((item): item is string => typeof item === "string")
  );
  const understoodThemeIds = themes
    .filter((theme) => isThemeUnderstood(theme.id, assignment.track, completedItems))
    .map((theme) => theme.id);

  return (
    <AutonomyGuidePrint
      memberName={getUserDisplayName(user)}
      track={assignment.track}
      themes={themes}
      understoodThemeIds={understoodThemeIds}
    />
  );
}
