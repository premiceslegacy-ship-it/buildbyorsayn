"use client";

import { useMemo, useState } from "react";
import { AssignmentEditor } from "@/components/accompagnement/AssignmentEditor";
import { SharedContextEditor } from "@/components/accompagnement/SharedContextEditor";
import type {
  AccompanimentAssignment,
  AccompanimentPerson,
  AccompanimentWorkspaceContext,
} from "@/lib/accompanimentTypes";
import { THEMES } from "@/lib/siteWebAccompagnement";

export type TrainerThemeProgress = {
  id: string;
  marker: string;
  title: string;
  understood: boolean;
};

export type TrainerClient = {
  id: string;
  email: string;
  displayName: string | null;
  assignment: AccompanimentAssignment;
  themes: TrainerThemeProgress[];
  completedCount: number;
  statusLabel: string;
  lastActivity: string | null;
  activityCount: number;
  workspaceContext: AccompanimentWorkspaceContext | null;
};

type Props = {
  clients: TrainerClient[];
  people: AccompanimentPerson[];
  dataWarning?: string | null;
};

const STATUS_FILTERS = [
  "Tous",
  "À démarrer",
  "En cours",
  "À relancer",
  "À valider",
  "Planifié",
  "Validé",
  "Accès retiré",
] as const;

function formatDate(value: string | null) {
  if (!value) return "Aucune activité";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(value));
}

function statusClass(status: string) {
  if (status === "Validé") return "border-[#5e8069] text-[#c5e0ca]";
  if (status === "À valider") return "border-[#c9b48a] text-[#e8d5b0]";
  if (status === "Accès retiré") return "border-[#814d4d] text-[#e3b2b2]";
  return "border-[#4b4b50] text-[#c8c3ba]";
}

export function TrainerWorkspace({ clients, people, dataWarning = null }: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("Tous");
  const [selectedId, setSelectedId] = useState(clients[0]?.id ?? "");

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesQuery = !normalizedQuery || [client.email, client.displayName ?? "", client.assignment.track]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesStatus = statusFilter === "Tous" || client.statusLabel === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [clients, query, statusFilter]);

  const selectedClient = filteredClients.find((client) => client.id === selectedId) ?? filteredClients[0];
  const activeCount = clients.filter((client) => client.assignment.status === "active").length;
  const waitingCount = clients.filter((client) => client.assignment.status === "planned").length;
  const toValidateCount = clients.filter((client) => client.statusLabel === "À valider").length;
  const completedCount = clients.filter((client) => client.assignment.status === "completed").length;

  return (
    <main className="min-h-screen bg-[#0e0e0f] px-5 py-8 text-[#f0ede8] sm:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-[#29292c] pb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#c9b48a]">BUILD · formateur</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-medium tracking-[-0.04em] sm:text-6xl">Piloter les accompagnements.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#bdb9b0]">
              Inscris les bonnes personnes, choisis ce qu'elles doivent apprendre, ouvre l'accès au bon moment et valide ce qui est réellement acquis.
            </p>
          </div>
          <a className="border border-[#3a3a3e] px-4 py-3 text-sm text-[#d8d3c8] transition hover:border-[#c9b48a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]" href="/admin">
            Retour à l'administration
          </a>
        </header>

        {dataWarning ? (
          <p className="mt-6 border-l-2 border-[#d68c8c] pl-3 text-sm leading-6 text-[#f0baba]" role="alert">{dataWarning}</p>
        ) : null}

        <section className="mt-8 grid gap-px border border-[#3a3a3e] bg-[#3a3a3e] sm:grid-cols-2 lg:grid-cols-4" aria-label="Résumé des accompagnements">
          {[
            ["Personnes inscrites", String(clients.length)],
            ["Accès ouverts", String(activeCount)],
            ["À valider", String(toValidateCount)],
            ["Formés", String(completedCount)],
          ].map(([label, value]) => (
            <div key={label} className="bg-[#161618] p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[#8f8b84]">{label}</p>
              <p className="mt-3 text-3xl font-medium text-[#f0ede8]">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 border border-[#3a362d] bg-[#161618] p-5 sm:p-7" aria-labelledby="assignment-title">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#29292c] pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#c9b48a]">Accès et programme</p>
              <h2 id="assignment-title" className="mt-2 text-2xl font-medium">{selectedClient ? "Modifier un accompagnement" : "Associer un accompagnement"}</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#8f8b84]">Un compte ne voit l'espace membre que lorsque son statut est en cours ou formé et que la période est active.</p>
          </div>
          <div className="mt-6">
            <AssignmentEditor
              people={people}
              themes={THEMES}
              userId={selectedClient?.id ?? ""}
              assignment={selectedClient?.assignment ?? null}
            />
          </div>
        </section>

        <section className="mt-8" aria-labelledby="clients-title">
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-[#29292c] pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#c9b48a]">Suivi réel</p>
              <h2 id="clients-title" className="mt-2 text-2xl font-medium">Personnes inscrites</h2>
            </div>
            <div className="flex w-full flex-wrap gap-2 sm:w-auto">
              <label className="sr-only" htmlFor="trainer-search">Rechercher une personne</label>
              <input
                id="trainer-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher"
                className="min-w-[190px] border border-[#3a3a3e] bg-[#161618] px-3 py-2 text-sm text-[#f0ede8] outline-none focus:border-[#c9b48a]"
              />
              <label className="sr-only" htmlFor="trainer-status">Filtrer par statut</label>
              <select
                id="trainer-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as (typeof STATUS_FILTERS)[number])}
                className="border border-[#3a3a3e] bg-[#161618] px-3 py-2 text-sm text-[#f0ede8] outline-none focus:border-[#c9b48a]"
              >
                {STATUS_FILTERS.map((status) => <option key={status}>{status}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="min-w-0 border border-[#29292c] bg-[#161618]">
              {filteredClients.length ? filteredClients.map((client) => {
                const isSelected = selectedClient?.id === client.id;
                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => setSelectedId(client.id)}
                    className={`flex w-full items-start justify-between gap-4 border-b border-[#29292c] p-4 text-left transition last:border-b-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] ${isSelected ? "bg-[#211f1b]" : "hover:bg-[#1c1c1f]"}`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-[#f0ede8]">{client.displayName || "Membre sans nom affiché"}</span>
                      <span className="mt-1 block truncate text-xs text-[#8f8b84]">{client.email}</span>
                    </span>
                    <span className={`shrink-0 border px-2 py-1 text-[11px] ${statusClass(client.statusLabel)}`}>{client.statusLabel}</span>
                  </button>
                );
              }) : (
                <p className="p-5 text-sm leading-6 text-[#8f8b84]">Aucune personne ne correspond à ce filtre. Les comptes non inscrits se choisissent dans le formulaire ci-dessus.</p>
              )}
            </div>

            {selectedClient ? (
              <article className="min-w-0 border border-[#29292c] bg-[#161618] p-5 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#29292c] pb-5">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#8f8b84]">{selectedClient.email}</p>
                    <h3 className="mt-2 truncate text-2xl font-medium">{selectedClient.displayName || "Membre sans nom affiché"}</h3>
                  </div>
                  <span className={`border px-2 py-1 text-xs ${statusClass(selectedClient.statusLabel)}`}>{selectedClient.statusLabel}</span>
                </div>
                <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
                  <p><span className="block text-xs uppercase tracking-[0.12em] text-[#8f8b84]">Période</span><span className="mt-2 block text-[#d8d3c8]">{formatDate(selectedClient.assignment.startsOn)}{selectedClient.assignment.endsOn ? ` → ${formatDate(selectedClient.assignment.endsOn)}` : " → sans date de fin"}</span></p>
                  <p><span className="block text-xs uppercase tracking-[0.12em] text-[#8f8b84]">Progression</span><span className="mt-2 block text-[#d8d3c8]">{selectedClient.completedCount}/{selectedClient.themes.length} thèmes compris</span></p>
                  <p><span className="block text-xs uppercase tracking-[0.12em] text-[#8f8b84]">Dernière activité</span><span className="mt-2 block text-[#d8d3c8]">{formatDate(selectedClient.lastActivity)}</span></p>
                </div>
                <SharedContextEditor
                  assignmentId={selectedClient.assignment.id}
                  context={selectedClient.workspaceContext}
                />
                <div className="mt-7">
                  <div className="flex items-center justify-between gap-4 border-b border-[#29292c] pb-3">
                    <h4 className="text-sm font-medium text-[#f0ede8]">Thèmes assignés</h4>
                    <span className="text-xs text-[#8f8b84]">{selectedClient.activityCount} activité{selectedClient.activityCount > 1 ? "s" : ""}</span>
                  </div>
                  <div className="mt-2 divide-y divide-[#29292c]">
                    {selectedClient.themes.map((theme) => (
                      <div key={theme.id} className="flex items-center gap-3 py-3 text-sm">
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center border text-xs ${theme.understood ? "border-[#5e8069] text-[#c5e0ca]" : "border-[#3a3a3e] text-[#8f8b84]"}`}>{theme.understood ? "✓" : ""}</span>
                        <span className="min-w-0 flex-1 text-[#d8d3c8]">{theme.title}</span>
                        <span className="text-xs text-[#8f8b84]">{theme.understood ? "Compris" : "À voir"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ) : (
              <article className="border border-[#29292c] bg-[#161618] p-7 text-sm leading-6 text-[#8f8b84]">
                Associe une première personne pour commencer le suivi.
              </article>
            )}
          </div>
        </section>

        {waitingCount ? <p className="mt-6 text-xs text-[#8f8b84]">{waitingCount} accompagnement{waitingCount > 1 ? "s sont" : " est"} prévu{waitingCount > 1 ? "s" : ""} mais pas encore ouvert{waitingCount > 1 ? "s" : ""}.</p> : null}
      </div>
    </main>
  );
}
