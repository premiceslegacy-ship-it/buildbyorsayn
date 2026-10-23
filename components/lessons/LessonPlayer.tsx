"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react/lazy";
import type MuxPlayerElement from "@mux/mux-player";
import { getLessonPlayback, type LessonPlayback } from "@/app/actions/lessonPlayback";
import { useLessonPosition } from "@/hooks/useLessonPosition";
import styles from "@/components/reader/reader.module.css";

type LessonPlayerProps = {
  sectionId: string;
  title: string;
  onCompleted: () => void;
  onEnded?: () => void;
};

type PlayerState = { status: "loading" } | { status: "unavailable" } | { status: "ready"; playback: Extract<LessonPlayback, { ok: true }> };

export function LessonPlayer({ sectionId, title, onCompleted, onEnded }: LessonPlayerProps) {
  const [state, setState] = useState<PlayerState>({ status: "loading" });
  const tokenRefreshed = useRef(false);
  const { report } = useLessonPosition(sectionId, onCompleted);

  const load = useCallback(async () => {
    const playback = await getLessonPlayback(sectionId);
    setState(playback.ok ? { status: "ready", playback } : { status: "unavailable" });
  }, [sectionId]);

  useEffect(() => {
    tokenRefreshed.current = false;
    let cancelled = false;
    getLessonPlayback(sectionId).then((playback) => {
      if (!cancelled) setState(playback.ok ? { status: "ready", playback } : { status: "unavailable" });
    }, () => {
      if (!cancelled) setState({ status: "unavailable" });
    });
    return () => { cancelled = true; };
  }, [sectionId]);

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
        key={playback.tokens.playback}
        playbackId={playback.playbackId}
        tokens={playback.tokens}
        startTime={playback.startSeconds}
        streamType="on-demand"
        disableCookies
        metadata={{ video_id: sectionId, video_title: title }}
        style={{ width: "100%", height: "100%" }}
        onTimeUpdate={(event) => { const { time, duration } = readTime(event); report(time, duration); }}
        onPause={(event) => { const { time, duration } = readTime(event); report(time, duration, true); }}
        onEnded={(event) => { const { duration } = readTime(event); report(duration, duration, true); onEnded?.(); }}
        onError={handleError}
      />
      <div data-testid="lesson-watermark" className={styles.watermark}>
        {playback.viewerEmail}
      </div>
    </div>
  );
}
