"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { markBuildNewsSeen } from "@/app/nouveautes/actions";
import { DaIcon } from "@/components/da/DaIcon";
import { AppState } from "@/components/ui/AppState";
import { NewVideoMarker } from "@/components/nouveautes/NouveautesGrid";
import type { NouveautesFeed } from "@/lib/nouveautes/loadVideos";
import { formatVideoDate, groupNouveautesByMonth, type NouveautesItem } from "@/lib/nouveautes/videos";
import { animateEntryCascade } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";

type Filter = "all" | "youtube" | "build";

export function NouveautesView({ feed }: { feed: NouveautesFeed }) {
  const [filter, setFilter] = useState<Filter>("all");
  const tabs = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const didCascade = useRef(false);
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
      if (!didCascade.current) {
        didCascade.current = true;
        animateEntryCascade(content.current?.querySelectorAll(".nw__e") ?? []);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [filter, moveSlider]);
  const select = (next: Filter) => { if (next === filter) return; setFilter(next); window.history.replaceState(null, "", next === "all" ? location.pathname : `#${next}`); };
  const keyFilter = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    const filters: Filter[] = ["all", "youtube", "build"];
    const index = filters.indexOf(filter);
    const next = filters[(index + (event.key === "ArrowRight" ? 1 : filters.length - 1)) % filters.length];
    event.preventDefault();
    select(next);
    void playAppSound("select");
    tabs.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]')[filters.indexOf(next)]?.focus();
  };
  const visibleItems = feed.items.filter((item) => filter === "all" || item.source === filter);
  const freshItems = visibleItems.filter((item) => item.isFresh);
  const groups = groupNouveautesByMonth(visibleItems.filter((item) => !item.isFresh));
  const filterLabel = filter === "all" ? "Tout" : filter === "youtube" ? "YouTube" : "Sur BUILD";
  const resultCount = freshItems.length + groups.reduce((count, group) => count + group.items.length, 0);
  const hasError = filter === "all"
    ? feed.status === "error"
    : filter === "youtube" ? feed.sources.youtube === "error" : feed.sources.build === "error";
  return <>
    <header className="hero--app"><div className="hero__in"><h1 className="t-1">Nouveautés</h1><p className="t-lede">Les nouvelles vidéos de la chaîne YouTube, et celles qui arrivent dans BUILD.</p><div ref={tabs} className="seg has-slider" role="tablist" aria-label="Filtrer les nouveautés"><i ref={slider} className="slider" /><button role="tab" tabIndex={filter === "all" ? 0 : -1} aria-selected={filter === "all"} onKeyDown={keyFilter} onClick={() => select("all")}>Tout</button><button role="tab" tabIndex={filter === "youtube" ? 0 : -1} aria-selected={filter === "youtube"} onKeyDown={keyFilter} onClick={() => select("youtube")}>YouTube</button><button role="tab" tabIndex={filter === "build" ? 0 : -1} aria-selected={filter === "build"} onKeyDown={keyFilter} onClick={() => select("build")}>Sur BUILD</button></div></div></header>
    <p className="sr" role="status">{resultCount} nouveauté{resultCount > 1 ? "s" : ""}, filtre {filterLabel}</p>
    <div className="nw" ref={content}>
      {hasError && <AppState compact headingLevel={2} tone="alert" object="livraison" title="Ce fil ne répond pas." detail="Réessaie maintenant, ou retourne à Aujourd’hui." action={{ label: "Réessayer", onClick: () => window.location.reload() }} />}
      {!hasError && groups.length === 0 && freshItems.length === 0 && <AppState compact headingLevel={2} object="livraison" title="Rien de neuf pour l’instant." detail="Reviens bientôt, ou relis un chapitre." action={{ label: "Voir le programme", href: "/programme" }} testId="nouveautes-empty" />}
      {freshItems.length > 0 && <section className="nw__m" aria-labelledby="nouveautes-fresh-title"><h2 className="t-h2" id="nouveautes-fresh-title">Nouveau</h2><ul>{freshItems.map((item) => <NewsEntry key={item.id} item={item} />)}</ul></section>}
      {groups.map((group) => <section className="nw__m" key={group.key}><h2 className="t-h2">{group.label}</h2><ul>{group.items.map((item) => <NewsEntry key={item.id} item={item} />)}</ul></section>)}
    </div>
  </>;
}

function NewsEntry({ item }: { item: NouveautesItem }) {
  const open = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (!item.newsId || !item.href || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    try {
      await markBuildNewsSeen(item.newsId);
    } finally {
      window.location.assign(item.href);
    }
  };
  const body = <><span className="nw__img"><img src={item.thumbnail} alt="" loading="lazy" /></span><span className="nw__b"><span className="nw__tag">{item.source === "youtube" && <DaIcon name="external" />}{item.source === "youtube" ? "YouTube" : item.blocLabel ?? "Sur BUILD"}</span><NewVideoMarker fresh={item.isFresh} /><span className="nw__t">{item.title}</span>{item.sentence && <span className="row__d">{item.sentence}</span>}<time className="nw__d" dateTime={item.publishedAt}>{formatVideoDate(item.publishedAt)}</time></span></>;
  return <li data-video-card data-published-at={item.publishedAt}>{item.href ? <a className="nw__e" href={item.href} onClick={open} {...(item.source === "youtube" ? { target: "_blank", rel: "noopener" } : {})}>{body}</a> : <div className="nw__e">{body}</div>}</li>;
}
