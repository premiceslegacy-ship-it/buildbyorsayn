"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import { NewVideoMarker } from "@/components/nouveautes/NouveautesGrid";
import type { NouveautesFeed } from "@/lib/nouveautes/loadVideos";
import { formatVideoDate, groupVideosByMonth, youtubeThumbnailUrl, youtubeWatchUrl } from "@/lib/nouveautes/videos";
import { playAppSound } from "@/lib/ui/sound";
import { animateAppElement } from "@/lib/ui/motion";

type Filter = "all" | "youtube" | "build";

export function NouveautesView({ feed }: { feed: NouveautesFeed }) {
  const [filter, setFilter] = useState<Filter>("all");
  const tabs = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const moveSlider = useCallback(() => {
    const host = tabs.current;
    const pill = slider.current;
    const active = host?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!host || !pill || !active) return;
    const activeRect = active.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    const offsetX = activeRect.left - hostRect.left + host.scrollLeft;
    const offsetY = activeRect.top - hostRect.top;
    pill.style.width = `${activeRect.width}px`;
    pill.style.height = `${activeRect.height}px`;
    pill.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }, []);
  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash.slice(1);
      setFilter(hash === "youtube" || hash === "build" ? hash : "all");
    };
    const timeout = window.setTimeout(syncHash, 0);
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("resize", moveSlider);
    return () => { window.clearTimeout(timeout); window.removeEventListener("hashchange", syncHash); window.removeEventListener("resize", moveSlider); };
  }, [moveSlider]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      moveSlider();
      content.current?.querySelectorAll(":scope > .nw__m").forEach((element, index) => animateAppElement(element, [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], "doux", Math.min(index * 40, 300)));
    });
    return () => cancelAnimationFrame(frame);
  }, [filter, moveSlider]);
  const select = (next: Filter) => { if (next === filter) return; setFilter(next); window.history.replaceState(null, "", next === "all" ? location.pathname : `#${next}`); void playAppSound("select"); };
  const keyFilter = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const filters: Filter[] = ["all", "youtube", "build"];
    const index = filters.indexOf(filter);
    const next = filters[(index + (event.key === "ArrowRight" ? 1 : filters.length - 1)) % filters.length];
    event.preventDefault();
    select(next);
    tabs.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]')[filters.indexOf(next)]?.focus();
  };
  const groups = filter === "build" ? [] : groupVideosByMonth(feed.videos);
  const filterLabel = filter === "all" ? "Tout" : filter === "youtube" ? "YouTube" : "Sur BUILD";
  const resultCount = groups.reduce((count, group) => count + group.videos.length, 0);
  return <>
    <header className="hero--app"><div className="hero__in"><h1 className="t-1">Nouveautés</h1><p className="t-lede">Les nouvelles vidéos de la chaîne YouTube, et celles qui arrivent dans BUILD.</p><div ref={tabs} className="seg has-slider" role="tablist" aria-label="Filtrer les nouveautés"><i ref={slider} className="slider" /><button role="tab" tabIndex={filter === "all" ? 0 : -1} aria-selected={filter === "all"} data-sfx="none" onKeyDown={keyFilter} onClick={() => select("all")}>Tout</button><button role="tab" tabIndex={filter === "youtube" ? 0 : -1} aria-selected={filter === "youtube"} data-sfx="none" onKeyDown={keyFilter} onClick={() => select("youtube")}>YouTube</button><button role="tab" tabIndex={filter === "build" ? 0 : -1} aria-selected={filter === "build"} data-sfx="none" onKeyDown={keyFilter} onClick={() => select("build")}>Sur BUILD</button></div></div></header>
    <p className="sr" role="status">{resultCount} {resultCount > 1 ? "vidéos" : "vidéo"}, filtre {filterLabel}</p>
    <div className="nw" ref={content}>
      {feed.status === "error" && <p className="nw__empty" role="alert">Les nouveautés ne peuvent pas être chargées. Réessaie plus tard.</p>}
      {feed.status !== "error" && groups.length === 0 && <p className="nw__empty" data-testid="nouveautes-empty">Aucune nouveauté dans cette catégorie pour le moment.</p>}
      {groups.map((group) => <section className="nw__m" key={group.key}><h2 className="t-h2">{group.label}</h2><ul>{group.videos.map((video) => <li key={video.video_id} data-video-card data-published-at={video.published_at}><a className="nw__e" href={youtubeWatchUrl(video.video_id)} target="_blank" rel="noopener"><span className="nw__img"><img src={youtubeThumbnailUrl(video.video_id)} alt="" loading="lazy" /></span><span className="nw__b"><span className="nw__tag"><DaIcon name="external" />YouTube</span><NewVideoMarker /><span className="nw__t">{video.title}</span><time className="nw__d" dateTime={video.published_at}>{formatVideoDate(video.published_at)}</time></span></a></li>)}</ul></section>)}
    </div>
  </>;
}
