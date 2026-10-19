"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react/lazy";
import type MuxPlayerElement from "@mux/mux-player";
import { getLessonPlayback, type LessonPlayback } from "@/app/actions/lessonPlayback";
import { useLessonPosition } from "@/hooks/useLessonPosition";

type LessonPlayerProps = {
  sectionId: string;
  title: string;
  onCompleted: () => void;
};

type PlayerState = { status: "loading" } | { status: "unavailable" } | { status: "ready"; playback: Extract<LessonPlayback, { ok: true }> };

export function LessonPlayer({ sectionId, title, onCompleted }: LessonPlayerProps) {
  const [state, setState] = useState<PlayerState>({ status: "loading" });
  const tokenRefreshed = useRef(false);
  const { report } = useLessonPosition(sectionId, onCompleted);

  const load = useCallback(async () => {
    const playback = await getLessonPlayback(sectionId);
    setState(playback.ok ? { status: "ready", playback } : { status: "unavailable" });
  }, [sectionId]);

  useEffect(() => {
    tokenRefreshed.current = false;
    setState({ status: "loading" });
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
    return <div data-testid="lesson-loading" className="aspect-video w-full animate-pulse rounded-xl border border-white/10 bg-white/[0.04]" />;
  }

  if (state.status === "unavailable") {
    return (
      <div data-testid="lesson-unavailable" role="status" className="flex aspect-video w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-center text-sm text-white/50">
        Vidéo indisponible pour le moment.
      </div>
    );
  }

  const { playback } = state;
  const readTime = (event: Event) => {
    const element = event.currentTarget as MuxPlayerElement;
    return { time: element.currentTime, duration: element.duration };
  };

  return (
    <div data-testid="lesson-player" className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
      <MuxPlayer
        key={playback.tokens.playback}
        playbackId={playback.playbackId}
        tokens={playback.tokens}
        startTime={playback.startSeconds}
        streamType="on-demand"
        metadata={{ video_id: sectionId, video_title: title }}
        style={{ width: "100%", height: "100%" }}
        onTimeUpdate={(event) => { const { time, duration } = readTime(event); report(time, duration); }}
        onPause={(event) => { const { time, duration } = readTime(event); report(time, duration, true); }}
        onEnded={(event) => { const { duration } = readTime(event); report(duration, duration, true); }}
        onError={handleError}
      />
      <div data-testid="lesson-watermark" className="pointer-events-none absolute bottom-3 right-3 select-none text-[11px] text-white/25">
        {playback.viewerEmail}
      </div>
    </div>
  );
}
