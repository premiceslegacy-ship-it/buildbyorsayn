"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { animateAppElement } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import { createBuildNewsAction, deleteBuildNewsAction, loadBuildNewsAction, updateBuildNewsAction } from "./actions";
import type { BuildNewsRow } from "./types";

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

  return <div ref={root} className="grid gap-12 text-[#f0ede8]">
    {hasPendingNewsRequest}
    {error && <p className="rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-50" role="alert">{error}</p>}
    {youtubePanel}
    <section className="rounded-3xl bg-white/[.045] p-5 sm:p-6" aria-labelledby="build-news-form-title"><h3 id="build-news-form-title" className="text-xl font-semibold">Ajouter sur BUILD</h3><p className="mt-2 text-sm leading-6 text-white/55">Ajoute une entrée réelle liée à ce qui vient d'être publié dans la plateforme.</p><form onSubmit={create} className="mt-6 grid gap-5"><div className="grid gap-5 md:grid-cols-2"><label className="text-sm text-white/65">Titre<input name="title" required maxLength={160} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label><label className="text-sm text-white/65">Date<input name="date" type="text" inputMode="numeric" lang="fr" pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}" placeholder="JJ/MM/AAAA" required className="adm-date-input mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label></div><label className="text-sm text-white/65">Miniature<input name="thumbnail" required maxLength={2048} placeholder="/images/miniature.jpg ou https://..." className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label><div className="grid gap-5 md:grid-cols-2"><label className="text-sm text-white/65">Bloc lié, facultatif<input name="blocLabel" maxLength={120} placeholder="Bloc 3, La logique business" className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label><label className="text-sm text-white/65">Lien dans BUILD, facultatif<input name="internalUrl" maxLength={2048} placeholder="/blocs/3" className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label></div><label className="text-sm text-white/65">Phrase<textarea name="sentence" required maxLength={500} rows={4} className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 p-3 text-white" /></label><button type="submit" disabled={busy} className="adm-primary-button w-fit">{busy ? "Ajout en cours" : "Ajouter"}</button></form></section>
    <section aria-labelledby="build-news-list-title"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h3 id="build-news-list-title" className="text-xl font-semibold">Sur BUILD</h3><p className="mt-1 text-sm text-white/45">{news.length ? `${news.length} entrée${news.length > 1 ? "s" : ""}` : "Aucune entrée"}</p><p className="mt-2 max-w-2xl text-sm leading-6 text-white/55">Quand une vidéo ou une nouvelle version de skills est publiée, une Nouveauté apparaît ici toute seule, déjà visible des membres. Tu peux la modifier ou la retirer. Aucun e-mail n’est envoyé automatiquement.</p></div><button type="button" onClick={() => void load()} className="adm-ghost-button"><RefreshCw size={16} />Actualiser</button></div>{news.length === 0 ? <p className="rounded-2xl bg-white/[.04] p-5 text-sm leading-6 text-white/55"><b className="text-white">Rien ici pour l'instant.</b> Publie une vraie nouveauté pour qu'elle apparaisse aux membres.</p> : <ul className="divide-y divide-white/10 rounded-2xl bg-white/[.04] px-4">{news.map((entry) => <li key={entry.id} className="grid gap-4 py-4 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center"><span className="aspect-video overflow-hidden rounded-lg bg-black"><img src={entry.thumbnail} alt="" className="h-full w-full object-cover" /></span><span className="min-w-0"><b className="block text-sm font-medium text-white">{entry.title}</b><span className="mt-1 block text-xs text-white/45">{entry.bloc_label ?? "Sur BUILD"}</span><span className="mt-1 block text-sm leading-5 text-white/60">{entry.sentence}</span>{entry.source_key ? <span className="mt-2 inline-block rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/60">Créée automatiquement à la publication</span> : null}<time className="mt-2 block text-xs text-white/35" dateTime={entry.published_at}>{displayDate(entry.published_at)}</time></span><span className="flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={() => { setEditing(entry); void playAppSound("open"); }} className="adm-ghost-button">Modifier</button><button type="button" disabled={busy} onClick={() => { setConfirmDelete(entry); void playAppSound("open"); }} className="adm-danger-button"><Trash2 size={16} />Supprimer</button></span></li>)}</ul>}</section>
    {editing && <div className="fixed inset-0 z-[100] grid place-items-end bg-black/70 sm:place-items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}><form onSubmit={saveEdit} role="dialog" aria-modal="true" aria-labelledby="edit-news-title" className="grid w-full gap-4 rounded-t-3xl border border-white/10 bg-[#151719] p-5 sm:max-w-lg sm:rounded-3xl sm:p-7"><h3 id="edit-news-title" className="text-xl font-semibold">Modifier cette nouveauté</h3><label className="text-sm text-white/65">Titre<input name="title" required maxLength={160} defaultValue={editing.title} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label><label className="text-sm text-white/65">Phrase<textarea name="sentence" required maxLength={500} rows={3} defaultValue={editing.sentence} className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-white" /></label><label className="text-sm text-white/65">Bloc (facultatif)<input name="blocLabel" maxLength={120} defaultValue={editing.bloc_label ?? ""} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label><label className="text-sm text-white/65">Lien dans BUILD (facultatif)<input name="internalUrl" maxLength={2048} defaultValue={editing.internal_url ?? ""} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label><div className="flex justify-end gap-3"><button type="button" onClick={() => setEditing(null)} className="adm-ghost-button">Annuler</button><button type="submit" disabled={busy} className="adm-ghost-button">Enregistrer</button></div></form></div>}
    {confirmDelete && <div className="fixed inset-0 z-[100] grid place-items-end bg-black/70 sm:place-items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmDelete(null); }}><section role="dialog" aria-modal="true" aria-labelledby="delete-news-title" className="w-full rounded-t-3xl border border-white/10 bg-[#151719] p-5 sm:max-w-lg sm:rounded-3xl sm:p-7"><h3 id="delete-news-title" className="text-xl font-semibold">Supprimer cette nouveauté ?</h3><p className="mt-3 text-sm leading-6 text-white/65">Elle disparaîtra de Nouveautés. Cette action ne supprime ni la vidéo, ni le bloc lié.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setConfirmDelete(null)} className="adm-ghost-button">Annuler</button><button type="button" disabled={busy} onClick={() => void remove()} className="adm-danger-button">Supprimer</button></div></section></div>}
  </div>;
}
