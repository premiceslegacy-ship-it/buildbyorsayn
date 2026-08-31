export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { TrainerWorkspace, type TrainerClient } from "@/components/accompagnement/TrainerWorkspace";
import { createClient } from "@/lib/supabase/server";
import {
  getUserDisplayName,
  isAccompanimentAdminUser,
  mapAssignmentRow,
  mapWorkspaceContextRow,
} from "@/lib/accompanimentAccess";
import type {
  AccompanimentAssignment,
  AccompanimentAssignmentRow,
  AccompanimentPerson,
  AccompanimentWorkspaceContextRow,
} from "@/lib/accompanimentTypes";
import { isThemeUnderstood, THEMES } from "@/lib/siteWebAccompagnement";

const RELANCE_AFTER_DAYS = 14;

type ProgressRow = {
  user_id: string;
  item_id: string;
};

type PresenceRow = {
  user_id: string;
  current_path: string | null;
  last_event: string | null;
  last_seen_at: string;
};

type ActivityRow = {
  user_id: string;
  event_type: string;
  path: string | null;
  created_at: string;
};

function latestDate(values: Array<string | null | undefined>) {
  return (
    values
      .filter((value): value is string => Boolean(value))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null
  );
}

function statusFor(
  assignment: AccompanimentAssignment,
  completedCount: number,
  totalThemes: number,
  lastActivity: string | null
): TrainerClient["statusLabel"] {
  if (assignment.status === "revoked") return "Accès retiré";
  if (assignment.status === "completed") return "Validé";
  if (assignment.status === "planned") return "Planifié";
  if (completedCount === totalThemes && totalThemes > 0) return "À valider";
  if (!lastActivity) return "À démarrer";
  const age = Date.now() - new Date(lastActivity).getTime();
  return age > RELANCE_AFTER_DAYS * 24 * 60 * 60 * 1000 ? "À relancer" : "En cours";
}

export default async function TrainerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAccompanimentAdminUser(user)) redirect("/accompagnement");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Configuration Supabase formateur incomplète.");
  const supabaseAdmin = createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const [
    { data: authData, error: authError },
    { data: assignmentData, error: assignmentError },
  ] = await Promise.all([
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    supabaseAdmin
      .from("accompaniment_assignments")
      .select(
        "id, user_id, accompaniment_slug, track, theme_ids, status, starts_on, ends_on, approved_at, approved_by, notes"
      )
      .eq("accompaniment_slug", "site-web")
      .order("starts_on", { ascending: false }),
  ]);

  const assignmentRows = (assignmentData as AccompanimentAssignmentRow[] | null) ?? [];
  const assignmentIds = assignmentRows
    .map((row) => row.id)
    .filter((id): id is string => typeof id === "string");
  const assignedUserIds = assignmentRows
    .map((row) => row.user_id)
    .filter((id): id is string => typeof id === "string");
  const emptyResult = { data: [], error: null };
  const [progressResult, presenceResult, eventResult, contextResult] = assignedUserIds.length
    ? await Promise.all([
        supabaseAdmin
          .from("progress")
          .select("user_id, item_id")
          .in("user_id", assignedUserIds)
          .eq("module_id", "web-accompagnement")
          .like("item_id", "web-%")
          .limit(10000),
        supabaseAdmin
          .from("member_presence")
          .select("user_id, current_path, last_event, last_seen_at")
          .in("user_id", assignedUserIds)
          .order("last_seen_at", { ascending: false })
          .limit(1000),
        supabaseAdmin
          .from("member_activity_events")
          .select("user_id, event_type, path, created_at")
          .in("user_id", assignedUserIds)
          .order("created_at", { ascending: false })
          .limit(5000),
        assignmentIds.length
          ? supabaseAdmin
              .from("accompaniment_workspace_context")
              .select("assignment_id, company, project, site_url, shared_notes, updated_by, updated_at")
              .in("assignment_id", assignmentIds)
              .limit(1000)
          : Promise.resolve(emptyResult),
      ])
    : [emptyResult, emptyResult, emptyResult, emptyResult];
  const progressData = progressResult.data as ProgressRow[] | null;
  const progressError = progressResult.error;
  const presenceData = presenceResult.data as PresenceRow[] | null;
  const presenceError = presenceResult.error;
  const eventData = eventResult.data as ActivityRow[] | null;
  const eventError = eventResult.error;
  const contextData = contextResult.data as AccompanimentWorkspaceContextRow[] | null;
  const contextError = contextResult.error;

  const authUsers = authData?.users ?? [];
  const userById = new Map(authUsers.map((authUser) => [authUser.id, authUser]));
  const people: AccompanimentPerson[] = authUsers
    .filter((authUser) => authUser.id !== user.id && Boolean(authUser.email))
    .map((authUser) => ({
      id: authUser.id,
      email: authUser.email ?? authUser.id,
      displayName: getUserDisplayName(authUser),
    }))
    .sort((a, b) => (a.displayName || a.email).localeCompare(b.displayName || b.email, "fr"));

  const progressByUser = new Map<string, Set<string>>();
  for (const row of (progressData as ProgressRow[] | null) ?? []) {
    if (typeof row.user_id !== "string" || typeof row.item_id !== "string") continue;
    const current = progressByUser.get(row.user_id) ?? new Set<string>();
    current.add(row.item_id);
    progressByUser.set(row.user_id, current);
  }

  const presences = ((presenceData as PresenceRow[] | null) ?? []).filter((row) =>
    row.current_path?.startsWith("/accompagnement")
  );
  const events = ((eventData as ActivityRow[] | null) ?? []).filter((row) =>
    row.path?.startsWith("/accompagnement")
  );
  const presenceByUser = new Map<string, PresenceRow>();
  presences.forEach((row) => {
    if (!presenceByUser.has(row.user_id)) presenceByUser.set(row.user_id, row);
  });
  const eventsByUser = new Map<string, ActivityRow[]>();
  events.forEach((event) => {
    const current = eventsByUser.get(event.user_id) ?? [];
    current.push(event);
    eventsByUser.set(event.user_id, current);
  });

  const assignments = ((assignmentData as AccompanimentAssignmentRow[] | null) ?? [])
    .map(mapAssignmentRow)
    .filter((assignment) => userById.has(assignment.userId));
  const contextByAssignment = new Map(
    (contextData ?? []).map((row) => [row.assignment_id, mapWorkspaceContextRow(row)])
  );

  const clients: TrainerClient[] = assignments
    .filter((assignment) => assignment.userId !== user.id)
    .map((assignment) => {
      const completedItems = progressByUser.get(assignment.userId) ?? new Set<string>();
      const assignedThemes = assignment.themeIds
        .map((themeId) => THEMES.find((theme) => theme.id === themeId))
        .filter((theme): theme is (typeof THEMES)[number] => Boolean(theme));
      const understoodIds = assignedThemes
        .filter((theme) => isThemeUnderstood(theme.id, assignment.track, completedItems))
        .map((theme) => theme.id);
      const presence = presenceByUser.get(assignment.userId);
      const userEvents = eventsByUser.get(assignment.userId) ?? [];
      const lastActivity = latestDate([
        presence?.last_seen_at,
        ...userEvents.map((event) => event.created_at),
      ]);
      const statusLabel = statusFor(assignment, understoodIds.length, assignedThemes.length, lastActivity);
      const authUser = userById.get(assignment.userId);

      return {
        id: assignment.userId,
        email: authUser?.email ?? assignment.userId,
        displayName: authUser ? getUserDisplayName(authUser) : null,
        assignment,
        themes: assignedThemes.map((theme) => ({
          id: theme.id,
          marker: theme.marker,
          title: theme.title,
          understood: understoodIds.includes(theme.id),
        })),
        completedCount: understoodIds.length,
        statusLabel,
        lastActivity,
        activityCount: userEvents.length,
        workspaceContext: contextByAssignment.get(assignment.id) ?? null,
      };
    })
    .sort((a, b) => {
      const rank: Record<TrainerClient["statusLabel"], number> = {
        "À valider": 0,
        "À relancer": 1,
        "À démarrer": 2,
        "En cours": 3,
        Planifié: 4,
        Validé: 5,
        "Accès retiré": 6,
      };
      if (rank[a.statusLabel] !== rank[b.statusLabel]) return rank[a.statusLabel] - rank[b.statusLabel];
      return a.email.localeCompare(b.email, "fr");
    });

  const errors = [authError, assignmentError, progressError, presenceError, eventError, contextError].filter(Boolean);
  const dataWarning = errors.length
    ? "Une partie des données n'est pas disponible. Vérifie la migration d'accès et les tables de suivi avant d'inscrire une personne."
    : null;

  return <TrainerWorkspace clients={clients} people={people} dataWarning={dataWarning} />;
}
