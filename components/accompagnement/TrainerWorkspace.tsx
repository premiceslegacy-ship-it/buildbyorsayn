"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, Mail, Save, Search, UserRound } from "lucide-react";

export type TrainerThemeStat = {
  id: string;
  marker: string;
  title: string;
  done: number;
  total: number;
};

export type TrainerClient = {
  id: string;
  email: string;
  tier: string | null;
  hasStarted: boolean;
  progress: number;
  completed: number;
  total: number;
  currentTheme: string;
  currentThemeId: string | null;
  currentPath: string | null;
  lastActivity: string | null;
  lastEvent: string | null;
  status: "À démarrer" | "En cours" | "À relancer" | "Terminé";
  themes: TrainerThemeStat[];
};

const NOTE_KEY = "build_accompagnement_trainer_notes_v1";

type Filter = "tous" | TrainerClient["status"];

function formatDate(value: string | null) {
  if (!value) return "Aucune activité";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date indisponible";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function statusClass(status: TrainerClient["status"]) {
  if (status === "Terminé") return "text-[#8ed39f]";
  if (status === "À relancer") return "text-[#e8d5b0]";
  if (status === "En cours") return "text-[#d6d0c5]";
  return "text-[#8f887d]";
}

function tierLabel(tier: string | null) {
  if (tier === "full") return "Parcours complet";
  if (tier === "beginner") return "Fondations";
  return "Accès libre";
}

export function TrainerWorkspace({
  clients,
  dataWarning,
}: {
  clients: TrainerClient[];
  dataWarning?: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("tous");
  const [selectedId, setSelectedId] = useState(clients[0]?.id ?? "");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [noteMessage, setNoteMessage] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(NOTE_KEY);
      if (raw) setNotes(JSON.parse(raw) as Record<string, string>);
    } catch {
      setNotes({});
    }
  }, []);

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return clients.filter((client) => {
      const matchesFilter = filter === "tous" || client.status === filter;
      const matchesQuery =
        !normalizedQuery ||
        client.email.toLowerCase().includes(normalizedQuery) ||
        client.currentTheme.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [clients, filter, query]);

  useEffect(() => {
    if (!filteredClients.some((client) => client.id === selectedId)) {
      setSelectedId(filteredClients[0]?.id ?? "");
    }
  }, [filteredClients, selectedId]);

  const selectedClient = clients.find((client) => client.id === selectedId) ?? filteredClients[0];
  const counts = {
    total: clients.length,
    active: clients.filter((client) => client.status === "En cours").length,
    toRelance: clients.filter((client) => client.status === "À relancer").length,
    done: clients.filter((client) => client.status === "Terminé").length,
  };

  const saveNote = () => {
    if (!selectedClient) return;
    const nextNotes = { ...notes, [selectedClient.id]: notes[selectedClient.id] ?? "" };
    window.localStorage.setItem(NOTE_KEY, JSON.stringify(nextNotes));
    setNotes(nextNotes);
    setNoteMessage("Note enregistrée dans ce navigateur.");
    window.setTimeout(() => setNoteMessage(""), 2500);
  };

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8]">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5 px-5 py-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4">
            <Link href="/accompagnement" aria-label="Retour aux accompagnements">
              <span className="sr-only">Retour aux accompagnements</span>
              <span className="text-sm text-[#aaa59c] transition-colors hover:text-[#f0ede8]">BUILD</span>
            </Link>
            <span className="text-[#5f5a52]">/</span>
            <span className="text-sm font-medium text-[#f0ede8]">Vue formateur</span>
          </div>
          <Link
            href="/accompagnement/site-web"
            className="inline-flex min-h-11 items-center border border-white/[0.14] px-4 text-sm font-semibold text-[#aaa59c] transition-colors hover:border-white/35 hover:text-[#f0ede8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
          >
            Voir l'offre
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e8d5b0]">
            Pilotage de l'accompagnement
          </p>
          <h1 className="mt-5 text-balance text-4xl font-medium leading-[0.98] tracking-[-0.05em] text-[#f0ede8] sm:text-6xl">
            Savoir qui aider ensuite.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[#aaa59c]">
            Une vue de travail pour repérer les personnes actives, le sujet en cours et le prochain échange utile.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 divide-x divide-white/[0.1] border-y border-white/[0.1] sm:grid-cols-4">
          {[
            ["Formés", counts.total],
            ["En cours", counts.active],
            ["À relancer", counts.toRelance],
            ["Terminés", counts.done],
          ].map(([label, value]) => (
            <div key={label} className="px-4 py-5 first:pl-0 sm:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777169]">{label}</p>
              <p className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#e8d5b0]">{value}</p>
            </div>
          ))}
        </div>

        {dataWarning && (
          <div className="mt-8 border border-[#e8d5b0]/30 bg-[#e8d5b0]/[0.06] px-4 py-3 text-sm leading-6 text-[#e8d5b0]" role="status">
            {dataWarning}
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
          <section aria-labelledby="clients-title">
            <div className="flex flex-col gap-4 border-b border-white/[0.1] pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="clients-title" className="text-xl font-semibold text-[#f0ede8]">Les accompagnements</h2>
                <p className="mt-1 text-sm text-[#777169]">{filteredClients.length} résultat{filteredClients.length !== 1 ? "s" : ""}</p>
              </div>
              <label className="relative block sm:w-64">
                <span className="sr-only">Rechercher une personne ou un thème</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777169]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Rechercher"
                  className="h-11 w-full border border-white/[0.12] bg-black/20 pl-9 pr-3 text-sm text-[#f0ede8] outline-none transition-colors placeholder:text-[#777169] focus:border-[#e8d5b0]/60 focus:ring-2 focus:ring-[#e8d5b0]/30"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-2" aria-label="Filtrer les accompagnements">
              {(["tous", "En cours", "À relancer", "Terminé"] as Filter[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`min-h-10 border px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] ${filter === option ? "border-[#e8d5b0] bg-[#e8d5b0] text-[#0e0e0f]" : "border-white/[0.14] text-[#aaa59c] hover:border-white/35 hover:text-[#f0ede8]"}`}
                >
                  {option === "tous" ? "Tous" : option}
                </button>
              ))}
            </div>

            {filteredClients.length === 0 ? (
              <div className="mt-8 border-y border-white/[0.1] px-1 py-10">
                <p className="text-lg font-medium text-[#f0ede8]">Aucun accompagnement ici.</p>
                <p className="mt-2 max-w-md text-sm leading-7 text-[#8f887d]">
                  Modifie la recherche ou le filtre. Les personnes apparaissent après avoir ouvert l'espace Site Web ou enregistré une tâche.
                </p>
              </div>
            ) : (
              <div className="mt-8 divide-y divide-white/[0.1] border-y border-white/[0.1]">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(client.id);
                      setNoteMessage("");
                    }}
                    className={`grid min-h-11 w-full gap-4 px-1 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] focus-visible:ring-inset sm:grid-cols-[minmax(0,1fr)_120px_90px] sm:items-center sm:px-3 ${selectedClient?.id === client.id ? "bg-white/[0.05]" : "hover:bg-white/[0.025]"}`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#f0ede8]">{client.email}</span>
                      <span className="mt-1 block truncate text-xs text-[#777169]">{tierLabel(client.tier)} · {client.currentTheme}</span>
                    </span>
                    <span className="flex items-center gap-3 sm:block">
                      <span className="block text-sm text-[#e8d5b0]">{client.progress}%</span>
                      <span className="mt-1 block text-xs text-[#777169]">{client.completed}/{client.total} tâches</span>
                    </span>
                    <span className={`text-xs font-semibold sm:text-right ${statusClass(client.status)}`}>{client.status}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {selectedClient ? (
            <aside className="border border-white/[0.12] bg-[#161618] p-5 sm:p-7" aria-labelledby="client-detail-title">
              <div className="flex flex-col gap-5 border-b border-white/[0.1] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f887d]">Personne sélectionnée</p>
                  <h2 id="client-detail-title" className="mt-3 break-words text-xl font-semibold text-[#f0ede8]">{selectedClient.email}</h2>
                  <p className={`mt-2 text-sm font-semibold ${statusClass(selectedClient.status)}`}>{selectedClient.status}</p>
                </div>
                <a
                  href={`mailto:${selectedClient.email}`}
                  className="inline-flex min-h-11 flex-none items-center justify-center gap-2 border border-white/[0.14] px-4 text-sm font-semibold text-[#aaa59c] transition-colors hover:border-white/35 hover:text-[#f0ede8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
                >
                  <Mail className="h-4 w-4" />
                  Écrire
                </a>
              </div>

              <div className="grid gap-5 border-b border-white/[0.1] py-6 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777169]">Sujet actuel</p>
                  <p className="mt-2 text-sm leading-6 text-[#f0ede8]">{selectedClient.currentTheme}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777169]">Parcours</p>
                  <p className="mt-2 text-sm leading-6 text-[#c4bfb5]">{tierLabel(selectedClient.tier)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777169]">Dernière activité</p>
                  <p className="mt-2 text-sm leading-6 text-[#c4bfb5]">{formatDate(selectedClient.lastActivity)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777169]">Emplacement</p>
                  <p className="mt-2 break-words text-sm leading-6 text-[#c4bfb5]">{selectedClient.currentPath ?? "Non renseigné"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777169]">Dernier geste</p>
                  <p className="mt-2 break-words text-sm leading-6 text-[#c4bfb5]">{selectedClient.lastEvent ?? "Non renseigné"}</p>
                </div>
              </div>

              <div className="py-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777169]">Progression par thème</p>
                    <p className="mt-2 text-sm text-[#aaa59c]">{selectedClient.completed} tâches enregistrées</p>
                  </div>
                  <span className="text-2xl font-medium text-[#e8d5b0]">{selectedClient.progress}%</span>
                </div>
                <div className="mt-5 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                  {selectedClient.themes.map((theme) => (
                    <div key={theme.id} className="grid grid-cols-[34px_minmax(0,1fr)_55px] gap-3 py-4 text-sm">
                      <span className="text-xs tabular-nums text-[#e8d5b0]">{theme.marker}</span>
                      <span className="leading-6 text-[#c4bfb5]">{theme.title}</span>
                      <span className="text-right text-xs text-[#9c978e]">{theme.done}/{theme.total}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/[0.1] pt-6">
                <label htmlFor="trainer-note" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#777169]">
                  Note de séance
                </label>
                <textarea
                  id="trainer-note"
                  value={notes[selectedClient.id] ?? ""}
                  onChange={(event) => setNotes((current) => ({ ...current, [selectedClient.id]: event.target.value }))}
                  rows={5}
                  className="mt-3 w-full resize-y border border-white/[0.12] bg-black/20 px-4 py-3 text-sm leading-7 text-[#f0ede8] outline-none transition-colors placeholder:text-[#777169] focus:border-[#e8d5b0]/60 focus:ring-2 focus:ring-[#e8d5b0]/30"
                  placeholder="Décision prise, prochain geste, point à reprendre..."
                />
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-[#777169]">Cette note reste dans ce navigateur.</p>
                  <button
                    type="button"
                    onClick={saveNote}
                    className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#e8d5b0] px-4 text-sm font-semibold text-[#0e0e0f] transition-colors hover:bg-[#f0dfc0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
                  >
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </button>
                </div>
                {noteMessage && <p className="mt-3 text-xs text-[#8ed39f]" role="status">{noteMessage}</p>}
              </div>
            </aside>
          ) : (
            <aside className="flex min-h-80 items-center justify-center border border-white/[0.12] bg-[#161618] p-8 text-center">
              <div>
                <UserRound className="mx-auto h-6 w-6 text-[#777169]" />
                <p className="mt-4 text-sm font-semibold text-[#f0ede8]">Aucune personne sélectionnée</p>
                <p className="mt-2 text-sm text-[#777169]">La sélection apparaîtra ici.</p>
              </div>
            </aside>
          )}
        </div>

        <div className="mt-10 flex items-start gap-3 border-t border-white/[0.1] pt-6 text-xs leading-6 text-[#777169]">
          <Activity className="mt-0.5 h-4 w-4 flex-none" />
          <p>Cette vue utilise uniquement les activités et tâches effectivement enregistrées dans BUILD. Une absence de donnée n'est pas transformée en hypothèse.</p>
        </div>
      </div>
    </main>
  );
}
