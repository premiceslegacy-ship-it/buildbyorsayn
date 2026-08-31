"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { saveMemberWorkspaceContext } from "@/app/actions/accompaniment";
import { createClient } from "@/lib/supabase/client";
import type {
  AccompanimentAssignment,
  AccompanimentWorkspaceContext,
} from "@/lib/accompanimentTypes";
import {
  buildSiteWebFollowUpFilename,
  buildSiteWebFollowUpMarkdown,
  getThemeGuidance,
  isThemeUnderstood,
  themeCheckId,
  THEMES,
  TRACKS,
  type SiteWebFollowUpValues,
} from "@/lib/siteWebAccompagnement";

const MODULE_ID = "web-accompagnement";

const DEFAULT_FOLLOW_UP: SiteWebFollowUpValues = {
  baseline: "",
  day30: "Observe une première réaction réelle et note ce qui mérite d'être amélioré.",
  day60: "Compare les demandes, les objections et les assets qui sont réellement utilisés.",
  day90: "Garde ce qui fonctionne, transforme-le en méthode et prépare la prochaine offre.",
  metrics: "Demandes de sites, réponses, rendez-vous, ventes, délais et marge par projet.",
  observations: "",
};

type WorkspaceProfile = {
  name: string;
  company: string;
  project: string;
  siteUrl: string;
  track: AccompanimentAssignment["track"];
};

type Props = {
  memberName: string | null;
  assignment: AccompanimentAssignment;
  workspaceContext: AccompanimentWorkspaceContext | null;
};

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // The remote record remains authoritative when local storage is unavailable.
  }
}

function getTrackLabel(track: AccompanimentAssignment["track"]) {
  return TRACKS.find((item) => item.id === track)?.shortLabel ?? track;
}

function getThemeFromHash(themeIds: string[]) {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  return themeIds.includes(hash) ? hash : null;
}

export function SiteWebWorkspace({ memberName, assignment, workspaceContext }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const storageKeys = useMemo(
    () => ({
      profile: `build:site-web:${assignment.userId}:${assignment.id}:profile:v2`,
      progress: `build:site-web:${assignment.userId}:${assignment.id}:understood-themes:v2`,
      followUp: `build:site-web:${assignment.userId}:${assignment.id}:follow-up:v2`,
    }),
    [assignment.id, assignment.userId]
  );
  const assignedThemes = useMemo(
    () => assignment.themeIds.map((id) => THEMES.find((theme) => theme.id === id)).filter(Boolean),
    [assignment.themeIds]
  );
  const validThemeIds = useMemo(
    () => assignedThemes.map((theme) => theme!.id),
    [assignedThemes]
  );
  const initialThemeId = validThemeIds[0] ?? "";
  const [activeThemeId, setActiveThemeId] = useState(initialThemeId);
  const [understoodThemeIds, setUnderstoodThemeIds] = useState<string[]>([]);
  const [profile, setProfile] = useState<WorkspaceProfile>({
    name: memberName ?? "",
    company: workspaceContext?.company ?? "",
    project: workspaceContext?.project ?? "",
    siteUrl: workspaceContext?.siteUrl ?? "",
    track: assignment.track,
  });
  const [followUp, setFollowUp] = useState<SiteWebFollowUpValues>({
    ...DEFAULT_FOLLOW_UP,
    observations: workspaceContext?.sharedNotes ?? "",
  });
  const [userId, setUserId] = useState<string | null>(assignment.userId);
  const [pendingThemeIds, setPendingThemeIds] = useState<string[]>([]);
  const [syncMessage, setSyncMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [isSavingContext, setIsSavingContext] = useState(false);
  const [contextMessage, setContextMessage] = useState("");

  useEffect(() => {
    const savedProfile = readLocal<Partial<WorkspaceProfile>>(storageKeys.profile, {});
    const savedNotes = readLocal<Partial<SiteWebFollowUpValues>>(
      storageKeys.followUp,
      {}
    );
    const localThemeIds = readLocal<string[]>(storageKeys.progress, []);

    setProfile((current) => ({
      ...current,
      ...savedProfile,
      ...(workspaceContext
        ? {
            company: workspaceContext.company,
            project: workspaceContext.project,
            siteUrl: workspaceContext.siteUrl,
          }
        : {}),
      name: memberName ?? "",
      track: assignment.track,
    }));
    setFollowUp((current) => ({
      ...current,
      ...savedNotes,
      ...(workspaceContext ? { observations: workspaceContext.sharedNotes } : {}),
    }));
    setUnderstoodThemeIds([...new Set(localThemeIds)].filter((id) => validThemeIds.includes(id)));

    const hashThemeId = getThemeFromHash(validThemeIds);
    if (hashThemeId) setActiveThemeId(hashThemeId);
  }, [assignment.track, memberName, storageKeys, validThemeIds, workspaceContext]);

  useEffect(() => {
    let cancelled = false;

    async function loadRemoteProgress() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from("progress")
        .select("item_id")
        .eq("module_id", MODULE_ID)
        .like("item_id", "web-%");

      if (cancelled) return;
      if (error) {
        setSyncMessage("La progression locale est conservée. La synchronisation attend une nouvelle tentative.");
        return;
      }

      const remoteItems = new Set(
        (data ?? [])
          .map((item) => item.item_id)
          .filter((item): item is string => typeof item === "string")
      );
      const remoteThemeIds = validThemeIds.filter((themeId) =>
        isThemeUnderstood(themeId, assignment.track, remoteItems)
      );
      setUnderstoodThemeIds(remoteThemeIds);
    }

    void loadRemoteProgress();
    return () => {
      cancelled = true;
    };
  }, [assignment.track, supabase, validThemeIds]);

  useEffect(() => {
    writeLocal(storageKeys.profile, profile);
    writeLocal(storageKeys.progress, understoodThemeIds);
    writeLocal(storageKeys.followUp, followUp);
  }, [followUp, profile, storageKeys, understoodThemeIds]);

  const activeTheme = assignedThemes.find((theme) => theme?.id === activeThemeId) ?? assignedThemes[0];
  const activeThemeIndex = activeTheme ? assignedThemes.findIndex((theme) => theme?.id === activeTheme.id) : -1;
  const activeGuidance = activeTheme ? getThemeGuidance(activeTheme.id) : null;
  const completedCount = validThemeIds.filter((id) => understoodThemeIds.includes(id)).length;
  const progressPercent = validThemeIds.length
    ? Math.round((completedCount / validThemeIds.length) * 100)
    : 0;
  const nextTheme = activeTheme
    ? assignedThemes[activeThemeIndex + 1]
    : undefined;
  const assignmentLabel = assignment.status === "completed" ? "Accompagnement validé" : "Accompagnement en cours";

  async function persistTheme(themeId: string, completed: boolean) {
    if (!userId) return;
    setPendingThemeIds((current) => [...new Set([...current, themeId])]);
    setSyncMessage("");

    const itemId = themeCheckId(themeId);
    const result = completed
      ? await supabase.from("progress").upsert({
          user_id: userId,
          module_id: MODULE_ID,
          item_id: itemId,
        })
      : await supabase
          .from("progress")
          .delete()
          .eq("user_id", userId)
          .eq("module_id", MODULE_ID)
          .eq("item_id", itemId);

    if (result.error) {
      setUnderstoodThemeIds((current) =>
        completed
          ? current.filter((id) => id !== themeId)
          : [...new Set([...current, themeId])]
      );
      setSyncMessage("La modification n'a pas été enregistrée et a été annulée. Réessaie dans un instant.");
    }
    setPendingThemeIds((current) => current.filter((id) => id !== themeId));
  }

  function toggleTheme(themeId: string) {
    if (!validThemeIds.includes(themeId) || pendingThemeIds.includes(themeId)) return;
    const completed = !understoodThemeIds.includes(themeId);
    setUnderstoodThemeIds((current) =>
      completed ? [...new Set([...current, themeId])] : current.filter((id) => id !== themeId)
    );
    void persistTheme(themeId, completed);
  }

  function downloadGuide() {
    const markdown = buildSiteWebFollowUpMarkdown({
      profile,
      followUp,
      completed: understoodThemeIds.map(themeCheckId),
      themeIds: validThemeIds,
    });
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = buildSiteWebFollowUpFilename(profile);
    link.click();
    URL.revokeObjectURL(url);
  }

  async function saveSharedContext() {
    setIsSavingContext(true);
    setContextMessage("");
    const formData = new FormData();
    formData.set("assignment_id", assignment.id);
    formData.set("company", profile.company);
    formData.set("project", profile.project);
    formData.set("site_url", profile.siteUrl);
    formData.set("shared_notes", followUp.observations);
    const result = await saveMemberWorkspaceContext(null, formData);
    setContextMessage(result.message);
    setIsSavingContext(false);
  }

  async function resetProgress() {
    if (!window.confirm("Réinitialiser les thèmes compris sur cet appareil et dans ton espace ?")) return;
    setIsResetting(true);
    setSyncMessage("");
    if (userId) {
      const { error } = await supabase
        .from("progress")
        .delete()
        .eq("user_id", userId)
        .eq("module_id", MODULE_ID);
      if (error) {
        setSyncMessage("La réinitialisation distante a échoué. Rien n'a été supprimé localement.");
        setIsResetting(false);
        return;
      }
    }
    setUnderstoodThemeIds([]);
    writeLocal(storageKeys.progress, []);
    setIsResetting(false);
  }

  if (!activeTheme || !activeGuidance) {
    return (
      <main className="min-h-screen bg-[#0e0e0f] px-5 py-16 text-[#f0ede8] sm:px-8">
        <div className="mx-auto max-w-3xl border border-[#3b362b] bg-[#161618] p-8">
          <p className="text-xs uppercase tracking-[0.18em] text-[#c9b48a]">Accès membre</p>
          <h1 className="mt-4 text-3xl font-medium">Ton parcours doit encore être préparé.</h1>
          <p className="mt-4 max-w-xl text-[#bdb9b0]">
            Le formateur doit associer au moins un thème avant d'ouvrir cet espace.
          </p>
          <Link className="mt-8 inline-flex border border-[#c9b48a] px-4 py-3 text-sm text-[#e8d5b0]" href="/accompagnement">
            Revenir aux accompagnements
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8]">
      <header className="border-b border-[#29292c] bg-[#0e0e0f]/95 px-5 py-4 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              className="inline-flex h-10 w-10 items-center justify-center border border-[#3a3a3e] text-xl text-[#d8d3c8] transition hover:border-[#c9b48a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
              href="/accompagnement"
              aria-label="Revenir aux accompagnements"
            >
              ←
            </Link>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#c9b48a]">Espace membre</p>
              <p className="mt-1 text-sm text-[#bdb9b0]">Accompagnement activité</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href="/accompagnement/espace/guide"
              target="_blank"
              className="border border-[#3a3a3e] px-3 py-2 text-[#d8d3c8] transition hover:border-[#c9b48a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
            >
              Guide PDF
            </Link>
            <button
              type="button"
              onClick={downloadGuide}
              className="border border-[#c9b48a] bg-[#e8d5b0] px-3 py-2 text-[#171719] transition hover:bg-[#f0ede8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
            >
              Télécharger .md
            </button>
          </div>
        </div>
      </header>

      <section className="border-b border-[#29292c] px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-sm text-[#c9b48a]">{memberName ? `Bonjour ${memberName}.` : "Ton accompagnement."}</p>
              <h1 className="mt-3 text-4xl font-medium tracking-[-0.03em] sm:text-6xl">Un thème à la fois.</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#bdb9b0]">
                Regarde ce que le thème te fait gagner. Quand tu as compris, coche-le et passe au suivant.
              </p>
            </div>
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#bdb9b0]">Progression</span>
                <strong className="font-medium text-[#f0ede8]">{completedCount}/{validThemeIds.length}</strong>
              </div>
              <div className="mt-3 h-2 bg-[#29292c]" aria-hidden="true">
                <div className="h-full bg-[#c9b48a] transition-[width]" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="mt-2 text-xs text-[#8f8b84]">{assignmentLabel} · {getTrackLabel(assignment.track)}</p>
            </div>
          </div>
          {syncMessage ? (
            <p className="mt-6 border-l-2 border-[#c9b48a] pl-3 text-sm text-[#d8d3c8]" role="status">
              {syncMessage}
            </p>
          ) : null}
          {assignment.notes ? (
            <div className="mt-6 max-w-3xl border-l-2 border-[#c9b48a] pl-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#c9b48a]">Note du formateur</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#d8d3c8]">{assignment.notes}</p>
            </div>
          ) : null}
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:py-12">
        <aside className="min-w-0">
          <div className="border-b border-[#29292c] pb-3">
            <p className="text-xs uppercase tracking-[0.16em] text-[#8f8b84]">Ton parcours</p>
            <p className="mt-2 text-sm text-[#bdb9b0]">{completedCount} thème{completedCount > 1 ? "s" : ""} compris</p>
          </div>
          <nav className="mt-3 space-y-1" aria-label="Thèmes de l'accompagnement">
            {assignedThemes.map((theme, index) => {
              if (!theme) return null;
              const isActive = theme.id === activeTheme.id;
              const isDone = understoodThemeIds.includes(theme.id);
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setActiveThemeId(theme.id)}
                  className={`flex w-full items-center gap-3 border-b px-2 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] ${
                    isActive ? "border-[#c9b48a] bg-[#1c1c1f]" : "border-[#29292c] hover:bg-[#161618]"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center border text-xs ${isDone ? "border-[#c9b48a] text-[#e8d5b0]" : "border-[#3a3a3e] text-[#8f8b84]"}`}>
                    {isDone ? "✓" : String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-sm leading-5 text-[#d8d3c8]">{theme.title}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0" aria-labelledby="active-theme-title">
          <div className="border border-[#3a362d] bg-[#161618] p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-[#8f8b84]">
              <span>Thème {String(activeThemeIndex + 1).padStart(2, "0")}</span>
              <span>{activeTheme.marker}</span>
            </div>
            <h2 id="active-theme-title" className="mt-5 max-w-3xl text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
              {activeTheme.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#c8c3ba]">{activeGuidance.competency}</p>

            <div className="mt-8 grid gap-px border border-[#3a3a3e] bg-[#3a3a3e] sm:grid-cols-2">
              <div className="bg-[#1c1c1f] p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[#8f8b84]">Compétence gagnée</p>
                <p className="mt-3 text-sm leading-6 text-[#f0ede8]">{activeGuidance.competency}</p>
              </div>
              <div className="bg-[#1c1c1f] p-5">
                <p className="text-xs uppercase tracking-[0.14em] text-[#8f8b84]">Étape franchie</p>
                <p className="mt-3 text-sm leading-6 text-[#f0ede8]">{activeGuidance.milestone}</p>
              </div>
            </div>

            <div className="mt-8 border-l-2 border-[#c9b48a] pl-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#c9b48a]">Repère pour la suite</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#bdb9b0]">{activeGuidance.autonomyTip}</p>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-4 border-t border-[#29292c] pt-6">
              <button
                type="button"
                role="checkbox"
                aria-checked={understoodThemeIds.includes(activeTheme.id)}
                disabled={pendingThemeIds.includes(activeTheme.id)}
                onClick={() => toggleTheme(activeTheme.id)}
                className={`inline-flex min-h-12 items-center gap-3 border px-4 py-3 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] disabled:cursor-wait disabled:opacity-60 ${
                  understoodThemeIds.includes(activeTheme.id)
                    ? "border-[#c9b48a] bg-[#e8d5b0] text-[#171719]"
                    : "border-[#c9b48a] text-[#e8d5b0] hover:bg-[#2a261f]"
                }`}
              >
                <span aria-hidden="true" className="text-base">{understoodThemeIds.includes(activeTheme.id) ? "✓" : "○"}</span>
                {pendingThemeIds.includes(activeTheme.id)
                  ? "Enregistrement..."
                  : understoodThemeIds.includes(activeTheme.id)
                    ? "Thème compris"
                    : "J'ai compris ce thème"}
              </button>
              {understoodThemeIds.includes(activeTheme.id) && nextTheme ? (
                <Link
                  href={`/accompagnement/espace#${nextTheme.id}`}
                  onClick={() => setActiveThemeId(nextTheme!.id)}
                  className="text-sm text-[#d8d3c8] underline decoration-[#c9b48a] underline-offset-4 hover:text-[#e8d5b0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
                >
                  Ouvrir le thème suivant
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <details className="border-t border-[#29292c] pt-6">
          <summary className="cursor-pointer text-sm text-[#d8d3c8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]">
            Ajouter du contexte partagé à ton guide
          </summary>
          <div className="mt-6 grid max-w-4xl gap-5 sm:grid-cols-3">
            <label className="text-sm text-[#bdb9b0]">
              Activité ou entreprise
              <input
                value={profile.company}
                maxLength={200}
                onChange={(event) => setProfile((current) => ({ ...current, company: event.target.value }))}
                className="mt-2 w-full border border-[#3a3a3e] bg-[#161618] px-3 py-3 text-[#f0ede8] outline-none focus:border-[#c9b48a]"
              />
            </label>
            <label className="text-sm text-[#bdb9b0]">
              Projet actuel
              <input
                value={profile.project}
                maxLength={500}
                onChange={(event) => setProfile((current) => ({ ...current, project: event.target.value }))}
                className="mt-2 w-full border border-[#3a3a3e] bg-[#161618] px-3 py-3 text-[#f0ede8] outline-none focus:border-[#c9b48a]"
              />
            </label>
            <label className="text-sm text-[#bdb9b0]">
              Lien principal de l&apos;activité
              <input
                type="url"
                value={profile.siteUrl}
                maxLength={500}
                onChange={(event) => setProfile((current) => ({ ...current, siteUrl: event.target.value }))}
                className="mt-2 w-full border border-[#3a3a3e] bg-[#161618] px-3 py-3 text-[#f0ede8] outline-none focus:border-[#c9b48a]"
              />
            </label>
            <label className="text-sm text-[#bdb9b0] sm:col-span-3">
              Notes partagées avec le formateur
              <textarea
                rows={3}
                value={followUp.observations}
                maxLength={4000}
                onChange={(event) => setFollowUp((current) => ({ ...current, observations: event.target.value }))}
                className="mt-2 w-full resize-y border border-[#3a3a3e] bg-[#161618] px-3 py-3 text-[#f0ede8] outline-none focus:border-[#c9b48a]"
                placeholder="Une décision, un apprentissage ou un point à vérifier."
              />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => void saveSharedContext()}
              disabled={isSavingContext}
              className="border border-[#c9b48a] bg-[#e8d5b0] px-4 py-3 text-sm text-[#171719] transition hover:bg-[#f0ede8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] disabled:cursor-wait disabled:opacity-60"
            >
              {isSavingContext ? "Enregistrement..." : "Enregistrer dans l'espace"}
            </button>
            <button
              type="button"
              onClick={downloadGuide}
              className="border border-[#c9b48a] px-4 py-3 text-sm text-[#e8d5b0] transition hover:bg-[#2a261f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
            >
              Télécharger le guide .md
            </button>
            <button
              type="button"
              onClick={() => void resetProgress()}
              disabled={isResetting}
              className="text-sm text-[#8f8b84] underline underline-offset-4 hover:text-[#d8d3c8] disabled:opacity-50"
            >
              {isResetting ? "Réinitialisation..." : "Réinitialiser ma progression"}
            </button>
          </div>
          {contextMessage ? (
            <p className="mt-4 text-sm text-[#d8d3c8]" role="status">{contextMessage}</p>
          ) : null}
        </details>
      </section>
    </main>
  );
}
