"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import { AppState } from "@/components/ui/AppState";
import type { SearchItem } from "@/lib/search/catalog";
import { animateAppElement, animateEntryCascade } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";

const SUBJECTS = [["Vendre", "vente"], ["Prix", "prix"], ["Skills", "skills"], ["Site web", "site web"]] as const;

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [selected, setSelected] = useState(0);
  const [retryKey, setRetryKey] = useState(0);
  const displayedResults = results;
  const input = useRef<HTMLInputElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const resultsRef = useRef(displayedResults);
  const selectedRef = useRef(selected);
  useEffect(() => { resultsRef.current = displayedResults; }, [displayedResults]);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  useEffect(() => {
    if (!open) return;
    const origin = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const searchInput = input.current;
    if (searchInput) {
      if (origin === document.body || origin?.matches(":focus-visible")) delete searchInput.dataset.focusRing;
      else searchInput.dataset.focusRing = "none";
      searchInput.focus({ preventScroll: true });
    }
    document.documentElement.style.overflow = "hidden";
    if (scrim.current) animateAppElement(scrim.current, [{ opacity: 0 }, { opacity: 1 }], "doux");
    if (panel.current) {
      const compact = window.matchMedia("(max-width: 734px)").matches;
      animateAppElement(panel.current, compact
        ? [{ opacity: 0, transform: "translateY(-16px)" }, { opacity: 1, transform: "none" }]
        : [{ opacity: 0, transform: "translateX(-50%) translateY(-10px) scale(.98)" }, { opacity: 1, transform: "translateX(-50%)" }], "doux");
    }
    const key = (event: KeyboardEvent) => {
      if (event.key === "Tab") delete searchInput?.dataset.focusRing;
      if (event.key === "Escape") onClose();
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && resultsRef.current.length) {
        event.preventDefault();
        const length = resultsRef.current.length;
        const next = (selectedRef.current + (event.key === "ArrowDown" ? 1 : length - 1)) % length;
        setSelected(next);
        requestAnimationFrame(() => document.getElementById(`search-${resultsRef.current[next].id}`)?.scrollIntoView({ block: "nearest" }));
        void playAppSound("select");
      }
      const selectedResult = resultsRef.current[selectedRef.current];
      if (event.key === "Enter" && selectedResult) {
        event.preventDefault();
        void playAppSound(selectedResult.locked ? "error" : "click");
        window.setTimeout(() => window.location.assign(selectedResult.locked ? "/checkout" : selectedResult.href), 110);
      }
      if (event.key === "Tab" && panel.current) {
        const focusable = [...panel.current.querySelectorAll<HTMLElement>('input, button, a[href], [tabindex]:not([tabindex="-1"])')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("keydown", key); document.documentElement.style.overflow = ""; delete searchInput?.dataset.focusRing; origin?.focus(); };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !query.trim()) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setStatus("loading");
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!response.ok) throw new Error(String(response.status));
        const body = await response.json() as { results: SearchItem[] };
        setResults(body.results);
        setSelected(0);
        setStatus("ready");
      } catch (error) {
        if ((error as Error).name !== "AbortError") { setResults([]); setStatus("error"); void playAppSound("error"); }
      }
    }, 140);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [open, query, retryKey]);

  useEffect(() => {
    if (status !== "ready") return;
    const elements = [...(list.current?.querySelectorAll<HTMLElement>(".srch__r") ?? [])].slice(0, 8);
    animateEntryCascade(elements);
  }, [displayedResults, status]);

  const updateQuery = (next: string) => {
    setQuery(next);
    if (!next.trim()) { setResults([]); setStatus("idle"); }
  };

  if (!open) return null;
  return (
    <div className="srch" role="dialog" aria-modal="true" aria-label="Recherche">
      <button ref={scrim} className="srch__scrim" type="button" aria-label="Fermer la recherche" data-sfx="none" onClick={onClose} />
      <div className="srch__panel" ref={panel}>
        <label className="srch__in"><DaIcon name="search" /><span className="sr">Rechercher</span><input ref={input} type="search" value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Vendre, prix, skills, site…" autoComplete="off" aria-label="Rechercher une vidéo, un bloc ou un sujet" aria-controls="build-search-results" aria-activedescendant={displayedResults[selected] ? `search-${displayedResults[selected].id}` : undefined} /><kbd>Esc</kbd></label>
        <div className="srch__chips">{SUBJECTS.map(([label, value]) => <button className="chip" type="button" key={value} onClick={() => updateQuery(value)}>{label}</button>)}</div>
        <div ref={list} className="srch__list" id="build-search-results" role="listbox" aria-busy={status === "loading"} aria-label={status === "ready" ? `${displayedResults.length} résultats` : "Résultats de recherche"}>
          {status === "loading" && <p className="srch__empty">On cherche dans BUILD.</p>}
          {status === "error" && <AppState compact headingLevel={2} tone="alert" object="bloc" title="La recherche ne répond pas." detail="Rien n’est perdu. Réessaie dans un instant." action={{ label: "Réessayer", onClick: () => setRetryKey((value) => value + 1) }} />}
          {status === "ready" && results.length === 0 && <AppState compact headingLevel={2} object="offre" title="Rien avec ces mots." detail="Essaie un sujet plus simple, comme prix, vendre ou skill." action={{ label: "Effacer", onClick: () => updateQuery("") }} />}
          {status === "idle" && <p className="srch__empty">Écris un sujet, un chapitre ou le nom d’un skill.</p>}
          {displayedResults.map((result, index) => <Link id={`search-${result.id}`} key={result.id} href={result.locked ? "/checkout" : result.href} className="srch__r" role="option" aria-selected={selected === index} data-sfx={result.locked ? "error" : undefined} onMouseEnter={() => setSelected(index)} onClick={onClose}><Image src={result.image} alt="" width={96} height={54} /><span><span className="srch__k">{result.locked ? `${result.kind}, accès requis` : result.kind}</span><span className="srch__t">{result.title}</span><span className="srch__s">{result.context}</span></span></Link>)}
        </div>
      </div>
    </div>
  );
}
