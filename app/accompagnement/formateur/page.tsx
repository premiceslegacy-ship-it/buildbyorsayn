export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { THEMES } from "@/lib/siteWebAccompagnement";
import { TrainerWorkspace } from "@/components/accompagnement/TrainerWorkspace";
import type { TrainerClient, TrainerThemeStat } from "@/components/accompagnement/TrainerWorkspace";

const REAL_ADMIN_EMAIL = "mbebourasam@gmail.com";
const RELANCE_AFTER_DAYS = 14;

type ProfileRow = {
  id: string;
  tier: string | null;
};

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
  hasStarted: boolean,
  lastActivity: string | null,
  progress: number
): TrainerClient["status"] {
  if (progress >= 100) return "Terminé";
  if (!hasStarted) return "À démarrer";
  if (!lastActivity) return "À relancer";
  const age = Date.now() - new Date(lastActivity).getTime();
  return age > RELANCE_AFTER_DAYS * 24 * 60 * 60 * 1000 ? "À relancer" : "En cours";
}

function readablePath(path: string | null) {
  if (!path) return null;
  if (path.startsWith("/accompagnement/espace")) return "Espace Site Web";
  if (path.startsWith("/accompagnement/site-web")) return "Offre Site Web";
  if (path.startsWith("/accompagnement")) return "Accompagnements";
  return "Autre page BUILD";
}

function readableEvent(event: string | null) {
  if (!event) return null;
  const labels: Record<string, string> = {
    page_view: "A ouvert une page",
    task_completed: "A terminé une tâche",
    theme_completed: "A terminé un thème",
    progress_sync: "Progression sauvegardée",
  };
  if (labels[event]) return labels[event];
  if (event.includes("task")) return "A travaillé sur une tâche";
  if (event.includes("theme")) return "A travaillé sur un thème";
  return "Activité enregistrée";
}

export default async function TrainerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== REAL_ADMIN_EMAIL) {
    redirect("/accompagnement");
  }

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    { data: profileData, error: profileError },
    { data: authData },
    { data: progressData, error: progressError },
    { data: presenceData, error: presenceError },
    { data: eventData, error: eventError },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, tier").order("id"),
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    supabaseAdmin
      .from("progress")
      .select("user_id, item_id")
      .like("item_id", "web-%")
      .limit(10000),
    supabaseAdmin
      .from("member_presence")
      .select("user_id, current_path, last_event, last_seen_at")
      .order("last_seen_at", { ascending: false })
      .limit(1000),
    supabaseAdmin
      .from("member_activity_events")
      .select("user_id, event_type, path, created_at")
      .order("created_at", { ascending: false })
      .limit(5000),
  ]);

  const validTaskIds = new Set(THEMES.flatMap((theme) => theme.tasks.map((task) => task.id)));
  const coreThemeTasks = THEMES.map((theme) => ({
    theme,
    tasks: theme.tasks.filter((task) => !task.tracks),
  }));
  const totalTasks = coreThemeTasks.reduce((sum, item) => sum + item.tasks.length, 0);
  const progressByUser = new Map<string, Set<string>>();

  for (const row of (progressData as ProgressRow[] | null) ?? []) {
    if (!validTaskIds.has(row.item_id)) continue;
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

  const profileRows = (profileData as ProfileRow[] | null) ?? [];
  const profileByUser = new Map(profileRows.map((profile) => [profile.id, profile]));
  const accompanimentUserIds = new Set<string>([
    ...profileRows.map((profile) => profile.id),
    ...progressByUser.keys(),
    ...presences.map((row) => row.user_id),
    ...events.map((row) => row.user_id),
  ]);
  const emailByUser = new Map(
    (authData?.users ?? []).map((item) => [item.id, item.email ?? item.id])
  );

  const clients: TrainerClient[] = [...accompanimentUserIds]
    .filter((id) => id !== user.id && emailByUser.has(id))
    .map((id) => {
      const completedIds = progressByUser.get(id) ?? new Set<string>();
      const presence = presenceByUser.get(id);
      const userEvents = eventsByUser.get(id) ?? [];
      const latestEvent = userEvents[0];
      const hasStarted = completedIds.size > 0 || Boolean(presence) || userEvents.length > 0;
      const lastActivity = latestDate([
        presence?.last_seen_at,
        ...userEvents.map((event) => event.created_at),
      ]);
      const completedCoreTasks = coreThemeTasks.reduce(
        (sum, item) => sum + item.tasks.filter((task) => completedIds.has(task.id)).length,
        0
      );
      const progress = totalTasks
        ? Math.min(100, Math.round((completedCoreTasks / totalTasks) * 100))
        : 0;
      const themes: TrainerThemeStat[] = coreThemeTasks.map(({ theme, tasks }) => ({
        id: theme.id,
        marker: theme.marker,
        title: theme.title,
        done: tasks.filter((task) => completedIds.has(task.id)).length,
        total: tasks.length,
      }));
      const currentTheme = themes.find((theme) => theme.done < theme.total);

      return {
        id,
        email: emailByUser.get(id) ?? id,
        tier: profileByUser.get(id)?.tier ?? null,
        hasStarted,
        progress,
        completed: completedIds.size,
        total: totalTasks,
        currentTheme: hasStarted
          ? currentTheme?.title ?? "Tous les thèmes sont parcourus"
          : "Pas encore commencé",
        currentThemeId: currentTheme?.id ?? null,
        currentPath: readablePath(presence?.current_path ?? latestEvent?.path ?? null),
        lastActivity,
        lastEvent: readableEvent(presence?.last_event ?? latestEvent?.event_type ?? null),
        status: statusFor(hasStarted, lastActivity, progress),
        themes,
      };
    })
    .sort((a, b) => {
      const rank: Record<TrainerClient["status"], number> = {
        "À relancer": 0,
        "En cours": 1,
        "À démarrer": 2,
        Terminé: 3,
      };
      if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
      if (!a.lastActivity && !b.lastActivity) return a.email.localeCompare(b.email);
      if (!a.lastActivity) return 1;
      if (!b.lastActivity) return -1;
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });

  const errors = [profileError, progressError, presenceError, eventError].filter(Boolean);
  const dataWarning = errors.length
    ? "Une partie des données n'est pas disponible. La vue reste limitée à ce qui a pu être lu."
    : undefined;

  return <TrainerWorkspace clients={clients} dataWarning={dataWarning} />;
}
