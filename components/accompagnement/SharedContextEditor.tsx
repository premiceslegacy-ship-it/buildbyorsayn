"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveTrainerWorkspaceContext } from "@/app/actions/accompaniment";
import type { AccompanimentWorkspaceContext } from "@/lib/accompanimentTypes";

type Props = {
  assignmentId: string;
  context: AccompanimentWorkspaceContext | null;
};

export function SharedContextEditor({ assignmentId, context }: Props) {
  const router = useRouter();
  const [company, setCompany] = useState(context?.company ?? "");
  const [project, setProject] = useState(context?.project ?? "");
  const [siteUrl, setSiteUrl] = useState(context?.siteUrl ?? "");
  const [sharedNotes, setSharedNotes] = useState(context?.sharedNotes ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    setCompany(context?.company ?? "");
    setProject(context?.project ?? "");
    setSiteUrl(context?.siteUrl ?? "");
    setSharedNotes(context?.sharedNotes ?? "");
    setFeedback(null);
  }, [assignmentId, context]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setFeedback(null);
    const result = await saveTrainerWorkspaceContext(null, new FormData(event.currentTarget));
    setFeedback(result);
    setIsSaving(false);
    if (result.ok) router.refresh();
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="mt-7 border-t border-[var(--trait)] pt-6">
      <input type="hidden" name="assignment_id" value={assignmentId} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--t3)]">Contexte partagé</p>
          <h4 className="mt-2 text-lg font-medium text-[var(--encre)]">Informations visibles des deux côtés</h4>
        </div>
        {context?.updatedAt ? (
          <p className="text-xs text-[var(--t3)]">
            Mis à jour le {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(context.updatedAt))}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-[var(--t2)]">
          Activité ou entreprise
          <input
            name="company"
            value={company}
            maxLength={200}
            onChange={(event) => setCompany(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-[var(--r-s)] border border-[var(--trait-f)] bg-[var(--nuit)] px-3 py-3 text-[var(--encre)] outline-none transition hover:border-[rgba(241,245,242,.4)]"
          />
        </label>
        <label className="text-sm text-[var(--t2)]">
          Projet actuel
          <input
            name="project"
            value={project}
            maxLength={500}
            onChange={(event) => setProject(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-[var(--r-s)] border border-[var(--trait-f)] bg-[var(--nuit)] px-3 py-3 text-[var(--encre)] outline-none transition hover:border-[rgba(241,245,242,.4)]"
          />
        </label>
        <label className="text-sm text-[var(--t2)] sm:col-span-2">
          URL principale
          <input
            type="url"
            name="site_url"
            value={siteUrl}
            maxLength={500}
            placeholder="https://"
            onChange={(event) => setSiteUrl(event.target.value)}
            className="mt-2 min-h-12 w-full rounded-[var(--r-s)] border border-[var(--trait-f)] bg-[var(--nuit)] px-3 py-3 text-[var(--encre)] outline-none transition hover:border-[rgba(241,245,242,.4)]"
          />
        </label>
        <label className="text-sm text-[var(--t2)] sm:col-span-2">
          Notes partagées
          <textarea
            name="shared_notes"
            value={sharedNotes}
            maxLength={4000}
            rows={4}
            onChange={(event) => setSharedNotes(event.target.value)}
            className="mt-2 w-full resize-y rounded-[var(--r-s)] border border-[var(--trait-f)] bg-[var(--nuit)] px-3 py-3 text-[var(--encre)] outline-none transition hover:border-[rgba(241,245,242,.4)]"
            placeholder="Décision, blocage, apprentissage ou prochaine étape."
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="btn btn--g disabled:cursor-wait disabled:opacity-60"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer le contexte"}
        </button>
        {feedback?.message ? (
          <p className={`ui3-notice text-sm ${feedback.ok ? "ui3-notice-success" : "ui3-notice-error"}`} role="status">
            {feedback.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
