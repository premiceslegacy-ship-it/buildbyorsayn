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
    <form onSubmit={(event) => void handleSubmit(event)} className="mt-7 border-t border-[#29292c] pt-6">
      <input type="hidden" name="assignment_id" value={assignmentId} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[#c9b48a]">Contexte partagé</p>
          <h4 className="mt-2 text-lg font-medium text-[#f0ede8]">Informations visibles des deux côtés</h4>
        </div>
        {context?.updatedAt ? (
          <p className="text-xs text-[#8f8b84]">
            Mis à jour le {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(context.updatedAt))}
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-[#bdb9b0]">
          Activité ou entreprise
          <input
            name="company"
            value={company}
            maxLength={200}
            onChange={(event) => setCompany(event.target.value)}
            className="mt-2 w-full border border-[#3a3a3e] bg-[#0e0e0f] px-3 py-3 text-[#f0ede8] outline-none focus:border-[#c9b48a]"
          />
        </label>
        <label className="text-sm text-[#bdb9b0]">
          Projet actuel
          <input
            name="project"
            value={project}
            maxLength={500}
            onChange={(event) => setProject(event.target.value)}
            className="mt-2 w-full border border-[#3a3a3e] bg-[#0e0e0f] px-3 py-3 text-[#f0ede8] outline-none focus:border-[#c9b48a]"
          />
        </label>
        <label className="text-sm text-[#bdb9b0] sm:col-span-2">
          URL principale
          <input
            type="url"
            name="site_url"
            value={siteUrl}
            maxLength={500}
            placeholder="https://"
            onChange={(event) => setSiteUrl(event.target.value)}
            className="mt-2 w-full border border-[#3a3a3e] bg-[#0e0e0f] px-3 py-3 text-[#f0ede8] outline-none focus:border-[#c9b48a]"
          />
        </label>
        <label className="text-sm text-[#bdb9b0] sm:col-span-2">
          Notes partagées
          <textarea
            name="shared_notes"
            value={sharedNotes}
            maxLength={4000}
            rows={4}
            onChange={(event) => setSharedNotes(event.target.value)}
            className="mt-2 w-full resize-y border border-[#3a3a3e] bg-[#0e0e0f] px-3 py-3 text-[#f0ede8] outline-none focus:border-[#c9b48a]"
            placeholder="Décision, blocage, apprentissage ou prochaine étape."
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="border border-[#c9b48a] bg-[#e8d5b0] px-4 py-3 text-sm text-[#171719] transition hover:bg-[#f0ede8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] disabled:cursor-wait disabled:opacity-60"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer le contexte"}
        </button>
        {feedback?.message ? (
          <p className={`text-sm ${feedback.ok ? "text-[#c9b48a]" : "text-[#f0a9a9]"}`} role="status">
            {feedback.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
