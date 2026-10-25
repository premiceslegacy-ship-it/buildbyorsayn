"use client";

import { useRef, useState } from "react";
import { SafeThumbnail } from "@/components/media/SafeThumbnail";
import { LessonPlayer, type LessonPlayerHandle } from "@/components/lessons/LessonPlayer";
import { formatLessonDuration } from "@/components/lessons/LessonMeta";
import type { BlocVideo } from "@/lib/blocData.server";
import styles from "@/components/reader/reader.module.css";

export function ProtocolVideo({ videos }: { videos: BlocVideo[] }) {
  const playerRef = useRef<LessonPlayerHandle>(null);
  const [selectedPosition, setSelectedPosition] = useState(videos[0]?.position ?? 0);
  const [currentTime, setCurrentTime] = useState(0);
  const selected = videos.find((video) => video.position === selectedPosition) ?? videos[0];
  if (!selected) return null;
  const currentChapter = selected.chapters.reduce((index, chapter, chapterIndex) => chapter.startSeconds <= currentTime ? chapterIndex : index, -1);

  const selectVideo = (position: number) => {
    setSelectedPosition(position);
    setCurrentTime(0);
    window.history.replaceState({}, "", `${window.location.pathname}?mode=video&video=${position}`);
  };

  return <div className={styles.videoLayout} data-testid="protocol-private-videos">
    <div className={styles.stageWrap}>
      <div className={styles.stage}>
        <LessonPlayer
          ref={playerRef}
          directVideo={{ id: selected.id, playbackId: selected.playbackId, tokens: selected.tokens }}
          progressId={selected.id}
          posterUrl={selected.thumbnailUrl}
          title={selected.title}
          onCompleted={() => undefined}
          onTimeUpdate={(time) => setCurrentTime(time)}
        />
      </div>
    </div>
    <header className={styles.videoIntro}>
      <h1>Le protocole zéro</h1>
      <p className={styles.videoMeta}>{videos.length} épisode{videos.length > 1 ? "s" : ""}, {formatLessonDuration(selected.durationSeconds)}</p>
      {selected.summary ? <p className={styles.videoSummary}>{selected.summary}</p> : null}
    </header>
    {selected.chapters.length > 0 ? <>
      <div className={styles.chapterHeading}><h2>Chapitres</h2><span>{selected.chapters.length}</span></div>
      <ol className={styles.chapterList}>{selected.chapters.map((chapter, index) => <li key={`${selected.id}-${chapter.startSeconds}`}><button className={styles.chapterRow} type="button" aria-current={index === currentChapter ? "true" : undefined} disabled={!selected.playbackId} onClick={() => { setCurrentTime(chapter.startSeconds); playerRef.current?.seekAndPlay(chapter.startSeconds); }}><span className={styles.chapterNumber}>{index + 1}</span><span className={styles.chapterCopy}><b>{chapter.title}</b></span><span className={styles.chapterMeta}>{Math.floor(chapter.startSeconds / 60)}:{String(chapter.startSeconds % 60).padStart(2, "0")}</span><span className={styles.chapterMark} /></button></li>)}</ol>
    </> : null}
    {videos.length > 1 ? <section className={styles.episodeList} aria-labelledby="protocol-video-list-title"><div className={styles.episodeHeading}><h2 id="protocol-video-list-title">Les épisodes</h2><span>{videos.length} vidéo{videos.length > 1 ? "s" : ""}</span></div><div className={styles.episodeRows}>{videos.map((video) => <button className={`${styles.episodeRow} ${video.id === selected.id ? styles.episodeRowCurrent : ""}`} type="button" key={video.id} onClick={() => selectVideo(video.position)} aria-current={video.id === selected.id ? "true" : undefined}><span className={styles.episodeNumber}>{video.position}</span><span className={styles.episodeArtwork}><SafeThumbnail src={video.thumbnailUrl} alt="" unoptimized sizes="176px" /></span><span className={styles.episodeCopy}><strong>{video.title}</strong>{video.summary ? <span>{video.summary}</span> : null}</span></button>)}</div></section> : null}
  </div>;
}
