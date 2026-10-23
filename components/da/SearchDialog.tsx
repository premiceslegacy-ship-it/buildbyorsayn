"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { DaIcon } from "@/components/da/DaIcon";
import type { SearchItem } from "@/lib/search/catalog";
import { animateAppElement } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";

const SUBJECTS = [["Vendre", "vente"], ["Prix", "prix"], ["Skills", "skills"], ["Site web", "site web"]] as const;
const KINDS = ["Vidéo", "Chapitre", "Skill"] as const;

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [selected, setSelected] = useState(0);
  const displayedResults = useMemo(() => KINDS.flatMap((kind) => results.filter((result) => result.kind === kind)), [results]);
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
    input.current?.focus();
    document.documentElement.style.overflow = "hidden";
    scrim.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
    if (panel.current) {
      const compact = window.matchMedia("(max-width: 734px)").matches;
      animateAppElement(panel.current, compact
        ? [{ transform: "translateY(100%)" }, { transform: "none" }]
        : [{ opacity: 0, transform: "translateX(-50%) translateY(-10px) scale(.98)" }, { opacity: 1, transform: "translateX(-50%)" }], "doux");
    }
    const key = (event: KeyboardEvent) => {
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
    return () => { document.removeEventListener("keydown", key); document.documentElement.style.overflow = ""; origin?.focus(); };
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
  }, [open, query]);

  useEffect(() => {
    if (status !== "ready") return;
    list.current?.querySelectorAll<HTMLElement>(".srch__r").forEach((element, index) => {
      if (index < 8) animateAppElement(element, [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], "doux", Math.min(index * 40, 300));
    });
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
        <div className="srch__chips">{SUBJECTS.map(([label, value]) => <button className="chip" type="button" key={value} data-sfx="none" onClick={() => { updateQuery(value); void playAppSound("select"); }}>{label}</button>)}</div>
        <div ref={list} className="srch__list" id="build-search-results" role="listbox" aria-busy={status === "loading"} aria-label={status === "ready" ? `${displayedResults.length} résultats` : "Résultats de recherche"}>
          {status === "loading" && <p className="srch__empty">Recherche en cours…</p>}
          {status === "error" && <p className="srch__empty">La recherche est indisponible. Réessaie.</p>}
          {status === "ready" && results.length === 0 && <p className="srch__empty">Aucun résultat pour cette recherche.</p>}
          {status === "idle" && <p className="srch__empty">Cherche une vidéo, un chapitre ou un skill.</p>}
          {KINDS.map((kind) => {
            const group = displayedResults.filter((result) => result.kind === kind);
            if (!group.length) return null;
            return <div className="srch__group" role="presentation" key={kind}><p className="srch__g">{kind}</p>{group.map((result) => { const index = displayedResults.indexOf(result); return <Link id={`search-${result.id}`} key={result.id} href={result.locked ? "/checkout" : result.href} className="srch__r" role="option" aria-selected={selected === index} data-sfx="none" onMouseEnter={() => setSelected(index)} onClick={() => { void playAppSound(result.locked ? "error" : "click"); onClose(); }}><Image src={result.image} alt="" width={96} height={54} /><span><span className="srch__t">{result.title}</span><span className="srch__s">{result.context}</span></span><span className="srch__k">{result.locked ? "Accès requis" : kind}</span></Link>; })}</div>;
          })}
        </div>
      </div>
    </div>
  );
}
