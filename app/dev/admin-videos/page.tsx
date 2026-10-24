import { notFound } from "next/navigation";
import { AdminVideoManager } from "@/app/admin/AdminVideoManager";
import "@/app/admin/videos.css";

export const dynamic = "force-dynamic";

type DemoQuery = { etat?: string | string[]; ouvert?: string | string[] };

const locations = [
  ...Array.from({ length: 7 }, (_, index) => ({ id: String(index + 1), displayNumber: index + 1, title: `Bloc ${index + 1}` })),
  { id: "protocole", displayNumber: "protocole" as const, title: "Protocole zéro" },
];

function demoVideo(id: string, blocId: string, position: number, status: "waiting" | "preparing" | "ready" | "errored" | "cancelled", title: string, options: Partial<Record<string, unknown>> = {}) {
  const complete = status === "ready" && options.complete !== false;
  return {
    id,
    bloc_id: blocId,
    position,
    title,
    summary: complete ? "Un résumé court pour comprendre ce que tu vas regarder." : "",
    transcript: complete ? "Une transcription relue suffisamment longue pour valider la publication de cet épisode." : "",
    transcript_segments: [],
    transcript_source: "automatic" as const,
    deliverables: [],
    chapters: complete ? [{ index: 1, title: "Introduction", startSeconds: 0 }] : [],
    thumbnail: complete ? "mux:15" : null,
    thumbnailUrl: "/da/mini/b1.jpg",
    tier_required: blocId === "1" || blocId === "protocole" ? "beginner" as const : "full" as const,
    status,
    mux_upload_id: `upload-${id}`,
    mux_asset_id: status === "waiting" ? null : `asset-${id}`,
    playback_id: status === "waiting" ? null : `playback-${id}`,
    duration_seconds: status === "waiting" ? null : 612,
    error_code: status === "errored" ? "processing_failed" : null,
    published_at: status === "cancelled" ? null : options.published_at as string | null ?? null,
    replaced_at: status === "cancelled" ? new Date().toISOString() : options.replaced_at as string | null ?? null,
    approved_at: null,
    created_at: new Date().toISOString(),
  };
}

export default async function AdminVideosDemoPage({ searchParams }: { searchParams: Promise<DemoQuery> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const query = await searchParams;
  const only = typeof query.etat === "string" ? query.etat : undefined;
  const all = [
    ...Array.from({ length: 6 }, (_, index) => demoVideo(`10000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`, "1", index + 1, "ready", `Épisode ${index + 1} du bloc`, index === 0 ? { complete: false } : undefined)),
    demoVideo("20000000-0000-4000-8000-000000000001", "2", 1, "waiting", "Envoi en attente"),
    demoVideo("20000000-0000-4000-8000-000000000002", "3", 1, "preparing", "Traitement en cours"),
    demoVideo("20000000-0000-4000-8000-000000000003", "4", 1, "ready", "Prête à relire", { published_at: "2026-10-24T08:00:00.000Z" }),
    demoVideo("20000000-0000-4000-8000-000000000004", "5", 1, "cancelled", "Ancienne version", { replaced_at: "2026-10-24T08:00:00.000Z" }),
    demoVideo("20000000-0000-4000-8000-000000000005", "6", 1, "errored", "Problème de traitement"),
    demoVideo("20000000-0000-4000-8000-000000000006", "protocole", 1, "ready", "Le protocole zéro"),
  ];
  const videos = only ? all.filter((video) => video.status === only || (only === "online" && video.published_at)) : all;
  const openRaw = typeof query.ouvert === "string" ? Number(query.ouvert) : NaN;
  const initialOpenIndex = Number.isInteger(openRaw) && openRaw >= 0 && openRaw < videos.length ? openRaw : undefined;
  return <main style={{ minHeight: "100vh", padding: "clamp(20px, 4vw, 64px)", background: "#0e1110" }}><h1 style={{ margin: "0 0 20px", color: "#f4f5f2", font: "600 clamp(32px, 4vw, 48px)/1.08 var(--font-t)", letterSpacing: "-.045em" }}>Vidéos</h1><AdminVideoManager blocs={locations} initialVideos={videos} initialOpenIndex={initialOpenIndex} setupMissing={false} demo /></main>;
}
