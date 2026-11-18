"use client";

import { Check, ChevronDown, FileVideo, Image as ImageIcon, RefreshCw, Upload, X } from "lucide-react";
import { SafeThumbnail } from "@/components/media/SafeThumbnail";
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
import { titleFromFileName } from "@/lib/fileName";
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
type SectionId = "thumbnail" | "summary" | "chapters" | "transcript";
const SECTION_ORDER: SectionId[] = ["thumbnail", "summary", "chapters", "transcript"];
const SECTION_LABELS: Record<SectionId, string> = { thumbnail: "Miniature", summary: "Résumé", chapters: "Chapitres", transcript: "Transcription" };

function chaptersToText(value: unknown) {
  return displayChapters(value).map((chapter) => `${formatChapterTime(chapter.startSeconds)} ${chapter.title}`).join("\n");
}
function sectionsReady(video: AdminVideoRow): Record<SectionId, boolean> {
  return {
    thumbnail: Boolean(video.thumbnail),
    summary: Boolean(video.summary.trim()),
    chapters: hasChapters(video.chapters),
    transcript: Boolean(video.transcript.trim()),
  };
}
function missingSections(video: AdminVideoRow) {
  const ready = sectionsReady(video);
  return SECTION_ORDER.filter((section) => !ready[section]);
}
function publishReason(video: AdminVideoRow) {
  const missing = missingSections(video).map((section) => ({ thumbnail: "une miniature", summary: "un résumé", chapters: "au moins un chapitre", transcript: "une transcription relue" })[section]);
  return missing.length ? `Pour publier, ajoute ${missing.join(", ")}.` : null;
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
  const [chaptersDraft, setChaptersDraft] = useState(() => chaptersToText(initialDetail?.chapters));
  const [transcriptDraft, setTranscriptDraft] = useState(initialDetail?.transcript ?? "");
  const [detailId, setDetailId] = useState<string | null>(initialDetail?.id ?? null);
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);
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
  useEffect(() => {
    const openFromHash = () => {
      const query = window.location.hash.split("?")[1];
      const videoId = query ? new URLSearchParams(query).get("videoId") : null;
      const video = videoId ? videos.find((item) => item.id === videoId) : null;
      if (!video || detailId === video.id) return;
      window.setTimeout(() => {
        setSummaryDraft(video.summary);
        setChaptersDraft(chaptersToText(video.chapters));
        setTranscriptDraft(video.transcript);
        setOpenSection(missingSections(video)[0] ?? null);
        setDetailId(video.id);
      }, 0);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [detailId, videos]);

  const announce = useCallback((nextMessage: string, error = false) => {
    setMessage(nextMessage);
    setMessageError(error);
    void playAppSound(error ? "error" : "confirm");
  }, []);

  const videosRef = useRef(videos);
  const detailIdRef = useRef(detailId);
  useEffect(() => { videosRef.current = videos; detailIdRef.current = detailId; }, [videos, detailId]);

  const refreshVideos = useCallback(async (quiet = false) => {
    if (demo) return;
    try {
      const response = await fetch("/api/admin/videos", { cache: "no-store" });
      const payload = await response.json().catch(() => null) as { ok?: boolean; videos?: AdminVideoRow[] } | null;
      if (!response.ok || !payload?.ok || !Array.isArray(payload.videos)) throw new Error("refresh_failed");
      // Ce qu'un agent a écrit pendant que la fiche est ouverte apparaît dans les champs qu'on n'a pas touchés.
      const before = videosRef.current.find((item) => item.id === detailIdRef.current);
      const after = payload.videos.find((item) => item.id === detailIdRef.current);
      if (before && after) {
        if (before.summary !== after.summary) setSummaryDraft((draft) => draft === before.summary ? after.summary : draft);
        if (chaptersToText(before.chapters) !== chaptersToText(after.chapters)) setChaptersDraft((draft) => draft === chaptersToText(before.chapters) ? chaptersToText(after.chapters) : draft);
        if (before.transcript !== after.transcript) setTranscriptDraft((draft) => draft === before.transcript ? after.transcript : draft);
      }
      setVideos(payload.videos);
    } catch {
      if (!quiet) announce("Les statuts ne se sont pas actualisés. Réessaie.", true);
    }
  }, [announce, demo]);

  useEffect(() => {
    if (!hasProcessingVideo || demo) return;
    const poll = window.setInterval(() => { void refreshVideos(); }, 3_000);
    return () => window.clearInterval(poll);
  }, [demo, hasProcessingVideo, refreshVideos]);

  // La liste suit ce que fait l'agent (miniature, chapitres, publication) sans recharger la page.
  useEffect(() => {
    if (demo) return;
    const refresh = () => { if (document.visibilityState === "visible") void refreshVideos(true); };
    const timer = window.setInterval(refresh, 20_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [demo, refreshVideos]);

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
          title: title.trim() || titleFromFileName(file.name),
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
    if (video.published_at || publishReason(video)) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/videos/${video.id}/publish`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ approved: true, confirmation: ADMIN_VIDEO_CONFIRMATION }) });
      const payload = await response.json().catch(() => ({})) as ApiResult;
      if (!response.ok || !payload.ok) throw new Error(payload.error ?? "La publication a échoué.");
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
    setChaptersDraft(chaptersToText(video.chapters));
    setTranscriptDraft(video.transcript);
    setOpenSection(missingSections(video)[0] ?? null);
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

      <section className="vd-library" aria-labelledby="vd-library-title"><div className="vd-section-intro"><h3 id="vd-library-title">Par emplacement</h3><p>{videos.length ? `${videos.length} épisode${videos.length > 1 ? "s" : ""} au total` : "Tes épisodes apparaîtront ici."}</p></div><div className="vd-groups">{grouped.map(({ bloc, videos: groupVideos }) => <details className="vd-location" key={bloc.id} open={groupVideos.length > 0}><summary><span><strong>{locationLabel(bloc.displayNumber)}</strong>{locationTitle(bloc) ? <small>{locationTitle(bloc)}</small> : null}</span><em>{groupVideos.length ? `${groupVideos.length} épisode${groupVideos.length > 1 ? "s" : ""}` : "Aucune vidéo"}</em><ChevronDown aria-hidden="true" /></summary>{groupVideos.length ? <div className="vd-episodes">{groupVideos.map((video) => <button className="vd-episode" type="button" key={video.id} onClick={() => openDetail(video)}><span className="vd-episode-art">{video.thumbnailUrl ? <SafeThumbnail src={video.thumbnailUrl} alt="" unoptimized sizes="112px" /> : <ImageIcon aria-hidden="true" />}</span><span className="vd-episode-number">{video.position}</span><span className="vd-episode-copy"><strong>{video.title}</strong><small>{formatDuration(video.duration_seconds)}</small></span><span className={`vd-status vd-status-${video.published_at ? "online" : video.status}`}><i aria-hidden="true" />{videoStatus(video)}</span></button>)}</div> : null}</details>)}</div></section>


      {detail ? <><div className="vd-detail-backdrop" aria-hidden="true" onClick={() => setDetailId(null)} /><aside ref={detailPanel} className="vd-detail" role="dialog" aria-modal="true" aria-labelledby="vd-detail-title" tabIndex={-1}>
        <VideoDetailPanel
          video={detail}
          busy={busy}
          contentBusy={contentBusy}
          openSection={openSection}
          setOpenSection={setOpenSection}
          summaryDraft={summaryDraft}
          chaptersDraft={chaptersDraft}
          transcriptDraft={transcriptDraft}
          setSummaryDraft={setSummaryDraft}
          setChaptersDraft={setChaptersDraft}
          setTranscriptDraft={setTranscriptDraft}
          onClose={() => setDetailId(null)}
          onSaveSummary={() => { void saveSummary(detail); }}
          onSaveChapters={() => { void saveChapters(detail); }}
          onSaveTranscript={() => { void saveTranscript(detail); }}
          onThumbnailTime={(ratio) => chooseThumbnail(detail, ratio)}
          onThumbnailFile={(image) => chooseThumbnailFile(detail, image)}
          onPublish={() => { void publish(detail); }}
          onReplace={() => replaceVideo(detail)}
          onRemove={() => setRemoveId(detail.id)}
        />
      </aside></> : null}
      {removeId ? <div className="vd-confirm-layer" role="presentation"><section className="vd-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="vd-remove-title"><h3 id="vd-remove-title">Retirer cette vidéo ?</h3><p>L'envoi sera annulé et la vidéo disparaîtra de la liste.</p><div><button className="vd-secondary" type="button" onClick={() => setRemoveId(null)}>Garder</button><button className="vd-primary vd-danger" type="button" onClick={() => { const video = videos.find((item) => item.id === removeId); if (video) void removeWaiting(video); }}>Retirer</button></div></section></div> : null}
      {message ? <p className={messageError ? "vd-message vd-message-error" : "vd-message"} role={messageError ? "alert" : "status"}>{message}</p> : null}
    </div>
  );
}

type DetailPanelProps = {
  video: AdminVideoRow;
  busy: boolean;
  contentBusy: boolean;
  openSection: SectionId | null;
  setOpenSection: (section: SectionId | null) => void;
  summaryDraft: string;
  chaptersDraft: string;
  transcriptDraft: string;
  setSummaryDraft: (value: string) => void;
  setChaptersDraft: (value: string) => void;
  setTranscriptDraft: (value: string) => void;
  onClose: () => void;
  onSaveSummary: () => void;
  onSaveChapters: () => void;
  onSaveTranscript: () => void;
  onThumbnailTime: (ratio: number) => void;
  onThumbnailFile: (image: File | undefined) => void;
  onPublish: () => void;
  onReplace: () => void;
  onRemove: () => void;
};

function excerpt(value: string, max = 64) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

function VideoDetailPanel(props: DetailPanelProps) {
  const { video, busy, contentBusy, openSection, setOpenSection } = props;
  const online = Boolean(video.published_at) && !video.replaced_at;
  const locked = online || Boolean(video.replaced_at);
  const ready = sectionsReady(video);
  const total = SECTION_ORDER.length;
  const done = SECTION_ORDER.filter((section) => ready[section]).length;
  const reason = publishReason(video);
  const processing = video.status === "waiting" || video.status === "preparing";
  const canPublish = video.status === "ready" && !online && !video.replaced_at;
  const chaptersParsed = parseChapterLines(props.chaptersDraft, video.duration_seconds);
  const chapterCount = displayChapters(video.chapters).length;
  const segmentCount = Array.isArray(video.transcript_segments) ? video.transcript_segments.length : 0;
  const summaryDirty = props.summaryDraft.trim() !== video.summary.trim();
  const chaptersDirty = props.chaptersDraft.trim() !== chaptersToText(video.chapters).trim();
  const transcriptDirty = props.transcriptDraft.trim() !== video.transcript.trim();
  const toggle = (section: SectionId) => setOpenSection(openSection === section ? null : section);
  const meta: Record<SectionId, string> = {
    thumbnail: ready.thumbnail ? "Prête" : "À ajouter",
    summary: ready.summary ? excerpt(video.summary) : "À écrire",
    chapters: ready.chapters ? `${chapterCount} chapitre${chapterCount > 1 ? "s" : ""}` : "À ajouter",
    transcript: ready.transcript ? (segmentCount > 0 ? `${segmentCount} passages${video.transcript_source === "manual" ? ", relue" : ""}` : "Prête") : "À relire",
  };
  const section = (id: SectionId, body: React.ReactNode) => <section className={`vd-section${openSection === id ? " is-open" : ""}`} key={id}>
    <button type="button" className="vd-section-head" aria-expanded={openSection === id} aria-controls={`vd-section-${id}`} onClick={() => toggle(id)}>
      <span className={`vd-dot${ready[id] ? " is-done" : ""}`} aria-hidden="true">{ready[id] ? <Check /> : null}</span>
      <span className="vd-section-title"><strong>{SECTION_LABELS[id]}</strong><small>{meta[id]}</small></span>
      <ChevronDown className="vd-chevron" aria-hidden="true" />
    </button>
    {openSection === id ? <div className="vd-section-body" id={`vd-section-${id}`}>{body}</div> : null}
  </section>;

  return <>
    <div className="vd-detail-head">
      <div>
        <p className="vd-detail-kicker">{locationLabel(video.bloc_id === "protocole" ? "protocole" : Number(video.bloc_id))}, épisode {video.position}</p>
        <h3 id="vd-detail-title">{video.title}</h3>
        <span className={`vd-status vd-status-${online ? "online" : video.status}`}><i aria-hidden="true" />{videoStatus(video)}</span>
      </div>
      <button className="vd-icon-button" type="button" onClick={props.onClose} aria-label="Fermer le détail"><X aria-hidden="true" /></button>
    </div>

    <div className="vd-detail-art">{video.thumbnailUrl ? <SafeThumbnail src={video.thumbnailUrl} alt={`Miniature de ${video.title}`} unoptimized sizes="640px" /> : <button type="button" className="vd-art-empty" onClick={() => setOpenSection("thumbnail")}><ImageIcon aria-hidden="true" /><span>Ajouter une miniature</span></button>}</div>

    {online ? <p className="vd-banner vd-banner-online" role="status"><Check aria-hidden="true" />En ligne. Le contenu n'est plus modifiable ici.</p> : <div className="vd-progress-card" role="status">
      <div><strong>{done === total ? "Prête à publier" : `${done} sur ${total} prêts`}</strong><small>{processing ? "La vidéo est en cours de traitement." : done === total ? "Tout est en place." : `Il manque ${missingSections(video).map((id) => SECTION_LABELS[id].toLowerCase()).join(", ")}.`}</small></div>
      <ol className="vd-meter" aria-label="Étapes de préparation">{SECTION_ORDER.map((id) => <li key={id} className={ready[id] ? "is-done" : ""}><button type="button" onClick={() => setOpenSection(id)}>{SECTION_LABELS[id]}</button></li>)}</ol>
    </div>}

    <div className="vd-sections">
      {section("thumbnail", <>
        <p>Choisis un instant de la vidéo ou dépose une image 16:9.</p>
        {locked ? null : <div className="vd-thumbnail-tools">
          <label className="vd-secondary">Déposer une image<input type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={busy} onChange={(event) => { props.onThumbnailFile(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>
          {[0.25, 0.5, 0.75].map((ratio) => <button className="vd-thumbnail-time" type="button" key={ratio} disabled={busy || !video.duration_seconds} onClick={() => props.onThumbnailTime(ratio)}>{Math.round(ratio * 100)} %<small>{formatDuration(video.duration_seconds ? Math.round(video.duration_seconds * ratio) : null)}</small></button>)}
        </div>}
      </>)}
      {section("summary", <>
        <textarea value={props.summaryDraft} readOnly={locked} onChange={(event) => props.setSummaryDraft(event.target.value)} maxLength={2_000} rows={5} placeholder="Écris le résumé de cette vidéo." aria-label="Résumé" />
        {locked ? null : <div className="vd-section-foot"><small>{props.summaryDraft.length} / 2 000</small><button className="vd-secondary" type="button" disabled={contentBusy || !summaryDirty || !props.summaryDraft.trim()} onClick={props.onSaveSummary}>Enregistrer</button></div>}
      </>)}
      {section("chapters", <>
        <textarea value={props.chaptersDraft} readOnly={locked} onChange={(event) => props.setChaptersDraft(event.target.value)} rows={8} placeholder={"Une ligne par chapitre\n0:00 Introduction"} aria-label="Chapitres, une ligne par chapitre" spellCheck={false} />
        {props.chaptersDraft.trim() && chaptersParsed.error ? <p className="vd-form-error" role="alert">{chaptersParsed.error}</p> : null}
        {locked ? null : <div className="vd-section-foot"><small>{chaptersParsed.error || !props.chaptersDraft.trim() ? "Une ligne par chapitre : 0:00 Titre" : `${chaptersParsed.chapters.length} chapitre${chaptersParsed.chapters.length > 1 ? "s" : ""} valide${chaptersParsed.chapters.length > 1 ? "s" : ""}`}</small><button className="vd-secondary" type="button" disabled={contentBusy || !chaptersDirty || Boolean(chaptersParsed.error)} onClick={props.onSaveChapters}>Enregistrer</button></div>}
      </>)}
      {section("transcript", <>
        <textarea value={props.transcriptDraft} readOnly={locked} onChange={(event) => props.setTranscriptDraft(event.target.value)} maxLength={250_000} rows={10} placeholder="Colle ou relis la transcription, avec ou sans repères [0:00]." aria-label="Transcription relue" />
        {locked ? null : <div className="vd-section-foot"><small>{props.transcriptDraft.length.toLocaleString("fr-FR")} / 250 000</small><button className="vd-secondary" type="button" disabled={contentBusy || !transcriptDirty || !props.transcriptDraft.trim()} onClick={props.onSaveTranscript}>Enregistrer</button></div>}
      </>)}
    </div>

    <div className="vd-actions">
      {canPublish ? <button className="vd-primary vd-publish" type="button" disabled={busy || Boolean(reason)} onClick={props.onPublish}>{busy ? "Publication en cours" : "Publier la vidéo"}</button> : null}
      {!video.replaced_at ? <div className="vd-secondary-actions"><button className="vd-secondary" type="button" onClick={props.onReplace}>Remplacer la vidéo</button>{video.status === "waiting" ? <button className="vd-danger-link" type="button" onClick={props.onRemove}>Retirer</button> : null}</div> : null}
    </div>
  </>;
}
