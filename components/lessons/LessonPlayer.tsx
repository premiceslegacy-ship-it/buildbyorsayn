"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react/lazy";
import type MuxPlayerElement from "@mux/mux-player";
import { getLessonPlayback, type LessonPlayback } from "@/app/actions/lessonPlayback";
import { useLessonPosition } from "@/hooks/useLessonPosition";
import styles from "@/components/reader/reader.module.css";

export type LessonPlayerHandle = {
  seekAndPlay: (seconds: number) => void;
};

type DirectVideo = {
  id: string;
  playbackId: string;
  tokens: { playback: string; thumbnail: string; storyboard: string };
};

type LessonPlayerProps = {
  sectionId?: string;
  progressId?: string;
  title: string;
  onCompleted: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (time: number, duration: number) => void;
  directVideo?: DirectVideo;
  posterUrl?: string;
};

type PlayerState = { status: "loading" } | { status: "unavailable" } | { status: "ready"; playback: Extract<LessonPlayback, { ok: true }> };

export const LessonPlayer = forwardRef<LessonPlayerHandle, LessonPlayerProps>(function LessonPlayer({ sectionId, progressId, title, onCompleted, onEnded, onTimeUpdate, directVideo, posterUrl }, ref) {
  const initialPlayback: PlayerState = directVideo ? {
    status: "ready",
    playback: {
      ok: true,
      playbackId: directVideo.playbackId,
      tokens: directVideo.tokens,
      viewerEmail: "",
      startSeconds: 0,
    },
  } : { status: "loading" };
  const [state, setState] = useState<PlayerState>(initialPlayback);
  const tokenRefreshed = useRef(false);
  const watched = useRef({ time: 0, duration: 0 });
  const playerRef = useRef<MuxPlayerElement | null>(null);
  const progressKey = progressId ?? sectionId ?? directVideo?.id ?? "";
  const { report } = useLessonPosition(progressKey, onCompleted);
  useImperativeHandle(ref, () => ({
    seekAndPlay(seconds) {
      const player = playerRef.current;
      if (!player) return;
      player.currentTime = Math.max(0, seconds);
      void player.play();
    },
  }), []);

  // Leaving the lesson (another chapter, Aujourd'hui, a closed tab) keeps the exact second, not the last 15 s checkpoint.
  useEffect(() => {
    const flush = () => {
      const { time, duration } = watched.current;
      if (time > 0) report(time, duration, true);
    };
    const onHidden = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHidden);
      flush();
    };
  }, [report]);

  const load = useCallback(async () => {
    if (directVideo) {
      setState({
        status: "ready",
        playback: {
          ok: true,
          playbackId: directVideo.playbackId,
          tokens: directVideo.tokens,
          viewerEmail: "",
          startSeconds: 0,
        },
      });
      return;
    }
    if (!sectionId) {
      setState({ status: "unavailable" });
      return;
    }
    const playback = await getLessonPlayback(sectionId);
    setState(playback.ok ? { status: "ready", playback } : { status: "unavailable" });
  }, [directVideo, sectionId]);

  useEffect(() => {
    tokenRefreshed.current = false;
    if (directVideo) {
      void load();
      return;
    }
    if (!sectionId) {
      setState({ status: "unavailable" });
      return;
    }
    let cancelled = false;
    getLessonPlayback(sectionId).then((playback) => {
      if (!cancelled) setState(playback.ok ? { status: "ready", playback } : { status: "unavailable" });
    }, () => {
      if (!cancelled) setState({ status: "unavailable" });
    });
    return () => { cancelled = true; };
  }, [directVideo, load, sectionId]);

  // A tab left open past the token lifetime fails to fetch segments: sign a
  // fresh token once, then give up so a real outage is surfaced.
  const handleError = useCallback(() => {
    if (tokenRefreshed.current) {
      setState({ status: "unavailable" });
      return;
    }
    tokenRefreshed.current = true;
    void load();
  }, [load]);

  if (state.status === "loading") {
    return <div data-testid="lesson-loading" aria-label="Chargement de la vidéo" className={styles.lessonLoading} />;
  }

  if (state.status === "unavailable") {
    return (
      <div data-testid="lesson-unavailable" role="status" className={styles.lessonUnavailable}>
        <p>La vidéo ne peut pas être chargée pour le moment.</p>
        <button type="button" className={styles.toolButton} onClick={() => void load()}>Réessayer</button>
      </div>
    );
  }

  const { playback } = state;
  const readTime = (event: Event) => {
    const element = event.currentTarget as MuxPlayerElement;
    return { time: element.currentTime, duration: element.duration };
  };

  return (
    <div data-testid="lesson-player" className={styles.lessonPlayer}>
      <MuxPlayer
        ref={playerRef}
        playbackId={playback.playbackId}
        tokens={playback.tokens}
        startTime={playback.startSeconds}
        streamType="on-demand"
        poster={posterUrl}
        disableCookies
        metadata={{ video_id: progressKey, video_title: title }}
        style={{ width: "100%", height: "100%" }}
        onTimeUpdate={(event) => { const { time, duration } = readTime(event); watched.current = { time, duration }; report(time, duration); onTimeUpdate?.(time, duration); }}
        onPause={(event) => { const { time, duration } = readTime(event); report(time, duration, true); }}
        onEnded={(event) => { const { duration } = readTime(event); report(duration, duration, true); onEnded?.(); }}
        onError={handleError}
      />
      <div data-testid="lesson-watermark" className={styles.watermark}>
        {playback.viewerEmail}
      </div>
    </div>
  );
});
