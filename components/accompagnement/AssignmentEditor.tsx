"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  revokeAccompanimentAssignment,
  saveAccompanimentAssignment,
} from "@/app/actions/accompaniment";
import type {
  AccompanimentAssignment,
  AccompanimentAssignmentStatus,
  AccompanimentPerson,
} from "@/lib/accompanimentTypes";
import {
  THEMES,
  TRACKS,
  type AccompanimentTheme,
  type AccompanimentTrack,
} from "@/lib/siteWebAccompagnement";

type Props = {
  people: AccompanimentPerson[];
  themes?: AccompanimentTheme[];
  userId?: string;
  assignment?: AccompanimentAssignment | null;
  compact?: boolean;
};

const DEFAULT_TRACK: AccompanimentTrack = "debutant";
const DEFAULT_STATUS: AccompanimentAssignmentStatus = "planned";

function personLabel(person: AccompanimentPerson) {
  return person.displayName ? `${person.displayName} · ${person.email}` : person.email;
}

export function AssignmentEditor({
  people,
  themes = THEMES,
  userId = "",
  assignment = null,
  compact = false,
}: Props) {
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState(userId);
  const [track, setTrack] = useState<AccompanimentTrack>(assignment?.track ?? DEFAULT_TRACK);
  const [status, setStatus] = useState<AccompanimentAssignmentStatus>(assignment?.status ?? DEFAULT_STATUS);
  const [startsOn, setStartsOn] = useState(assignment?.startsOn ?? new Date().toISOString().slice(0, 10));
  const [endsOn, setEndsOn] = useState(assignment?.endsOn ?? "");
  const [themeIds, setThemeIds] = useState<string[]>(assignment?.themeIds ?? themes.map((theme) => theme.id));
  const [notes, setNotes] = useState(assignment?.notes ?? "");
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedUserId(userId);
    setTrack(assignment?.track ?? DEFAULT_TRACK);
    setStatus(assignment?.status ?? DEFAULT_STATUS);
    setStartsOn(assignment?.startsOn ?? new Date().toISOString().slice(0, 10));
    setEndsOn(assignment?.endsOn ?? "");
    setThemeIds(assignment?.themeIds ?? themes.map((theme) => theme.id));
    setNotes(assignment?.notes ?? "");
    setFeedback(null);
  }, [assignment, themes, userId]);

  function toggleTheme(themeId: string) {
    setThemeIds((current) =>
      current.includes(themeId) ? current.filter((id) => id !== themeId) : [...current, themeId]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedUserId) {
      setFeedback({ ok: false, message: "Choisis une personne avant d'enregistrer." });
      return;
    }
    if (!themeIds.length) {
      setFeedback({ ok: false, message: "Sélectionne au moins un thème à travailler." });
      return;
    }

    setIsSaving(true);
    setFeedback(null);
    const formData = new FormData(event.currentTarget);
    const result = await saveAccompanimentAssignment(null, formData);
    setFeedback(result);
    setIsSaving(false);
    if (result.ok) router.refresh();
  }

  async function handleRevoke(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!window.confirm("Retirer l'accès à cet accompagnement ?")) return;
    setIsSaving(true);
    setFeedback(null);
    const result = await revokeAccompanimentAssignment(null, new FormData(event.currentTarget));
    setFeedback(result);
    setIsSaving(false);
    if (result.ok) router.refresh();
  }

  return (
    <div className={compact ? "flex flex-col gap-5" : "flex flex-col gap-7"}>
      <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-6">
        <input type="hidden" name="user_id" value={selectedUserId} />
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm text-[var(--t2)] sm:col-span-2">
            Personne accompagnée
            <select
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-[var(--r-s)] border border-[var(--trait-f)] bg-[var(--carte-2)] px-3 py-3 text-[var(--encre)] outline-none transition hover:border-[rgba(241,245,242,.4)]"
              required
            >
              <option value="">Choisir une personne</option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {personLabel(person)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-[var(--t2)]">
            Accompagnement
            <input
              value="Création de sites web avec l'IA"
              readOnly
              className="mt-2 min-h-12 w-full rounded-[var(--r-s)] border border-[var(--trait)] bg-[var(--carte)] px-3 py-3 text-[var(--t3)] outline-none"
            />
          </label>
          <label className="text-sm text-[var(--t2)]">
            Parcours
            <select
              name="track"
              value={track}
              onChange={(event) => setTrack(event.target.value as AccompanimentTrack)}
              className="mt-2 min-h-12 w-full rounded-[var(--r-s)] border border-[var(--trait-f)] bg-[var(--carte-2)] px-3 py-3 text-[var(--encre)] outline-none transition hover:border-[rgba(241,245,242,.4)]"
            >
              {TRACKS.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-[var(--t2)]">
            Statut
            <select
              name="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as AccompanimentAssignmentStatus)}
              className="mt-2 min-h-12 w-full rounded-[var(--r-s)] border border-[var(--trait-f)] bg-[var(--carte-2)] px-3 py-3 text-[var(--encre)] outline-none transition hover:border-[rgba(241,245,242,.4)]"
            >
              <option value="planned">Prévu, accès fermé</option>
              <option value="active">En cours, accès ouvert</option>
              <option value="completed">Formé, accès conservé</option>
              <option value="revoked">Accès retiré</option>
            </select>
          </label>
          <label className="text-sm text-[var(--t2)]">
            Du
            <input
              type="date"
              name="starts_on"
              value={startsOn}
              onChange={(event) => setStartsOn(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-[var(--r-s)] border border-[var(--trait-f)] bg-[var(--carte-2)] px-3 py-3 text-[var(--encre)] outline-none transition hover:border-[rgba(241,245,242,.4)]"
              required
            />
          </label>
          <label className="text-sm text-[var(--t2)]">
            Au, facultatif
            <input
              type="date"
              name="ends_on"
              value={endsOn}
              onChange={(event) => setEndsOn(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-[var(--r-s)] border border-[var(--trait-f)] bg-[var(--carte-2)] px-3 py-3 text-[var(--encre)] outline-none transition hover:border-[rgba(241,245,242,.4)]"
            />
          </label>
        </div>

        <fieldset>
          <legend className="text-sm text-[var(--encre)]">Thèmes à couvrir</legend>
          <p className="mt-1 text-xs leading-5 text-[var(--t3)]">Ce sont les seuls thèmes visibles dans l'espace membre.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {themes.map((theme) => {
              const checked = themeIds.includes(theme.id);
              return (
                <label key={theme.id} className={`flex cursor-pointer items-start gap-3 rounded-[var(--r-s)] border px-3 py-3 text-sm transition ${checked ? "border-[var(--em)] bg-[rgba(34,217,110,.1)] text-[var(--encre)]" : "border-[var(--trait)] text-[var(--t2)] hover:border-[var(--trait-f)]"}`}>
                  <input
                    type="checkbox"
                    name="theme_id"
                    value={theme.id}
                    checked={checked}
                    onChange={() => toggleTheme(theme.id)}
                    className="mt-0.5 accent-[var(--em)]"
                  />
                  <span><span className="mr-2 text-[var(--menthe)]">{theme.marker}</span>{theme.title}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <label className="block text-sm text-[var(--t2)]">
          Note formateur
          <textarea
            name="notes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Objectif de l'accompagnement, point d'attention ou décision importante."
            className="mt-2 w-full resize-y rounded-[var(--r-s)] border border-[var(--trait-f)] bg-[var(--carte-2)] px-3 py-3 text-[var(--encre)] outline-none transition hover:border-[rgba(241,245,242,.4)]"
          />
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn--p disabled:cursor-wait disabled:opacity-60"
          >
            {isSaving ? "Enregistrement..." : "Enregistrer l'accompagnement"}
          </button>
          {assignment ? (
            <button
              type="button"
              onClick={() => {
                const form = document.getElementById(`revoke-${assignment.id}`) as HTMLFormElement | null;
                form?.requestSubmit();
              }}
              disabled={isSaving || assignment.status === "revoked"}
              className="ui3-text-link min-h-11 text-sm underline underline-offset-4 disabled:opacity-50"
            >
              Retirer l'accès
            </button>
          ) : null}
        </div>
        {feedback?.message ? (
          <p className={`ui3-notice text-sm ${feedback.ok ? "ui3-notice-success" : "ui3-notice-error"}`} role="status">
            {feedback.message}
          </p>
        ) : null}
      </form>

      {assignment ? (
        <form id={`revoke-${assignment.id}`} onSubmit={(event) => void handleRevoke(event)} className="hidden">
          <input type="hidden" name="user_id" value={selectedUserId} />
        </form>
      ) : null}
    </div>
  );
}
