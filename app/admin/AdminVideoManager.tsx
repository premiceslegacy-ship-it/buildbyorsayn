"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ADMIN_VIDEO_CONFIRMATION,
  MAX_ADMIN_VIDEO_BYTES,
  VIDEO_MIME_TYPES,
  type VideoChapter,
} from "@/lib/mux/adminLessons";
import type { AdminVideoLessonRow } from "@/lib/mux/adminServer";

type SectionOption = { id: string; title: string; blocTitle: string };
type ApiResult = { ok: boolean; error?: string; videoId?: string; uploadUrl?: string; previousAssetId?: string | null };

function parseChapterLines(value: string): VideoChapter[] | null {
  const chapters: VideoChapter[] = [];
  for (const rawLine of value.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = /^((?:\d+:)?\d{1,3}:\d{2})\s+(.+)$/.exec(line);
    if (!match) return null;
    const parts = match[1].split(":").map(Number);
    const seconds = parts.length === 2
      ? parts[0] * 60 + parts[1]
      : parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (!Number.isSafeInteger(seconds) || parts.at(-1)! >= 60 || (parts.length === 3 && parts[1] >= 60)) return null;
    chapters.push({ index: chapters.length + 1, title: match[2].trim(), startSeconds: seconds });
  }
  return chapters.length > 0 ? chapters : null;
}

function uploadToMux(url: string, file: File, onProgress: (percentage: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    });
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error("upload_failed"));
    });
    request.addEventListener("error", () => reject(new Error("upload_failed")));
    request.send(file);
  });
}

const STATUS_LABELS: Record<AdminVideoLessonRow["status"], string> = {
  waiting: "Envoi en attente",
  preparing: "Traitement Mux",
  ready: "Prête à relire",
  errored: "Erreur de traitement",
  cancelled: "Envoi annulé",
};

export function AdminVideoManager({
  sections,
  initialVideos,
  setupMissing,
}: {
  sections: SectionOption[];
  initialVideos: AdminVideoLessonRow[];
  setupMissing: boolean;
}) {
  const [videos, setVideos] = useState(initialVideos);
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const selected = sections.find((section) => section.id === sectionId);
  const [title, setTitle] = useState(sections[0]?.title ?? "");
  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [chapters, setChapters] = useState(`0:00 ${sections[0]?.title ?? "Introduction"}`);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [publishId, setPublishId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const pollRef = useRef<number | null>(null);

  const hasProcessingVideo = useMemo(
    () => videos.some((video) => video.status === "waiting" || video.status === "preparing"),
    [videos]
  );

  const refreshVideos = async () => {
    const response = await fetch("/api/admin/videos", { cache: "no-store" });
    const payload = await response.json().catch(() => null) as { ok?: boolean; videos?: AdminVideoLessonRow[] } | null;
    if (response.ok && payload?.ok && Array.isArray(payload.videos)) setVideos(payload.videos);
  };

  useEffect(() => {
    if (!hasProcessingVideo) return;
    pollRef.current = window.setInterval(() => { void refreshVideos(); }, 3_000);
    return () => {
      if (pollRef.current !== null) window.clearInterval(pollRef.current);
    };
  }, [hasProcessingVideo]);

  const changeSection = (nextId: string) => {
    setSectionId(nextId);
    const next = sections.find((section) => section.id === nextId);
    if (next) {
      setTitle(next.title);
      setChapters(`0:00 ${next.title}`);
    }
  };

  const startUpload = async () => {
    setMessage(null);
    if (!file || !VIDEO_MIME_TYPES.includes(file.type as (typeof VIDEO_MIME_TYPES)[number])) {
      setMessage("Choisis une vidéo MP4, MOV, WebM ou M4V.");
      return;
    }
    if (file.size > MAX_ADMIN_VIDEO_BYTES) {
      setMessage("Le fichier dépasse la limite définie pour l'admin.");
      return;
    }
    const parsedChapters = parseChapterLines(chapters);
    if (!parsedChapters) {
      setMessage("Écris un chapitre par ligne sous la forme 0:00 Titre.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId,
          title,
          summary,
          transcript,
          deliverables: deliverables.split("\n").map((item) => item.trim()).filter(Boolean),
          chapters: parsedChapters,
          file: { name: file.name, size: file.size, type: file.type },
        }),
      });
      const payload = await response.json().catch(() => ({})) as ApiResult;
      if (!response.ok || !payload.ok || !payload.uploadUrl) throw new Error(payload.error ?? "create_failed");
      setProgress(0);
      await uploadToMux(payload.uploadUrl, file, setProgress);
      setProgress(100);
      setMessage("Envoi terminé. Mux traite la vidéo et ses sous-titres français.");
      await refreshVideos();
    } catch (error) {
      setMessage(error instanceof Error && error.message !== "create_failed"
        ? error.message
        : "L'envoi a échoué. Tu peux réessayer sans publier.");
    } finally {
      setBusy(false);
    }
  };

  const publish = async (videoId: string) => {
    if (confirmation !== ADMIN_VIDEO_CONFIRMATION) return;
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/videos/${videoId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true, confirmation }),
      });
      const payload = await response.json().catch(() => ({})) as ApiResult;
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "La publication a échoué.");
      setPublishId(null);
      setConfirmation("");
      setMessage(payload.previousAssetId
        ? `Vidéo publiée. Supprime manuellement l'ancien asset Mux ${payload.previousAssetId}.`
        : "Vidéo publiée. Elle est maintenant disponible dans son chapitre.");
      await refreshVideos();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "La publication a échoué.");
    } finally {
      setBusy(false);
    }
  };

  const cancel = async (videoId: string) => {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({})) as ApiResult;
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "L'annulation a échoué.");
      setMessage("Envoi annulé.");
      await refreshVideos();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "L'annulation a échoué.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mb-10 rounded-2xl border border-white/8 bg-white/[0.02] p-5 md:p-6" aria-labelledby="admin-video-title">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#e8d5b0]">Vidéos</p>
        <h2 id="admin-video-title" className="mt-2 text-xl font-semibold text-[#f0ede8]">Envoyer et publier un chapitre</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/45">
          Le fichier va directement vers Mux. La transcription relue entre dans le corpus du compagnon seulement après ta publication.
        </p>
      </div>

      {setupMissing ? (
        <p role="status" className="rounded-xl border border-amber-400/20 bg-amber-400/8 px-4 py-3 text-sm text-amber-100/75">
          La table vidéo n'est pas encore disponible. Applique la migration locale prévue avant d'utiliser cette vue.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
          <div className="space-y-4">
            <label className="block text-sm text-white/65">
              Chapitre BUILD
              <select value={sectionId} onChange={(event) => changeSection(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-3 text-white">
                {sections.map((section) => <option key={section.id} value={section.id}>{section.blocTitle} : {section.title}</option>)}
              </select>
            </label>
            <label className="block text-sm text-white/65">Titre<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} className="mt-2 w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-3 text-white" /></label>
            <label className="block text-sm text-white/65">Résumé<textarea value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={2000} rows={3} className="mt-2 w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-3 text-white" /></label>
            <label className="block text-sm text-white/65">
              Transcription relue
              <textarea value={transcript} onChange={(event) => setTranscript(event.target.value)} maxLength={250000} rows={9} placeholder="[0:00] Ce que tu dis dans la vidéo..." className="mt-2 w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-3 text-white" />
              <span className="mt-1 block text-xs text-white/30">Ajoute [2:10] au début d'une ligne quand tu as un repère exact.</span>
            </label>
            <label className="block text-sm text-white/65">Chapitres et repères<textarea value={chapters} onChange={(event) => setChapters(event.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-3 font-mono text-sm text-white" /></label>
            <label className="block text-sm text-white/65">Livrables, trois lignes maximum<textarea value={deliverables} onChange={(event) => setDeliverables(event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-white/10 bg-[#111113] px-3 py-3 text-white" /></label>
            <label className="block text-sm text-white/65">Fichier vidéo<input type="file" accept={VIDEO_MIME_TYPES.join(",")} onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm text-white/55 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-3 file:text-white" /></label>
            {progress !== null && <p role="status" className="text-sm text-white/55">Envoi : {progress} %</p>}
            <button type="button" disabled={busy || !selected} onClick={() => { void startUpload(); }} className="min-h-11 rounded-lg bg-[#e8d5b0] px-5 py-3 text-sm font-semibold text-[#0e0e0f] disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Traitement..." : "Envoyer à Mux"}</button>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white/75">Envois récents</h3>
              <button type="button" onClick={() => { void refreshVideos(); }} className="min-h-11 px-3 text-xs text-white/45 hover:text-white">Actualiser</button>
            </div>
            <div className="space-y-3">
              {videos.length === 0 && <p className="rounded-xl border border-white/8 px-4 py-5 text-sm text-white/35">Aucune vidéo envoyée.</p>}
              {videos.map((video) => (
                <article key={video.id} className="rounded-xl border border-white/8 bg-black/15 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><p className="text-sm font-medium text-white/80">{video.title}</p><p className="mt-1 text-xs text-white/35">{video.section_id} : {STATUS_LABELS[video.status]}</p></div>
                    {video.published_at && <span className="rounded-full border border-emerald-400/20 px-2 py-1 text-xs text-emerald-300">Publiée</span>}
                  </div>
                  <p className="mt-3 text-xs text-white/35">Transcription : {video.transcript.length} caractères. Palier : {video.tier_required}.</p>
                  {video.status === "waiting" && !video.published_at && <button type="button" disabled={busy} onClick={() => { void cancel(video.id); }} className="mt-3 min-h-11 px-3 text-xs text-red-200/70 hover:text-red-100">Annuler l'envoi</button>}
                  {video.status === "ready" && !video.published_at && publishId !== video.id && <button type="button" disabled={busy} onClick={() => { setPublishId(video.id); setConfirmation(""); }} className="mt-3 min-h-11 rounded-lg border border-[#e8d5b0]/40 px-3 text-xs text-[#e8d5b0]">Relire puis publier</button>}
                  {publishId === video.id && (
                    <div className="mt-4 rounded-lg border border-[#e8d5b0]/20 bg-[#e8d5b0]/5 p-3">
                      <p className="text-xs leading-relaxed text-white/55">Confirme que la transcription, les repères et le palier sont justes. Écris {ADMIN_VIDEO_CONFIRMATION} pour publier.</p>
                      <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-3 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" disabled={busy || confirmation !== ADMIN_VIDEO_CONFIRMATION} onClick={() => { void publish(video.id); }} className="min-h-11 rounded-lg bg-[#e8d5b0] px-4 text-xs font-semibold text-[#0e0e0f] disabled:opacity-40">Publier maintenant</button>
                        <button type="button" onClick={() => { setPublishId(null); setConfirmation(""); }} className="min-h-11 px-3 text-xs text-white/45">Revenir</button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
      {message && <p role="status" className="mt-4 text-sm text-white/60">{message}</p>}
    </section>
  );
}
