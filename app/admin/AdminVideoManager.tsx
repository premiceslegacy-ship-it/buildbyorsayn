"use client";

import { Check, ChevronDown, FileVideo, Image as ImageIcon, RefreshCw, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  saveAdminVideoChaptersAction,
  saveAdminVideoSummaryAction,
  saveAdminVideoTranscriptAction,
  setAdminVideoThumbnailAction,
  setAdminVideoThumbnailImageAction,
} from "./actions";
import {
  ADMIN_VIDEO_CONFIRMATION,
  formatTimecode,
  MAX_ADMIN_VIDEO_BYTES,
  VIDEO_MIME_TYPES,
  type VideoChapter,
} from "@/lib/mux/adminLessons";
import { parseChapterLines, validateManualTranscript } from "@/lib/mux/videoContent";
import { nextVideoPosition } from "@/lib/mux/videoPosition";
import type { AdminVideoLessonRow } from "@/lib/mux/adminServer";
import { playAppSound } from "@/lib/ui/sound";

type VideoLocation = number | "protocole";
type BlocOption = { id: string; displayNumber: VideoLocation; title: string };
type AdminVideoRow = AdminVideoLessonRow & { thumbnail?: string | null; thumbnailUrl?: string | null };
type ApiResult = { ok: boolean; error?: string; videoId?: string; uploadUrl?: string; previousAssetId?: string | null };

const STATUS_LABELS: Record<AdminVideoLessonRow["status"], string> = {
  waiting: "Envoi",
  preparing: "Traitement",
  ready: "À relire",
  errored: "Problème",
  cancelled: "Retirée",
};

function locationLabel(location: VideoLocation) {
  return location === "protocole" ? "Protocole" : `Bloc ${location}`;
}

function locationTitle(bloc: BlocOption) {
  const title = bloc.title.replace(/^Bloc \d+\s*:\s*/, "").trim();
  return title && title !== locationLabel(bloc.displayNumber) ? title : null;
}


function uploadToMux(url: string, file: File, onProgress: (percentage: number) => void, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("PUT", url);
    request.setRequestHeader("Content-Type", file.type);
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100));
    });
    request.addEventListener("load", () => request.status >= 200 && request.status < 300 ? resolve() : reject(new Error("upload_failed")));
    request.addEventListener("error", () => reject(new Error("upload_failed")));
    request.addEventListener("abort", () => reject(new DOMException("Envoi annulé", "AbortError")));
    signal.addEventListener("abort", () => request.abort(), { once: true });
    request.send(file);
  });
}

function formatDuration(seconds: number | null) {
  if (!seconds) return "Durée inconnue";
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
function formatChapterTime(seconds: number) {
  return formatTimecode(seconds);
}

function hasChapters(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}
function displayChapters(value: unknown): VideoChapter[] {
  if (!Array.isArray(value)) return [];
  return value.filter((chapter): chapter is VideoChapter => {
    if (!chapter || typeof chapter !== "object") return false;
    const candidate = chapter as Record<string, unknown>;
    return Number.isSafeInteger(candidate.index)
      && typeof candidate.title === "string"
      && Number.isSafeInteger(candidate.startSeconds);
  });
}

function videoStatus(video: AdminVideoRow) {
  return video.published_at ? "En ligne" : STATUS_LABELS[video.status];
}
function publishReason(video: AdminVideoRow) {
  const missing = [
    !video.summary.trim() ? "un résumé" : null,
    !hasChapters(video.chapters) ? "au moins un chapitre" : null,
    !video.thumbnail ? "une miniature" : null,
    !video.transcript.trim() ? "une transcription relue" : null,
  ].filter((value): value is string => Boolean(value));
  return missing.length ? `Publication indisponible : ajoute ${missing.join(", ")}.` : null;
}

export function AdminVideoManager({
  blocs,
  initialVideos,
  setupMissing,
  demo = false,
  initialOpenIndex,
}: {
  blocs: BlocOption[];
  initialVideos: AdminVideoRow[];
  setupMissing: boolean;
  demo?: boolean;
  initialOpenIndex?: number;
}) {
  const initialDetail = initialVideos[initialOpenIndex ?? -1] ?? null;
  const [videos, setVideos] = useState<AdminVideoRow[]>(initialVideos);
  const [location, setLocation] = useState<VideoLocation>(blocs[0]?.displayNumber ?? 1);
  const [positionMode, setPositionMode] = useState<"auto" | number>("auto");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageError, setMessageError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [contentBusy, setContentBusy] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState(initialDetail?.summary ?? "");
  const [chaptersDraft, setChaptersDraft] = useState(() => displayChapters(initialDetail?.chapters).map((chapter) => `${formatChapterTime(chapter.startSeconds)} ${chapter.title}`).join("\n"));
  const [transcriptDraft, setTranscriptDraft] = useState(initialDetail?.transcript ?? "");
  const [detailId, setDetailId] = useState<string | null>(initialDetail?.id ?? null);
  const [publishId, setPublishId] = useState<string | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const uploadAbort = useRef<AbortController | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const selected = blocs.find((bloc) => bloc.displayNumber === location);
  const detail = videos.find((video) => video.id === detailId) ?? null;
  const hasProcessingVideo = useMemo(() => videos.some((video) => video.status === "waiting" || video.status === "preparing"), [videos]);
  const detailPanel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!detailId) return;
    const panel = detailPanel.current;
    panel?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setDetailId(null);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>("button, input, select, summary, [tabindex]:not([tabindex='-1'])")).filter((element) => !element.hasAttribute("disabled"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [detailId]);

  const announce = useCallback((nextMessage: string, error = false) => {
    setMessage(nextMessage);
    setMessageError(error);
    void playAppSound(error ? "error" : "confirm");
  }, []);

  const refreshVideos = useCallback(async () => {
    if (demo) return;
    try {
      const response = await fetch("/api/admin/videos", { cache: "no-store" });
      const payload = await response.json().catch(() => null) as { ok?: boolean; videos?: AdminVideoRow[] } | null;
      if (!response.ok || !payload?.ok || !Array.isArray(payload.videos)) throw new Error("refresh_failed");
      setVideos(payload.videos);
    } catch {
      announce("Les statuts ne se sont pas actualisés. Réessaie.", true);
    }
  }, [announce, demo]);

  useEffect(() => {
    if (!hasProcessingVideo || demo) return;
    const poll = window.setInterval(() => { void refreshVideos(); }, 3_000);
    return () => window.clearInterval(poll);
  }, [demo, hasProcessingVideo, refreshVideos]);

  const chooseFile = (nextFile: File | null) => {
    setFile(nextFile);
    setMessage(null);
    if (nextFile) void playAppSound("select");
  };

  const nextPosition = (target: VideoLocation) => nextVideoPosition(videos, target);

  const startUpload = async () => {
    if (demo) {
      announce("La démonstration ne modifie rien.");
      return;
    }
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
    setBusy(true);
    const controller = new AbortController();
    uploadAbort.current = controller;
    let videoId: string | null = null;
    try {
      const position = positionMode === "auto" ? nextPosition(location) : positionMode;
      const response = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blocNumero: location,
          position,
          title: title.trim() || file.name.replace(/\.[^.]+$/, ""),
          summary: "",
          transcript: "",
          deliverables: [],
          chapters: [{ index: 1, title: "Introduction", startSeconds: 0 }],
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
      announce("Envoi terminé. La vidéo est maintenant en traitement.");
      chooseFile(null);
      setTitle("");
      setPositionMode("auto");
      await refreshVideos();
    } catch (error) {
      if (videoId && error instanceof DOMException && error.name === "AbortError") {
        await fetch(`/api/admin/videos/${videoId}`, { method: "DELETE" }).catch(() => undefined);
        announce("Envoi annulé.");
      } else {
        announce(error instanceof Error && !["create_failed", "upload_failed"].includes(error.message) ? error.message : "L'envoi a échoué. Tu peux réessayer sans publier.", true);
      }
    } finally {
      uploadAbort.current = null;
      setBusy(false);
    }
  };

  const chooseThumbnail = (video: AdminVideoRow, ratio: number) => {
    if (demo) { announce("La démonstration ne modifie rien."); return; }
    if (!video.duration_seconds) return;
    const timeSeconds = Math.min(video.duration_seconds - 1, Math.max(0, Math.round(video.duration_seconds * ratio)));
    setBusy(true);
    void setAdminVideoThumbnailAction({ videoId: video.id, timeSeconds }).then(async (result) => {
      if (!result.ok || !result.thumbnail) { announce(result.message, true); return; }
      announce(result.message);
      await refreshVideos();
    }).finally(() => setBusy(false));
  };

  const chooseThumbnailFile = (video: AdminVideoRow, image: File | undefined) => {
    if (!image) return;
    if (demo) { announce("La démonstration ne modifie rien."); return; }
    setBusy(true);
    const form = new FormData();
    form.set("videoId", video.id);
    form.set("file", image);
    void setAdminVideoThumbnailImageAction(form).then((result) => {
      if (!result.ok || !result.thumbnail) { announce(result.message, true); return; }
      setVideos((current) => current.map((item) => item.id === video.id ? { ...item, thumbnail: result.thumbnail, thumbnailUrl: result.thumbnailUrl ?? null } : item));
      announce(result.message);
    }).finally(() => setBusy(false));
  };

  const saveSummary = async (video: AdminVideoRow) => {
    const summary = summaryDraft.trim();
    if (!summary) { announce("Ajoute un résumé avant de l'enregistrer.", true); return; }
    if (demo) { announce("La démonstration ne modifie rien."); return; }
    setContentBusy(true);
    try {
      const result = await saveAdminVideoSummaryAction({ videoId: video.id, summary });
      if (!result.ok) { announce(result.message, true); return; }
      setVideos((current) => current.map((item) => item.id === video.id ? { ...item, summary } : item));
      announce(result.message);
    } finally {
      setContentBusy(false);
    }
  };

  const saveChapters = async (video: AdminVideoRow) => {
    const parsed = parseChapterLines(chaptersDraft, video.duration_seconds);
    if (parsed.error) { announce(parsed.error, true); return; }
    if (demo) { announce("La démonstration ne modifie rien."); return; }
    setContentBusy(true);
    try {
      const result = await saveAdminVideoChaptersAction({ videoId: video.id, chaptersText: chaptersDraft });
      if (!result.ok) { announce(result.message, true); return; }
      setVideos((current) => current.map((item) => item.id === video.id ? { ...item, chapters: parsed.chapters } : item));
      announce(result.message);
    } finally {
      setContentBusy(false);
    }
  };

  const saveTranscript = async (video: AdminVideoRow) => {
    const parsed = validateManualTranscript(transcriptDraft);
    if (parsed.error) { announce(parsed.error, true); return; }
    if (demo) { announce("La démonstration ne modifie rien."); return; }
    setContentBusy(true);
    try {
      const result = await saveAdminVideoTranscriptAction({ videoId: video.id, transcript: parsed.transcript });
      if (!result.ok) { announce(result.message, true); return; }
      setVideos((current) => current.map((item) => item.id === video.id ? { ...item, transcript: parsed.transcript, transcript_segments: parsed.segments, transcript_source: "manual" } : item));
      announce(result.message);
    } finally {
      setContentBusy(false);
    }
  };

  const publish = async (video: AdminVideoRow) => {
    if (demo) { announce("La démonstration ne modifie rien."); return; }
    if (confirmation !== ADMIN_VIDEO_CONFIRMATION || !video.thumbnail) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/videos/${video.id}/publish`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved: true, confirmation }) });
      const payload = await response.json().catch(() => ({})) as ApiResult;
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "La publication a échoué.");
      setPublishId(null);
      setConfirmation("");
      announce("Vidéo publiée en ligne.");
      await refreshVideos();
    } catch (error) {
      announce(error instanceof Error ? error.message : "La publication a échoué.", true);
    } finally {
      setBusy(false);
    }
  };

  const removeWaiting = async (video: AdminVideoRow) => {
    if (demo) { announce("La démonstration ne modifie rien."); setRemoveId(null); return; }
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/videos/${video.id}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({})) as ApiResult;
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "La vidéo ne peut pas être retirée.");
      setRemoveId(null);
      setDetailId(null);
      announce("Vidéo retirée.");
      await refreshVideos();
    } catch (error) {
      announce(error instanceof Error ? error.message : "La vidéo ne peut pas être retirée.", true);
    } finally {
      setBusy(false);
    }
  };

  const replaceVideo = (video: AdminVideoRow) => {
    setLocation((video.bloc_id === "protocole" ? "protocole" : Number(video.bloc_id)) as VideoLocation);
    setPositionMode(video.position);
    setTitle(video.title);
    setDetailId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    fileInput.current?.click();
  };

  const openDetail = (video: AdminVideoRow) => {
    setSummaryDraft(video.summary);
    setChaptersDraft(displayChapters(video.chapters).map((chapter) => `${formatChapterTime(chapter.startSeconds)} ${chapter.title}`).join("\n"));
    setTranscriptDraft(video.transcript);
    setDetailId(video.id);
  };
  const grouped = blocs.map((bloc) => ({ bloc, videos: videos.filter((video) => video.bloc_id === bloc.id).sort((left, right) => left.position - right.position) }));

  return (
    <div className="vd-root">
      <header className="vd-header">
        <div><p>Envoie, relis et publie les épisodes de ton parcours.</p></div>
        <button className="vd-icon-button" type="button" onClick={() => { void refreshVideos(); }} aria-label="Actualiser les vidéos"><RefreshCw aria-hidden="true" /></button>
      </header>

      {setupMissing ? <div className="vd-unavailable" role="alert"><FileVideo aria-hidden="true" /><div><strong>La table vidéo n'est pas disponible</strong><p>Aucun envoi ne peut démarrer tant que la connexion n'est pas prête.</p></div></div> : <section className="vd-upload" aria-labelledby="vd-upload-title">
        <div className="vd-section-intro"><h3 id="vd-upload-title">Ajouter une vidéo</h3><p>Un épisode à la fois. Le traitement et la relecture restent séparés de la publication.</p></div>
        <div className="vd-upload-fields">
          <label>Où<select value={String(location)} onChange={(event) => { const value = event.target.value; setLocation(value === "protocole" ? "protocole" : Number(value)); }}>{blocs.map((bloc) => <option key={bloc.id} value={String(bloc.displayNumber)}>{locationLabel(bloc.displayNumber)}</option>)}</select></label>
          <label>Place dans l'emplacement<select value={positionMode === "auto" ? "auto" : String(positionMode)} onChange={(event) => setPositionMode(event.target.value === "auto" ? "auto" : Math.max(1, Number(event.target.value) || 1))}><option value="auto">Suivante automatiquement</option>{Array.from({ length: Math.max(3, nextPosition(location) + 1) }, (_, index) => <option key={index + 1} value={index + 1}>Épisode {index + 1}</option>)}</select></label>
          <label>Titre<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} placeholder="Un titre simple" /></label>
        </div>
        <div className={`vd-dropzone ${dragging ? "vd-dropzone-active" : ""}`} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); chooseFile(event.dataTransfer.files[0] ?? null); }}>
          <Upload aria-hidden="true" /><strong>{file ? file.name : "Glisse ta vidéo ici"}</strong><span>{file ? `${(file.size / 1024 / 1024).toFixed(1).replace(".", ",")} Mo` : "MP4, MOV, WebM ou M4V"}</span><input ref={fileInput} type="file" accept={VIDEO_MIME_TYPES.join(",")} onChange={(event) => chooseFile(event.target.files?.[0] ?? null)} hidden /><button className="vd-secondary" type="button" onClick={() => fileInput.current?.click()}>Choisir un fichier</button>
        </div>
        {progress !== null ? <div className="vd-progress" role="status"><span><b>{progress < 100 ? "Envoi" : "Envoi terminé"}</b><small>{progress} %</small></span><i><em style={{ width: `${progress}%` }} /></i></div> : null}
        <div className="vd-upload-footer"><p>Après l'envoi, tu retrouveras la vidéo dans son emplacement.</p><button className="vd-primary" type="button" disabled={busy || !file || !selected} onClick={() => { void startUpload(); }}>{busy ? "Envoi en cours" : "Envoyer"}</button></div>
      </section>}

      <section className="vd-library" aria-labelledby="vd-library-title"><div className="vd-section-intro"><h3 id="vd-library-title">Par emplacement</h3><p>{videos.length ? `${videos.length} épisode${videos.length > 1 ? "s" : ""} au total` : "Tes épisodes apparaîtront ici."}</p></div><div className="vd-groups">{grouped.map(({ bloc, videos: groupVideos }) => <details className="vd-location" key={bloc.id} open={groupVideos.length > 0}><summary><span><strong>{locationLabel(bloc.displayNumber)}</strong>{locationTitle(bloc) ? <small>{locationTitle(bloc)}</small> : null}</span><em>{groupVideos.length ? `${groupVideos.length} épisode${groupVideos.length > 1 ? "s" : ""}` : "Aucune vidéo"}</em><ChevronDown aria-hidden="true" /></summary>{groupVideos.length ? <div className="vd-episodes">{groupVideos.map((video) => <button className="vd-episode" type="button" key={video.id} onClick={() => openDetail(video)}><span className="vd-episode-art">{video.thumbnailUrl ? <Image src={video.thumbnailUrl} alt="" fill unoptimized sizes="112px" /> : <ImageIcon aria-hidden="true" />}</span><span className="vd-episode-number">{video.position}</span><span className="vd-episode-copy"><strong>{video.title}</strong><small>{formatDuration(video.duration_seconds)}</small></span><span className={`vd-status vd-status-${video.published_at ? "online" : video.status}`}><i aria-hidden="true" />{videoStatus(video)}</span></button>)}</div> : null}</details>)}</div></section>


      {detail ? <><div className="vd-detail-backdrop" aria-hidden="true" onClick={() => setDetailId(null)} /><aside ref={detailPanel} className="vd-detail" role="dialog" aria-modal="true" aria-labelledby="vd-detail-title" tabIndex={-1}><div className="vd-detail-head"><div><p className="vd-detail-kicker">{locationLabel(detail.bloc_id === "protocole" ? "protocole" : Number(detail.bloc_id))}, épisode {detail.position}</p><h3 id="vd-detail-title">{detail.title}</h3><span className={`vd-status vd-status-${detail.published_at ? "online" : detail.status}`}><i aria-hidden="true" />{videoStatus(detail)}</span></div><button className="vd-icon-button" type="button" onClick={() => setDetailId(null)} aria-label="Fermer le détail"><X aria-hidden="true" /></button></div>{detail.thumbnailUrl ? <div className="vd-detail-art"><Image src={detail.thumbnailUrl} alt="" fill unoptimized sizes="640px" /></div> : null}<VideoDetailSteps video={detail} busy={busy} contentBusy={contentBusy} summaryDraft={summaryDraft} chaptersDraft={chaptersDraft} transcriptDraft={transcriptDraft} setSummaryDraft={setSummaryDraft} setChaptersDraft={setChaptersDraft} setTranscriptDraft={setTranscriptDraft} onSaveSummary={() => { void saveSummary(detail); }} onSaveChapters={() => { void saveChapters(detail); }} onSaveTranscript={() => { void saveTranscript(detail); }} onThumbnailTime={(ratio) => chooseThumbnail(detail, ratio)} onThumbnailFile={(image) => chooseThumbnailFile(detail, image)} /><div className="vd-detail-actions">{detail.status === "ready" && !detail.published_at && !detail.replaced_at ? publishId === detail.id ? <div className="vd-confirm"><p>Écris <b>{ADMIN_VIDEO_CONFIRMATION}</b> pour publier cette vidéo en ligne.</p><input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" /><div><button className="vd-secondary" type="button" onClick={() => { setPublishId(null); setConfirmation(""); }}>Annuler</button><button className="vd-primary" type="button" disabled={busy || confirmation !== ADMIN_VIDEO_CONFIRMATION} onClick={() => { void publish(detail); }}>Publier</button></div></div> : <><button className="vd-primary vd-publish" type="button" disabled={busy || Boolean(publishReason(detail))} onClick={() => { setPublishId(detail.id); setConfirmation(""); }}>Publier</button>{publishReason(detail) ? <p className="vd-publish-reason" role="status">{publishReason(detail)}</p> : null}</> : null}<div className="vd-secondary-actions"><button className="vd-secondary" type="button" onClick={() => replaceVideo(detail)}>Remplacer la vidéo</button>{detail.status === "waiting" ? <button className="vd-danger-link" type="button" onClick={() => setRemoveId(detail.id)}>Retirer</button> : null}</div></div></aside></> : null}
      {removeId ? <div className="vd-confirm-layer" role="presentation"><section className="vd-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="vd-remove-title"><h3 id="vd-remove-title">Retirer cette vidéo ?</h3><p>L'envoi sera annulé et la vidéo disparaîtra de la liste.</p><div><button className="vd-secondary" type="button" onClick={() => setRemoveId(null)}>Garder</button><button className="vd-primary vd-danger" type="button" onClick={() => { const video = videos.find((item) => item.id === removeId); if (video) void removeWaiting(video); }}>Retirer</button></div></section></div> : null}
      {message ? <p className={messageError ? "vd-message vd-message-error" : "vd-message"} role={messageError ? "alert" : "status"}>{message}</p> : null}
    </div>
  );
}

function VideoDetailSteps({
  video,
  busy,
  contentBusy,
  summaryDraft,
  chaptersDraft,
  transcriptDraft,
  setSummaryDraft,
  setChaptersDraft,
  setTranscriptDraft,
  onSaveSummary,
  onSaveChapters,
  onSaveTranscript,
  onThumbnailTime,
  onThumbnailFile,
}: {
  video: AdminVideoRow;
  busy: boolean;
  contentBusy: boolean;
  summaryDraft: string;
  chaptersDraft: string;
  transcriptDraft: string;
  setSummaryDraft: (value: string) => void;
  setChaptersDraft: (value: string) => void;
  setTranscriptDraft: (value: string) => void;
  onSaveSummary: () => void;
  onSaveChapters: () => void;
  onSaveTranscript: () => void;
  onThumbnailTime: (ratio: number) => void;
  onThumbnailFile: (image: File | undefined) => void;
}) {
  const summaryReady = Boolean(summaryDraft.trim());
  const chaptersParsed = parseChapterLines(chaptersDraft, video.duration_seconds);
  const chaptersReady = !chaptersParsed.error;
  const thumbnailReady = Boolean(video.thumbnail);
  const transcriptReady = Boolean(transcriptDraft.trim());
  return <div className="vd-detail-steps">
    <details open={!summaryReady}>
      <summary><span className="vd-step-heading"><span className={summaryReady ? "vd-step-check vd-step-done" : "vd-step-check"}>{summaryReady ? <Check aria-hidden="true" /> : null}</span><strong>Résumé</strong></span><small>{summaryReady ? "Prêt" : "À compléter"}</small></summary>
      <div className="vd-step-content"><textarea value={summaryDraft} onChange={(event) => setSummaryDraft(event.target.value)} maxLength={2_000} rows={4} placeholder="Écris le résumé de cette vidéo." /><div className="vd-step-footer"><small>{summaryDraft.length} / 2 000</small><button className="vd-secondary" type="button" disabled={contentBusy || !summaryDraft.trim()} onClick={onSaveSummary}>Enregistrer</button></div></div>
    </details>
    <details open={summaryReady && !chaptersReady}>
      <summary><span className="vd-step-heading"><span className={chaptersReady ? "vd-step-check vd-step-done" : "vd-step-check"}>{chaptersReady ? <Check aria-hidden="true" /> : null}</span><strong>Chapitres</strong></span><small>{chaptersReady ? "Prêts" : "À compléter"}</small></summary>
      <div className="vd-step-content"><textarea value={chaptersDraft} onChange={(event) => setChaptersDraft(event.target.value)} rows={5} placeholder={"Une ligne par chapitre : 0:00 Titre"} aria-label="Chapitres, une ligne par chapitre" />{chaptersDraft.trim() && chaptersParsed.error ? <p className="vd-form-error" role="alert">{chaptersParsed.error}</p> : null}{chaptersReady ? <ol>{chaptersParsed.chapters.map((chapter) => <li key={`${chapter.index}-${chapter.startSeconds}`}>{chapter.title}</li>)}</ol> : null}<div className="vd-step-footer"><small>Une ligne par chapitre</small><button className="vd-secondary" type="button" disabled={contentBusy || Boolean(chaptersParsed.error)} onClick={onSaveChapters}>Enregistrer</button></div></div>
    </details>
    <details open={summaryReady && chaptersReady && !thumbnailReady}>
      <summary><span className="vd-step-heading"><span className={thumbnailReady ? "vd-step-check vd-step-done" : "vd-step-check"}>{thumbnailReady ? <Check aria-hidden="true" /> : null}</span><strong>Miniature</strong></span><small>{thumbnailReady ? "Prête" : "À compléter"}</small></summary>
      <div className="vd-step-content"><p>Choisis un instant de la vidéo ou dépose une image 16:9.</p><div className="vd-thumbnail-tools"><label className="vd-secondary">Dépose ta propre image<input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={busy} onChange={(event) => { onThumbnailFile(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>{[0.25, 0.5, 0.75].map((ratio) => <button className="vd-thumbnail-time" type="button" key={ratio} disabled={busy} onClick={() => onThumbnailTime(ratio)}>{Math.round(ratio * 100)} %<small>{formatDuration(video.duration_seconds ? Math.round(video.duration_seconds * ratio) : null)}</small></button>)}</div></div>
    </details>
    <details open={summaryReady && chaptersReady && thumbnailReady && !transcriptReady}>
      <summary><span className="vd-step-heading"><span className={transcriptReady ? "vd-step-check vd-step-done" : "vd-step-check"}>{transcriptReady ? <Check aria-hidden="true" /> : null}</span><strong>Relire ou corriger la transcription</strong></span><small>{transcriptReady ? "Prête" : "À compléter"}</small></summary>
      <div className="vd-step-content"><textarea value={transcriptDraft} onChange={(event) => setTranscriptDraft(event.target.value)} maxLength={250_000} rows={9} placeholder="Colle ou relis la transcription, avec ou sans repères [0:00]." aria-label="Transcription relue" /><div className="vd-step-footer"><small>{transcriptDraft.length} / 250 000</small><button className="vd-secondary" type="button" disabled={contentBusy || !transcriptDraft.trim()} onClick={onSaveTranscript}>Enregistrer</button></div></div>
    </details>
  </div>;
}
