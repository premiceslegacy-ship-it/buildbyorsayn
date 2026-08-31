export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { Activity, ArrowLeft, Eye, MousePointerClick, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { BLOCS_DATA } from "@/lib/mockData";
import { AdminAutoRefresh } from "@/components/AdminAutoRefresh";
import { AdminMailComposer } from "@/components/AdminMailComposer";
import { AdminUsersTable } from "@/components/AdminUsersTable";

const ADMIN_EMAIL = "mbebourasam@gmail.com";
const TOTAL_BLOCS = BLOCS_DATA.length;

type Profile = {
  id: string;
  tier: string | null;
  completed_blocks: number[] | null;
};

type EnrichedUser = Profile & {
  email: string;
  lastSignIn: string | null;
  currentPath: string | null;
  lastActivity: string | null;
  lastEvent: string | null;
  events24h: number;
  pageViews24h: number;
  pageViews7d: number;
  pageViews30d: number;
};

type Presence = {
  user_id: string;
  email: string | null;
  current_path: string | null;
  last_event: string | null;
  last_seen_at: string;
};

type ActivityEvent = {
  user_id: string;
  email: string | null;
  event_type: string;
  path: string | null;
  created_at: string;
};

export default async function AdminPage() {
  // ── 1. Vérification identité ──────────────────────────────────────────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  // ── 2. Récupération des données via le client admin ───────────────────────
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [
    { data: profiles },
    { data: authData },
    { data: presenceData, error: presenceError },
    { data: eventData, error: eventError },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, tier, completed_blocks").order("id"),
    supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }),
    supabaseAdmin
      .from("member_presence")
      .select("user_id, email, current_path, last_event, last_seen_at")
      .order("last_seen_at", { ascending: false })
      .limit(1000),
    supabaseAdmin
      .from("member_activity_events")
      .select("user_id, email, event_type, path, created_at")
      .order("created_at", { ascending: false })
      .limit(1000),
  ]);

  const emailMap = new Map<string, string>(
    (authData?.users ?? []).map((u) => [u.id, u.email ?? "-"])
  );
  const lastSignInMap = new Map<string, string | null>(
    (authData?.users ?? []).map((u) => [u.id, u.last_sign_in_at ?? null])
  );
  const presenceMap = new Map<string, Presence>(
    ((presenceData as Presence[] | null) ?? []).map((p) => [p.user_id, p])
  );

  const now = Date.now();
  const last24h = now - 24 * 60 * 60 * 1000;
  const last7d = now - 7 * 24 * 60 * 60 * 1000;
  const last30d = now - 30 * 24 * 60 * 60 * 1000;
  const allEvents = (eventData as ActivityEvent[] | null) ?? [];
  const recentEvents = allEvents.filter(
    (event) => new Date(event.created_at).getTime() >= last24h
  );
  const eventCountByUser = new Map<string, number>();
  const pageViewCountByUser = new Map<string, number>();
  const pageViews7dByUser = new Map<string, number>();
  const pageViews30dByUser = new Map<string, number>();

  for (const event of recentEvents) {
    eventCountByUser.set(event.user_id, (eventCountByUser.get(event.user_id) ?? 0) + 1);
    if (event.event_type === "page_view") {
      pageViewCountByUser.set(event.user_id, (pageViewCountByUser.get(event.user_id) ?? 0) + 1);
    }
  }

  for (const event of allEvents) {
    if (event.event_type !== "page_view") continue;
    const t = new Date(event.created_at).getTime();
    if (t >= last7d) {
      pageViews7dByUser.set(event.user_id, (pageViews7dByUser.get(event.user_id) ?? 0) + 1);
    }
    if (t >= last30d) {
      pageViews30dByUser.set(event.user_id, (pageViews30dByUser.get(event.user_id) ?? 0) + 1);
    }
  }

  const users: EnrichedUser[] = (profiles ?? []).map((p: Profile) => ({
    ...p,
    email: emailMap.get(p.id) ?? p.id,
    lastSignIn: lastSignInMap.get(p.id) ?? null,
    currentPath: presenceMap.get(p.id)?.current_path ?? null,
    lastActivity: presenceMap.get(p.id)?.last_seen_at ?? null,
    lastEvent: presenceMap.get(p.id)?.last_event ?? null,
    events24h: eventCountByUser.get(p.id) ?? 0,
    pageViews24h: pageViewCountByUser.get(p.id) ?? 0,
    pageViews7d: pageViews7dByUser.get(p.id) ?? 0,
    pageViews30d: pageViews30dByUser.get(p.id) ?? 0,
  })).sort((a, b) => {
    const aTime = a.lastActivity ?? a.lastSignIn;
    const bTime = b.lastActivity ?? b.lastSignIn;
    if (!aTime && !bTime) return 0;
    if (!aTime) return 1;
    if (!bTime) return -1;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });

  const fullCount = users.filter((u) => u.tier === "full").length;
  const beginnerCount = users.filter((u) => u.tier === "beginner").length;
  const paidCount = fullCount + beginnerCount;
  const onlineCount = users.filter((u) => {
    if (!u.lastActivity) return false;
    return now - new Date(u.lastActivity).getTime() < 2 * 60 * 1000;
  }).length;
  const active24hCount = users.filter((u) => u.events24h > 0).length;
  const active7dCount = users.filter((u) => u.pageViews7d > 0).length;
  const inactive30dCount = users.filter((u) => {
    const t = u.lastActivity ?? u.lastSignIn;
    if (!t) return true;
    return new Date(t).getTime() < last30d;
  }).length;
  const pageViews24h = recentEvents.filter((event) => event.event_type === "page_view").length;
  const trackingSetupMissing = Boolean(presenceError || eventError);

  const avgBlocs =
    users.length === 0
      ? 0
      : (
          users.reduce(
            (acc, u) => acc + (u.completed_blocks?.length ?? 0),
            0
          ) / users.length
        ).toFixed(1);

  // ── 3. Render ─────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#0a0a0b] text-[#f0ede8] font-sans">
      {/* Halos */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-4 blur-[160px] w-[700px] h-[250px] rounded-full pointer-events-none" />

      <div className="max-w-full mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Dashboard
          </Link>
          <p className="text-xs uppercase tracking-[0.15em] text-white/30 font-semibold">
            Admin · Accès restreint
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#f0ede8]">
                Tableau de bord utilisateurs
              </h1>
              <p className="mt-2 text-sm text-white/35">
                Présence réelle, progression, activité et pilotage des accès.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/accompagnement/formateur"
                className="border border-[#c9b48a]/50 px-4 py-2.5 text-sm text-[#e8d5b0] transition-colors hover:border-[#c9b48a] hover:bg-[#e8d5b0]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
              >
                Gérer les accompagnements
              </Link>
              <AdminAutoRefresh />
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4 mb-6">
          {[
            { label: "Utilisateurs", value: users.length, icon: Users },
            { label: "En ligne", value: onlineCount, icon: Activity },
            { label: "Actifs 24h", value: active24hCount, icon: MousePointerClick },
            { label: "Actifs 7j", value: active7dCount, icon: MousePointerClick },
            { label: "Inactifs 30j+", value: inactive30dCount, icon: Eye },
            { label: "Pages vues 24h", value: pageViews24h, icon: Eye },
            { label: "Gratuits", value: users.length - paidCount, icon: Users },
            { label: "Fondations", value: beginnerCount, icon: Users },
            { label: "Complet", value: fullCount, icon: Users },
            { label: "Blocs moy.", value: `${avgBlocs} / ${TOTAL_BLOCS}`, icon: Activity },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="bg-white/[0.03] border border-white/8 rounded-2xl p-4"
            >
              <kpi.icon className="mb-3 h-4 w-4 text-[#e8d5b0]/60" />
              <p className="text-[10px] text-white/35 uppercase tracking-wider mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-[#e8d5b0]">{kpi.value}</p>
            </div>
          ))}
        </div>

        {trackingSetupMissing && (
          <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-400/8 px-4 py-3 text-sm text-amber-100/70">
            Tracking prêt côté app, mais les tables Supabase ne répondent pas encore. Applique la migration
            {" "}
            <span className="font-mono text-amber-100">supabase/migrations/20260627190000_member_activity_tracking.sql</span>
            {" "}
            pour activer présence et événements.
          </div>
        )}

        <div className="mb-10">
          <AdminMailComposer
            users={users.map((u) => ({
              id: u.id,
              email: u.email,
              tier: u.tier,
            }))}
          />
        </div>

        <AdminUsersTable users={users} totalBlocs={TOTAL_BLOCS} />

        <p className="mt-6 text-center text-xs text-white/20">
          {users.length} utilisateur{users.length !== 1 ? "s" : ""} · triés par dernière activité · données en temps réel
        </p>
      </div>
    </main>
  );
}
