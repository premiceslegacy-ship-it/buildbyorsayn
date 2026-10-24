"use client";

import { Check, FileVideo, Image as ImageIcon, RefreshCw, Upload, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { setAdminVideoThumbnailAction } from "./actions";
import {
  ADMIN_VIDEO_CONFIRMATION,
  MAX_ADMIN_VIDEO_BYTES,
  VIDEO_MIME_TYPES,
  type VideoChapter,
} from "@/lib/mux/adminLessons";
import type { AdminVideoLessonRow } from "@/lib/mux/adminServer";
import { playAppSound } from "@/lib/ui/sound";

type SectionOption = { id: string; title: string; blocTitle: string };
type AdminVideoRow = AdminVideoLessonRow & { thumbnail?: string | null };
type ApiResult = { ok: boolean; error?: string; videoId?: string; uploadUrl?: string; previousAssetId?: string | null };

const STATUS_LABELS: Record<AdminVideoLessonRow["status"], string> = {
  waiting: "Envoi en attente",
  preparing: "Traitement Mux",
  ready: "Prête à relire",
  errored: "Erreur de traitement",
  cancelled: "Envoi annulé",
};

function parseChapterLines(value: string): VideoChapter[] | null {
  const result: VideoChapter[] = [];
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
    result.push({ index: result.length + 1, title: match[2].trim(), startSeconds: seconds });
  }
  return result.length ? result : null;
}

function uploadToMux(url: string, file: File, onProgress: (percentage: number) => void, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100));
    });
    request.addEventListener("load", () => {
      if (request.status >= 200 && request.status < 300) resolve();
      else reject(new Error("upload_failed"));
    });
    request.addEventListener("error", () => reject(new Error("upload_failed")));
    request.addEventListener("abort", () => reject(new DOMException("Envoi annulé", "AbortError")));
    signal.addEventListener("abort", () => request.abort(), { once: true });
    request.send(file);
  });
}

function formatDuration(seconds: number | null) {
  if (!seconds) return "Durée inconnue";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}

function hasChapters(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

export function AdminVideoManager({
  sections,
  initialVideos,
  setupMissing,
}: {
  sections: SectionOption[];
  initialVideos: AdminVideoRow[];
  setupMissing: boolean;
}) {
  const [videos, setVideos] = useState<AdminVideoRow[]>(initialVideos);
  const [sectionId, setSectionId] = useState(sections[0]?.id ?? "");
  const [title, setTitle] = useState(sections[0]?.title ?? "");
  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [chapters, setChapters] = useState(`0:00 ${sections[0]?.title ?? "Introduction"}`);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageError, setMessageError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [publishId, setPublishId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const uploadAbort = useRef<AbortController | null>(null);
  const previousStatuses = useRef(new Map(initialVideos.map((video) => [video.id, video.status])));
  const fileInput = useRef<HTMLInputElement>(null);
  const selected = sections.find((section) => section.id === sectionId);
  const hasProcessingVideo = useMemo(
    () => videos.some((video) => video.status === "waiting" || video.status === "preparing"),
    [videos],
  );

  const announce = useCallback((nextMessage: string, error = false) => {
    setMessage(nextMessage);
    setMessageError(error);
    void playAppSound(error ? "error" : "confirm");
  }, []);

  const refreshVideos = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/videos", { cache: "no-store" });
      const payload = await response.json().catch(() => null) as { ok?: boolean; videos?: AdminVideoRow[] } | null;
      if (!response.ok || !payload?.ok || !Array.isArray(payload.videos)) throw new Error("refresh_failed");
      const becameReady = payload.videos.some((video) => previousStatuses.current.get(video.id) !== "ready" && video.status === "ready");
      setVideos((current) => payload.videos!.map((video) => ({
        ...video,
        thumbnail: video.thumbnail ?? current.find((item) => item.id === video.id)?.thumbnail ?? null,
      })));
      previousStatuses.current = new Map(payload.videos.map((video) => [video.id, video.status]));
      if (becameReady) {
        setMessage("Mux a terminé le traitement. La vidéo est prête à relire.");
        setMessageError(false);
        void playAppSound("confirm");
      }
    } catch {
      announce("Les statuts Mux ne se sont pas actualisés. Réessaie.", true);
    }
  }, [announce]);

  useEffect(() => {
    if (!hasProcessingVideo) return;
    const poll = window.setInterval(() => { void refreshVideos(); }, 3_000);
    return () => window.clearInterval(poll);
  }, [hasProcessingVideo, refreshVideos]);

  const changeSection = (nextId: string) => {
    setSectionId(nextId);
    const next = sections.find((section) => section.id === nextId);
    if (next) {
      setTitle(next.title);
      setChapters(`0:00 ${next.title}`);
    }
  };

  const chooseFile = (nextFile: File | null) => {
    setFile(nextFile);
    setMessage(null);
    if (nextFile) void playAppSound("select");
  };

  const startUpload = async () => {
    setMessage(null);
    setMessageError(false);
    if (!file || !VIDEO_MIME_TYPES.includes(file.type as (typeof VIDEO_MIME_TYPES)[number])) {
      announce("Choisis une vidéo MP4, MOV, WebM ou M4V.", true);
      return;
    }
    if (file.size > MAX_ADMIN_VIDEO_BYTES) {
      announce("Le fichier dépasse la limite définie pour l'administration.", true);
      return;
    }
    const parsedChapters = parseChapterLines(chapters);
    if (!parsedChapters) {
      announce("Écris un chapitre par ligne sous la forme 0:00 Titre.", true);
      return;
    }
    if (transcript.trim().length < 20 || !summary.trim()) {
      announce("Ajoute le résumé et une transcription relue avant l'envoi.", true);
      return;
    }

    setBusy(true);
    const controller = new AbortController();
    uploadAbort.current = controller;
    let videoId: string | null = null;
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
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => ({})) as ApiResult;
      if (!response.ok || !payload.ok || !payload.uploadUrl || !payload.videoId) throw new Error(payload.error ?? "create_failed");
      videoId = payload.videoId;
      setProgress(0);
      await uploadToMux(payload.uploadUrl, file, setProgress, controller.signal);
      setProgress(100);
      setMessage("Envoi terminé. Mux traite la vidéo et les sous-titres français.");
      setMessageError(false);
      void playAppSound("select");
      await refreshVideos();
    } catch (error) {
      if (videoId && error instanceof DOMException && error.name === "AbortError") {
        await fetch(`/api/admin/videos/${videoId}`, { method: "DELETE" }).catch(() => undefined);
        announce("Envoi annulé.", false);
      } else {
        announce(error instanceof Error && !["create_failed", "upload_failed"].includes(error.message)
          ? error.message
          : "L'envoi a échoué. Tu peux réessayer sans publier.", true);
      }
    } finally {
      uploadAbort.current = null;
      setBusy(false);
    }
  };

  const cancelWaitingUpload = async (videoId: string) => {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({})) as ApiResult;
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "L'annulation a échoué.");
      announce("Envoi annulé.");
      await refreshVideos();
    } catch (error) {
      announce(error instanceof Error ? error.message : "L'annulation a échoué.", true);
    } finally {
      setBusy(false);
    }
  };

  const chooseThumbnail = (video: AdminVideoRow, ratio: number) => {
    if (!video.duration_seconds) return;
    const timeSeconds = Math.min(video.duration_seconds - 1, Math.max(0, Math.round(video.duration_seconds * ratio)));
    setBusy(true);
    setMessage(null);
    void setAdminVideoThumbnailAction({ videoId: video.id, timeSeconds }).then((result) => {
      if (!result.ok || !result.thumbnail) {
        announce(result.message, true);
        return;
      }
      setVideos((current) => current.map((item) => item.id === video.id ? { ...item, thumbnail: result.thumbnail } : item));
      announce(result.message);
    }).finally(() => setBusy(false));
  };

  const publish = async (video: AdminVideoRow) => {
    if (confirmation !== ADMIN_VIDEO_CONFIRMATION || !video.thumbnail) return;
    setBusy(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/videos/${video.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true, confirmation }),
      });
      const payload = await response.json().catch(() => ({})) as ApiResult;
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "La publication a échoué.");
      setPublishId(null);
      setConfirmation("");
      announce(payload.previousAssetId
        ? `Vidéo publiée. Supprime manuellement l'ancien asset Mux ${payload.previousAssetId}.`
        : "Vidéo publiée. Elle est disponible dans son chapitre.");
      await refreshVideos();
    } catch (error) {
      announce(error instanceof Error ? error.message : "La publication a échoué.", true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-view-stack">
      <section className="adm-section" aria-labelledby="admin-video-title">
        <div className="adm-section-heading">
          <div>
            <h2 id="admin-video-title">Envoyer une vidéo</h2>
            <p>Le fichier part directement vers Mux. Tu relis le résumé, la transcription et les chapitres avant de publier.</p>
          </div>
        </div>

        {setupMissing ? (
          <div className="adm-notice adm-notice-error" role="alert"><FileVideo aria-hidden="true" /><p>La table vidéo n'est pas disponible. Aucun envoi ne peut démarrer.</p></div>
        ) : (
          <div className="adm-video-layout">
            <div className="adm-video-form">
              <div className="adm-form-grid-two">
                <label>Bloc et chapitre<select value={sectionId} onChange={(event) => changeSection(event.target.value)}>{sections.map((section) => <option key={section.id} value={section.id}>{section.blocTitle} : {section.title}</option>)}</select></label>
                <label>Titre<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} /></label>
              </div>
              <label>Résumé<textarea value={summary} onChange={(event) => setSummary(event.target.value)} maxLength={2000} rows={3} /></label>
              <label>Transcription relue<textarea value={transcript} onChange={(event) => setTranscript(event.target.value)} maxLength={250000} rows={8} placeholder="[0:00] Ce que tu dis dans la vidéo..." /><small>Ajoute [2:10] au début d'une ligne quand tu as un repère exact.</small></label>
              <div className="adm-form-grid-two">
                <label>Chapitres et repères<textarea value={chapters} onChange={(event) => setChapters(event.target.value)} rows={4} /></label>
                <label>Livrables, trois lignes maximum<textarea value={deliverables} onChange={(event) => setDeliverables(event.target.value)} rows={4} /></label>
              </div>
            </div>

            <div
              className="adm-dropzone"
              data-dragging={dragging || undefined}
              onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files[0] ?? null); }}
            >
              <span><Upload aria-hidden="true" /></span>
              <h3>{file ? file.name : "Dépose la vidéo ici"}</h3>
              <p>{file ? `${(file.size / 1024 / 1024).toFixed(1).replace(".", ",")} Mo` : "MP4, MOV, WebM ou M4V. Le fichier ne passe pas par Vercel."}</p>
              <input ref={fileInput} type="file" accept={VIDEO_MIME_TYPES.join(",")} onChange={(event) => chooseFile(event.target.files?.[0] ?? null)} hidden />
              <button className="adm-ghost-button" type="button" onClick={() => fileInput.current?.click()}>Choisir un fichier</button>
              {progress !== null ? <div className="adm-upload-progress" role="status"><i style={{ width: `${progress}%` }} /><span>{progress} %</span></div> : null}
              <div className="adm-upload-actions">
                <button className="adm-primary-button" type="button" disabled={busy || !selected} onClick={() => { void startUpload(); }}>{busy ? "Envoi en cours" : "Envoyer à Mux"}</button>
                {busy && progress !== null ? <button className="adm-link-button" type="button" onClick={() => uploadAbort.current?.abort()}><X aria-hidden="true" />Annuler</button> : null}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="adm-section" aria-labelledby="admin-recent-videos">
        <div className="adm-section-heading">
          <div><h2 id="admin-recent-videos">Ce qui suit</h2><p>Chaque étape reste visible jusqu'à la publication.</p></div>
          <button className="adm-ghost-button" type="button" onClick={() => { void refreshVideos(); }}><RefreshCw aria-hidden="true" />Actualiser</button>
        </div>

        <div className="adm-video-list" aria-live="polite">
          {videos.length === 0 ? <div className="adm-empty-card"><FileVideo aria-hidden="true" /><h3>Aucune vidéo envoyée</h3><p>Le premier envoi apparaîtra ici avec son traitement et ses contrôles.</p></div> : null}
          {videos.map((video) => {
            const complete = {
              transcript: video.transcript.trim().length >= 20,
              chapters: hasChapters(video.chapters),
              summary: Boolean(video.summary.trim()),
              thumbnail: Boolean(video.thumbnail),
              playback: Boolean(video.playback_id && video.duration_seconds),
            };
            const publishable = video.status === "ready" && Object.values(complete).every(Boolean);
            return (
              <article className="adm-video-card" key={video.id}>
                <div className="adm-video-card-head">
                  <span className="adm-video-thumb"><ImageIcon aria-hidden="true" /></span>
                  <div><h3>{video.title}</h3><p>{video.section_id}, {formatDuration(video.duration_seconds)}</p></div>
                  <span className="adm-status" data-status={video.status}><i aria-hidden="true" />{STATUS_LABELS[video.status]}</span>
                </div>

                <ol className="adm-video-steps">
                  {([
                    ["Transcription", complete.transcript],
                    ["Chapitres", complete.chapters],
                    ["Résumé", complete.summary],
                    ["Miniature", complete.thumbnail],
                    ["Lecture signée", complete.playback],
                  ] as const).map(([label, done], index) => <li key={label} data-done={done || undefined}><span>{done ? <Check aria-hidden="true" /> : index + 1}</span>{label}</li>)}
                </ol>

                {video.status === "ready" && !video.thumbnail && video.duration_seconds ? (
                  <div className="adm-thumbnail-choice">
                    <p>Choisis le moment utilisé par Mux pour la miniature.</p>
                    <div>{[0.25, 0.5, 0.75].map((ratio) => {
                      const seconds = Math.round(video.duration_seconds! * ratio);
                      return <button type="button" key={ratio} disabled={busy} onClick={() => chooseThumbnail(video, ratio)}><ImageIcon aria-hidden="true" /><span>{Math.round(ratio * 100)} %</span><small>{formatDuration(seconds)}</small></button>;
                    })}</div>
                  </div>
                ) : null}

                <div className="adm-video-card-actions">
                  {video.status === "waiting" && !video.published_at ? <button type="button" className="adm-danger-button" disabled={busy} onClick={() => { void cancelWaitingUpload(video.id); }}>Annuler l'envoi</button> : null}
                  {video.published_at ? <span className="adm-status" data-status="published"><i aria-hidden="true" />Publiée</span> : null}
                  {video.status === "ready" && !video.published_at && publishId !== video.id ? (
                    <button type="button" className="adm-ghost-button" disabled={!publishable || busy} onClick={() => { setPublishId(video.id); setConfirmation(""); void playAppSound("open"); }}>
                      {publishable ? "Relire puis publier" : "Complète les étapes"}
                    </button>
                  ) : null}
                </div>

                {publishId === video.id ? (
                  <div className="adm-publish-confirm">
                    <p>Relis le palier, le résumé, la transcription, les chapitres et la miniature. Écris <b>{ADMIN_VIDEO_CONFIRMATION}</b> pour publier.</p>
                    <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" />
                    <div><button type="button" className="adm-ghost-button" onClick={() => { setPublishId(null); setConfirmation(""); }}>Revenir</button><button type="button" className="adm-danger-button" disabled={busy || confirmation !== ADMIN_VIDEO_CONFIRMATION} onClick={() => { void publish(video); }}>Publier maintenant</button></div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      {message ? <p className={messageError ? "adm-inline-error" : "adm-success"} role={messageError ? "alert" : "status"}>{message}</p> : null}
    </div>
  );
}
