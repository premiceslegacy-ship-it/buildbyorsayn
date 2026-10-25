"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { animateAppElement } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import { createBuildNewsAction, deleteBuildNewsAction, loadBuildNewsAction, updateBuildNewsAction } from "./actions";
import type { BuildNewsRow } from "./types";
import "./news.css";

function displayDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris",
  });
}

function parseFrenchDate(value: string): string | null {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day), 12));
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCDate() !== Number(day)) return null;
  return date.toISOString();
}

export function NewsClient({ youtubePanel, hasPendingNewsRequest }: { youtubePanel?: ReactNode; hasPendingNewsRequest?: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [news, setNews] = useState<BuildNewsRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<BuildNewsRow | null>(null);
  const [editing, setEditing] = useState<BuildNewsRow | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const result = await loadBuildNewsAction();
    if ("error" in result) { setNews(null); setError(result.error); return; }
    setNews(result.data);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);
  useEffect(() => {
    if (news && root.current) animateAppElement(root.current, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], "doux");
  }, [news]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const date = parseFrenchDate(String(formData.get("date") ?? ""));
    if (!date) {
      setError("La date doit respecter le format JJ/MM/AAAA.");
      void playAppSound("error");
      return;
    }
    setBusy(true); setError(null);
    const result = await createBuildNewsAction({
      title: String(formData.get("title") ?? ""),
      publishedAt: date,
      thumbnail: String(formData.get("thumbnail") ?? ""),
      blocLabel: String(formData.get("blocLabel") ?? "").trim() || null,
      internalUrl: String(formData.get("internalUrl") ?? "").trim() || null,
      sentence: String(formData.get("sentence") ?? ""),
    });
    setBusy(false);
    if ("error" in result) { setError(result.error); void playAppSound("error"); return; }
    form.reset();
    await load();
    void playAppSound("confirm");
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const formData = new FormData(event.currentTarget);
    setBusy(true); setError(null);
    const result = await updateBuildNewsAction(editing.id, {
      title: String(formData.get("title") ?? ""),
      blocLabel: String(formData.get("blocLabel") ?? "").trim() || null,
      internalUrl: String(formData.get("internalUrl") ?? "").trim() || null,
      sentence: String(formData.get("sentence") ?? ""),
    });
    setBusy(false);
    if ("error" in result) { setError(result.error); void playAppSound("error"); return; }
    setEditing(null);
    await load();
    void playAppSound("confirm");
  }

  async function remove() {
    if (!confirmDelete) return;
    setBusy(true); setError(null);
    const result = await deleteBuildNewsAction(confirmDelete.id);
    setBusy(false);
    if ("error" in result) { setError(result.error); void playAppSound("error"); return; }
    setConfirmDelete(null);
    await load();
    void playAppSound("confirm");
  }

  if (!news && !error) return <div className="grid gap-5" aria-busy="true" aria-label="Chargement des nouveautés"><div className="h-56 animate-pulse rounded-3xl bg-white/5" /><div className="h-72 animate-pulse rounded-3xl bg-white/5" /></div>;
  if (!news) return <section className="rounded-3xl border border-red-400/25 bg-red-500/10 p-6" role="alert"><h2 className="text-lg font-semibold text-white">Les nouveautés ne se sont pas chargées.</h2><p className="mt-2 text-sm text-white/65">{error}</p><button type="button" onClick={() => void load()} className="adm-ghost-button mt-5"><RefreshCw size={16} />Réessayer</button></section>;

  return (
    <div ref={root} className="admin-news-view">
      {hasPendingNewsRequest}
      {error && <p className="admin-news-error" role="alert">{error}</p>}
      {youtubePanel}

      <section className="admin-news-form" aria-labelledby="build-news-form-title">
        <h3 id="build-news-form-title">Ajouter sur BUILD</h3>
        <p className="admin-news-help">Une entrée publiée apparaît chez les membres.</p>
        <form onSubmit={create} className="admin-news-form-grid">
          <label>Titre<input name="title" required maxLength={160} /></label>
          <label>Date<input name="date" type="text" inputMode="numeric" lang="fr" pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}" placeholder="JJ/MM/AAAA" required className="adm-date-input" /></label>
          <label>Phrase<textarea name="sentence" required maxLength={500} rows={3} /></label>
          <label>Miniature<input name="thumbnail" required maxLength={2048} placeholder="/images/miniature.jpg ou https://..." /></label>
          <label>Lien dans BUILD<input name="internalUrl" maxLength={2048} placeholder="/blocs/3" /></label>
          <label>Bloc lié<input name="blocLabel" maxLength={120} placeholder="Facultatif" /></label>
          <button type="submit" disabled={busy} className="adm-primary-button">{busy ? "Ajout en cours" : "Ajouter"}</button>
        </form>
      </section>

      <section aria-labelledby="build-news-list-title" className="admin-news-list">
        <div className="admin-news-list-head">
          <div><h3 id="build-news-list-title">Sur BUILD</h3><p>{news.length ? `${news.length} entrée${news.length > 1 ? "s" : ""}` : "Aucune entrée"}</p></div>
          <button type="button" onClick={() => void load()} className="adm-ghost-button"><RefreshCw size={16} />Actualiser</button>
        </div>
        {news.length === 0 ? (
          <p className="admin-news-empty"><b>Rien ici pour l'instant.</b> Publie une nouveauté pour la rendre visible.</p>
        ) : (
          <ul className="admin-news-grid">
            {news.map((entry) => (
              <li key={entry.id} className="admin-news-tile">
                <span className="admin-news-thumb"><img src={entry.thumbnail} alt="" /></span>
                <span className="admin-news-tile-body">
                  <b>{entry.title}</b>
                  <span>{entry.bloc_label ?? "Sur BUILD"}</span>
                  <span>{entry.sentence}</span>
                  {entry.source_key ? <small>Automatique</small> : null}
                  <time dateTime={entry.published_at}>{displayDate(entry.published_at)}</time>
                </span>
                <details className="admin-news-actions">
                  <summary aria-label={`Actions pour ${entry.title}`}>•••</summary>
                  <span>
                    <button type="button" disabled={busy} onClick={() => { setEditing(entry); void playAppSound("open"); }}>Modifier</button>
                    <button type="button" disabled={busy} onClick={() => { setConfirmDelete(entry); void playAppSound("open"); }}>Supprimer</button>
                  </span>
                </details>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing && (
        <div className="fixed inset-0 z-[100] grid place-items-end bg-black/70 sm:place-items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}>
          <form onSubmit={saveEdit} role="dialog" aria-modal="true" aria-labelledby="edit-news-title" className="grid w-full gap-4 rounded-t-3xl border border-white/10 bg-[#151719] p-5 sm:max-w-lg sm:rounded-3xl sm:p-7">
            <h3 id="edit-news-title" className="text-xl font-semibold">Modifier cette nouveauté</h3>
            <label className="text-sm text-white/65">Titre<input name="title" required maxLength={160} defaultValue={editing.title} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label>
            <label className="text-sm text-white/65">Phrase<textarea name="sentence" required maxLength={500} rows={3} defaultValue={editing.sentence} className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-white" /></label>
            <label className="text-sm text-white/65">Bloc<input name="blocLabel" maxLength={120} defaultValue={editing.bloc_label ?? ""} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label>
            <label className="text-sm text-white/65">Lien dans BUILD<input name="internalUrl" maxLength={2048} defaultValue={editing.internal_url ?? ""} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label>
            <div className="flex justify-end gap-3"><button type="button" onClick={() => setEditing(null)} className="adm-ghost-button">Annuler</button><button type="submit" disabled={busy} className="adm-ghost-button">Enregistrer</button></div>
          </form>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] grid place-items-end bg-black/70 sm:place-items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmDelete(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="delete-news-title" className="w-full rounded-t-3xl border border-white/10 bg-[#151719] p-5 sm:max-w-lg sm:rounded-3xl sm:p-7">
            <h3 id="delete-news-title" className="text-xl font-semibold">Supprimer cette nouveauté ?</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">Elle disparaîtra de Nouveautés.</p>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setConfirmDelete(null)} className="adm-ghost-button">Annuler</button><button type="button" disabled={busy} onClick={() => void remove()} className="adm-danger-button">Supprimer</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
