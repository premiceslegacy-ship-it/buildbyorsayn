export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { AdminMailComposer } from "@/components/AdminMailComposer";
import { buildEmailCatalog } from "@/lib/email/catalog";
import { getEmailContext } from "@/lib/email/context";
import { getSiteOrigin } from "@/lib/siteOrigin";
import { AdminUsersTable, type AdminUserRow } from "@/components/AdminUsersTable";
import AgentView from "@/components/admin/AgentView";
import { AdminShell } from "@/components/admin/AdminShell";
import NewsView from "@/components/admin/NewsView";
import { OverviewView } from "@/components/admin/OverviewView";
import { YoutubeNewsPanel } from "@/components/admin/YoutubeNewsPanel";
import { DaRoot } from "@/components/da/DaRoot";
import { BLOCS_DATA, displayLocationFromBlocId } from "@/lib/blocCatalog";
import type { AdminVideoLessonRow } from "@/lib/mux/adminServer";
import { withAdminThumbnailUrls } from "@/lib/mux/adminThumbnails.server";
import { createClient } from "@/lib/supabase/server";
import { AdminVideoManager } from "./AdminVideoManager";
import "./videos.css";
import "../../components/admin/agent/agent.css";

const TOTAL_BLOCS = BLOCS_DATA.length;
const DAY_MS = 24 * 60 * 60 * 1000;

type Profile = {
  id: string;
  tier: string | null;
  completed_blocks: number[] | null;
};

type Presence = {
  user_id: string;
  current_path: string | null;
  last_event: string | null;
  last_seen_at: string;
};

type ActivityEvent = {
  user_id: string;
  event_type: string;
  path: string | null;
  created_at: string;
};

function isInactiveForEmail(account: AdminUserRow, now: number) {
  return (account.tier === null || account.tier === "free")
    && now - new Date(account.createdAt).getTime() >= 14 * DAY_MS
    && (!account.lastSignIn || now - new Date(account.lastSignIn).getTime() >= 90 * DAY_MS);
}

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.app_metadata?.role !== "admin") redirect("/dashboard");

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  // Une page dynamique doit figer le même instant pour tous ses calculs de présence.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const emailContext = getEmailContext(getSiteOrigin());
  const since30Days = new Date(now - 30 * DAY_MS).toISOString();
  const [
    { data: profiles, error: profilesError },
    { data: authData, error: authError },
    { data: presenceData, error: presenceError },
    { data: eventData, error: eventError },
    { data: videoData, error: videoError },
    { data: videoNewsData },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, tier, completed_blocks").order("id").limit(1000),
    supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    supabaseAdmin
      .from("member_presence")
      .select("user_id, email, current_path, last_event, last_seen_at")
      .order("last_seen_at", { ascending: false })
      .limit(1000),
    supabaseAdmin
      .from("member_activity_events")
      .select("user_id, event_type, path, created_at")
      .gte("created_at", since30Days)
      .order("created_at", { ascending: false })
      .limit(10000),
    supabaseAdmin
      .from("video_lessons")
      .select("id,bloc_id,position,title,summary,transcript,transcript_segments,transcript_source,deliverables,chapters,thumbnail,tier_required,status,mux_upload_id,mux_asset_id,playback_id,duration_seconds,error_code,published_at,replaced_at,approved_at,created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    supabaseAdmin
      .from("build_news")
      .select("source_key,thumbnail_storage_path,internal_url")
      .like("source_key", "video:%")
      .limit(100),
  ]);

  const authUsers = authData?.users ?? [];
  const emailMap = new Map(authUsers.map((account) => [account.id, account.email ?? account.id]));
  const lastSignInMap = new Map(authUsers.map((account) => [account.id, account.last_sign_in_at ?? null]));
  const createdAtMap = new Map(authUsers.map((account) => [account.id, account.created_at]));
  const presenceMap = new Map(
    (((presenceData as Presence[] | null) ?? [])).map((presence) => [presence.user_id, presence]),
  );
  const allEvents = (eventData as ActivityEvent[] | null) ?? [];
  const recent24Hours = now - DAY_MS;
  const recent7Days = now - 7 * DAY_MS;
  const eventCountByUser = new Map<string, number>();
  const pageViews24hByUser = new Map<string, number>();
  const pageViews7dByUser = new Map<string, number>();
  const pageViews30dByUser = new Map<string, number>();
  const dailyPageViews = Array.from({ length: 7 }, (_, index) => ({
    date: new Date(now - (6 - index) * DAY_MS),
    value: 0,
  }));

  for (const event of allEvents) {
    const eventTime = new Date(event.created_at).getTime();
    if (!Number.isFinite(eventTime)) continue;
    if (eventTime >= recent24Hours) {
      eventCountByUser.set(event.user_id, (eventCountByUser.get(event.user_id) ?? 0) + 1);
    }
    if (event.event_type !== "page_view") continue;
    if (eventTime >= recent24Hours) {
      pageViews24hByUser.set(event.user_id, (pageViews24hByUser.get(event.user_id) ?? 0) + 1);
    }
    if (eventTime >= recent7Days) {
      pageViews7dByUser.set(event.user_id, (pageViews7dByUser.get(event.user_id) ?? 0) + 1);
      const ageInDays = Math.floor((now - eventTime) / DAY_MS);
      const bucket = dailyPageViews[6 - Math.min(6, Math.max(0, ageInDays))];
      if (bucket) bucket.value += 1;
    }
    pageViews30dByUser.set(event.user_id, (pageViews30dByUser.get(event.user_id) ?? 0) + 1);
  }

  const users: AdminUserRow[] = ((profiles as Profile[] | null) ?? []).map((profile) => ({
    ...profile,
    email: emailMap.get(profile.id) ?? profile.id,
    lastSignIn: lastSignInMap.get(profile.id) ?? null,
    createdAt: createdAtMap.get(profile.id) ?? new Date(0).toISOString(),
    currentPath: presenceMap.get(profile.id)?.current_path ?? null,
    lastActivity: presenceMap.get(profile.id)?.last_seen_at ?? null,
    lastEvent: presenceMap.get(profile.id)?.last_event ?? null,
    events24h: eventCountByUser.get(profile.id) ?? 0,
    pageViews24h: pageViews24hByUser.get(profile.id) ?? 0,
    pageViews7d: pageViews7dByUser.get(profile.id) ?? 0,
    pageViews30d: pageViews30dByUser.get(profile.id) ?? 0,
  })).sort((left, right) => {
    const leftDate = left.lastActivity ?? left.lastSignIn;
    const rightDate = right.lastActivity ?? right.lastSignIn;
    if (!leftDate && !rightDate) return left.email.localeCompare(right.email, "fr");
    if (!leftDate) return 1;
    if (!rightDate) return -1;
    return new Date(rightDate).getTime() - new Date(leftDate).getTime();
  });

  const fullCount = users.filter((account) => account.tier === "full").length;
  const beginnerCount = users.filter((account) => account.tier === "beginner").length;
  const onlineUsers = users.filter((account) => (
    account.lastActivity && now - new Date(account.lastActivity).getTime() < 2 * 60 * 1000
  ));
  const inactiveCandidateCount = users.filter((account) => isInactiveForEmail(account, now)).length;
  const interactiveUsers = authError ? [] : users;
  const averageBlocs = users.length
    ? users.reduce((total, account) => total + (account.completed_blocks?.length ?? 0), 0) / users.length
    : 0;
  const trackingSetupMissing = Boolean(profilesError || authError || presenceError || eventError);
  const adminVideos = await withAdminThumbnailUrls(supabaseAdmin, (videoData ?? []) as AdminVideoLessonRow[]);
  const videoNewsByVideoId = new Map(
    (((videoNewsData as Array<{ source_key: string | null; thumbnail_storage_path: string | null; internal_url: string | null }> | null) ?? [])
      .map((entry) => {
        const match = entry.source_key?.match(/^video:([^:]+):1$/);
        return match ? [match[1], entry] as const : null;
      })
      .filter((entry): entry is readonly [string, { source_key: string | null; thumbnail_storage_path: string | null; internal_url: string | null }] => entry !== null)),
  );
  const publishedVideos = adminVideos
    .filter((video) => Boolean(video.published_at) && !video.replaced_at)
    .map((video) => {
      const location = displayLocationFromBlocId(video.bloc_id);
      const locationLabel = location === "protocole" ? "Protocole" : location === null ? "Bloc" : `Bloc ${location}`;
      const news = videoNewsByVideoId.get(video.id);
      const thumbnailPath = news?.thumbnail_storage_path;
      const thumbnailUrl = thumbnailPath
        ? supabaseAdmin.storage.from("video-thumbnails").getPublicUrl(thumbnailPath).data.publicUrl
        : null;
      return {
        id: video.id,
        title: video.title,
        position: video.position,
        locationLabel,
        thumbnailUrl,
        href: news?.internal_url && emailContext.baseUrl
          ? `${emailContext.baseUrl}${news.internal_url}`
          : `${emailContext.baseUrl ?? ""}/blocs/${encodeURIComponent(video.bloc_id)}?video=${video.position}`,
      };
    });

  return (
    <DaRoot className="adm-root">
      <AdminShell
        userLabel="Samuel"
        counts={{ users: users.length }}
        views={{
          overview: (
            <OverviewView
              stats={{
                users: users.length,
                free: users.length - beginnerCount - fullCount,
                beginner: beginnerCount,
                full: fullCount,
                averageBlocs,
                totalBlocs: TOTAL_BLOCS,
                online: onlineUsers.length,
                active24h: users.filter((account) => account.events24h > 0).length,
                active7d: users.filter((account) => account.pageViews7d > 0).length,
                inactive30d: users.filter((account) => {
                  const lastSeen = account.lastActivity ?? account.lastSignIn;
                  return !lastSeen || new Date(lastSeen).getTime() < now - 30 * DAY_MS;
                }).length,
                pageViews24h: allEvents.filter((event) => (
                  event.event_type === "page_view" && new Date(event.created_at).getTime() >= recent24Hours
                )).length,
              }}
              dailyPageViews={dailyPageViews.map((item) => ({
                label: new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric" }).format(item.date),
                value: item.value,
              }))}
              onlineUsers={onlineUsers.slice(0, 8).map((account) => ({
                id: account.id,
                email: account.email,
                path: account.currentPath,
                tier: account.tier,
              }))}
              dataWarning={trackingSetupMissing ? "Une partie des chiffres d'activité est indisponible. Les comptes et les accès restent inchangés." : null}
            />
          ),
          users: (
            <AdminUsersTable
              users={interactiveUsers}
              totalBlocs={TOTAL_BLOCS}
              inactiveCandidateCount={authError ? 0 : inactiveCandidateCount}
              dataWarning={authError || profilesError ? "La liste complète des utilisateurs est momentanément indisponible. Aucune action n'est proposée." : null}
            />
          ),
          videos: (
            <AdminVideoManager
              blocs={[...BLOCS_DATA.map((bloc) => ({ id: bloc.id, displayNumber: bloc.displayNumber, title: bloc.titre })), { id: "protocole", displayNumber: "protocole" as const, title: "Protocole zéro" }]}
              initialVideos={adminVideos}
              setupMissing={Boolean(videoError)}
            />
          ),
          agent: <AgentView />,
          news: <NewsView youtubePanel={<YoutubeNewsPanel />} />,
          emails: (
            <AdminMailComposer
              emailContext={emailContext}
              catalog={buildEmailCatalog(emailContext)}
              publishedVideos={publishedVideos}
              from={process.env.RESEND_FROM_EMAIL?.trim() || "BUILD"}
              dataWarning={authError || profilesError ? "Les destinataires sont momentanément indisponibles. Aucun envoi n'est proposé." : null}
              users={interactiveUsers.map((account) => ({
                id: account.id,
                email: account.email,
                tier: account.tier,
                inactiveForEmail: isInactiveForEmail(account, now),
              }))}
            />
          ),
        }}
      />
    </DaRoot>
  );
}
