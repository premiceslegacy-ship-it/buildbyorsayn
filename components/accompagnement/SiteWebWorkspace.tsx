"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Loader2,
  RotateCcw,
  Save,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AccompanimentTrack,
  buildSiteWebFollowUpFilename,
  buildSiteWebFollowUpMarkdown,
  SiteWebFollowUpValues,
  THEMES,
  TRACKS,
} from "@/lib/siteWebAccompagnement";
import { Logo } from "@/components/Logo";

const PROFILE_KEY = "build_site_web_accompagnement_profile_v1";
const LOCAL_PROGRESS_KEY = "build_site_web_accompagnement_progress_v1";
const FOLLOW_UP_KEY = "build_site_web_accompagnement_follow_up_v1";
const OUTBOX_KEY = "build_site_web_accompagnement_outbox_v1";

const DEFAULT_FOLLOW_UP: SiteWebFollowUpValues = {
  baseline: "",
  day30: "Mesurer les premiers signaux et corriger ce qui bloque.",
  day60: "Comparer les demandes reçues et améliorer les pages utiles.",
  day90: "Décider ce qui doit être gardé et ce qui doit être amélioré.",
  metrics: "Demandes qualifiées, rendez-vous, conversion, recherches utiles et temps de livraison.",
  observations: "",
};

const VALID_TASK_IDS = new Set(
  THEMES.flatMap((theme) => theme.tasks.map((task) => task.id))
);

type WorkspaceProfile = {
  name: string;
  company: string;
  project: string;
  siteUrl: string;
  track: AccompanimentTrack;
};

type SyncState = "loading" | "local" | "synced" | "saving" | "error";
type PendingMutation = { itemId: string; completed: boolean };

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
}

function writeOutbox(mutations: PendingMutation[]) {
  const latestByItem = new Map<string, PendingMutation>();
  mutations.forEach((mutation) => latestByItem.set(mutation.itemId, mutation));
  localStorage.setItem(OUTBOX_KEY, JSON.stringify([...latestByItem.values()]));
}

function queueMutation(mutation: PendingMutation) {
  const current = readJson<PendingMutation[]>(OUTBOX_KEY, []);
  writeOutbox([...current, mutation]);
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function TrackSelector({
  value,
  onChange,
  compact = false,
}: {
  value: AccompanimentTrack;
  onChange: (track: AccompanimentTrack) => void;
  compact?: boolean;
}) {
  const groupName = compact ? "site-web-track-mobile" : "site-web-track-desktop";

  return (
    <fieldset className={compact ? "grid gap-2 sm:grid-cols-3" : "space-y-2"}>
      <legend className="sr-only">Choisir ton point de départ</legend>
      {TRACKS.map((track) => {
        const selected = value === track.id;
        return (
          <label
            key={track.id}
            className={`block min-h-11 cursor-pointer border px-3 py-3 text-left transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#e8d5b0] ${
              selected
                ? "border-[#e8d5b0]/55 bg-[#e8d5b0]/[0.08]"
                : "border-white/[0.1] hover:border-white/25"
            }`}
          >
            <input
              type="radio"
              name={groupName}
              value={track.id}
              checked={selected}
              onChange={() => onChange(track.id)}
              className="sr-only"
            />
            <span className={`block text-xs font-semibold ${selected ? "text-[#f0ede8]" : "text-[#aaa59c]"}`}>
              {track.shortLabel}
            </span>
            <span className="mt-1 block text-[11px] leading-5 text-[#8f887d]">
              {track.adjustment}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "url";
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium text-[#aaa59c]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full border border-white/[0.12] bg-black/20 px-3 text-sm text-[#f0ede8] outline-none transition-colors placeholder:text-[#777169] focus:border-[#e8d5b0]/60 focus:ring-2 focus:ring-[#e8d5b0]/30"
      />
    </label>
  );
}

function FollowUpField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-[#c4bfb5]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-2 w-full resize-y border border-white/[0.12] bg-black/20 px-4 py-3 text-sm leading-7 text-[#f0ede8] outline-none transition-colors placeholder:text-[#777169] focus:border-[#e8d5b0]/60 focus:ring-2 focus:ring-[#e8d5b0]/30"
      />
    </label>
  );
}

export function SiteWebWorkspace() {
  const [profile, setProfile] = useState<WorkspaceProfile>({
    name: "",
    company: "",
    project: "",
    siteUrl: "",
    track: "debutant",
  });
  const [activeThemeId, setActiveThemeId] = useState(THEMES[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [followUp, setFollowUp] = useState<SiteWebFollowUpValues>(DEFAULT_FOLLOW_UP);
  const [syncState, setSyncState] = useState<SyncState>("loading");
  const [message, setMessage] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [pendingTaskIds, setPendingTaskIds] = useState<string[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const pendingTaskSet = useRef(new Set<string>());
  const resetInFlightRef = useRef(false);

  useEffect(() => {
    const load = async () => {
      const savedProfile = readJson<Partial<WorkspaceProfile>>(PROFILE_KEY, {});
      const savedFollowUp = readJson<Partial<SiteWebFollowUpValues>>(FOLLOW_UP_KEY, {});
      const localItems = readJson<string[]>(LOCAL_PROGRESS_KEY, []).filter(
        (item): item is string => typeof item === "string" && VALID_TASK_IDS.has(item)
      );
      const queued = readJson<PendingMutation[]>(OUTBOX_KEY, []).filter(
        (item) =>
          typeof item?.itemId === "string" &&
          VALID_TASK_IDS.has(item.itemId) &&
          typeof item.completed === "boolean"
      );

      setProfile((current) => ({ ...current, ...savedProfile }));
      setFollowUp((current) => ({ ...current, ...savedFollowUp }));
      setCompleted(localItems);

      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setSyncState(userError ? "error" : "local");
        if (userError) {
          setMessage("Progression conservée ici. La synchronisation reprendra à la prochaine connexion.");
        }
        setHasHydrated(true);
        return;
      }

      const firstName =
        (user.user_metadata?.first_name as string) ||
        (user.user_metadata?.full_name as string)?.split(" ")[0] ||
        user.email?.split("@")[0];
      if (firstName && !savedProfile.name) {
        setProfile((current) => ({ ...current, name: firstName }));
      }

      const failedOutbox: PendingMutation[] = [];
      for (const mutation of queued) {
        const result = mutation.completed
          ? await supabase.from("progress").upsert(
              { user_id: user.id, module_id: "web-accompagnement", item_id: mutation.itemId },
              { onConflict: "user_id,item_id", ignoreDuplicates: true }
            )
          : await supabase
              .from("progress")
              .delete()
              .eq("user_id", user.id)
              .eq("item_id", mutation.itemId);
        if (result.error) failedOutbox.push(mutation);
      }
      writeOutbox(failedOutbox);

      const { data, error } = await supabase
        .from("progress")
        .select("item_id")
        .eq("user_id", user.id)
        .like("item_id", "web-%");

      if (error) {
        setSyncState("error");
        setMessage("Progression conservée ici. La copie distante n'a pas pu être relue.");
        setHasHydrated(true);
        return;
      }

      const remoteItems = (data ?? [])
        .map((row: { item_id: string }) => row.item_id)
        .filter((itemId) => VALID_TASK_IDS.has(itemId));
      const desired = new Set(remoteItems);
      failedOutbox.forEach((mutation) => {
        if (mutation.completed) desired.add(mutation.itemId);
        else desired.delete(mutation.itemId);
      });

      setCompleted([...desired]);
      setSyncState(failedOutbox.length ? "error" : "synced");
      setMessage(
        failedOutbox.length
          ? "Certaines modifications restent ici et seront retentées à la prochaine ouverture."
          : ""
      );
      setHasHydrated(true);
    };

    load().catch(() => {
      setCompleted(readJson<string[]>(LOCAL_PROGRESS_KEY, []).filter((item) => VALID_TASK_IDS.has(item)));
      setSyncState("error");
      setMessage("Progression conservée ici. La synchronisation reprendra plus tard.");
      setHasHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [hasHydrated, profile]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(FOLLOW_UP_KEY, JSON.stringify(followUp));
  }, [followUp, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) return;
    localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(completed));
  }, [completed, hasHydrated]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (THEMES.some((theme) => theme.id === hash)) setActiveThemeId(hash);
  }, []);

  const visibleTasks = useMemo(
    () =>
      THEMES.flatMap((theme) =>
        theme.tasks.filter((task) => !task.tracks || task.tracks.includes(profile.track))
      ),
    [profile.track]
  );
  const completedVisible = visibleTasks.filter((task) => completed.includes(task.id)).length;
  const progress = visibleTasks.length
    ? Math.round((completedVisible / visibleTasks.length) * 100)
    : 0;
  const activeTheme = THEMES.find((theme) => theme.id === activeThemeId) ?? THEMES[0];
  const activeTasks = activeTheme.tasks.filter(
    (task) => !task.tracks || task.tracks.includes(profile.track)
  );
  const themeCompleted = activeTasks.filter((task) => completed.includes(task.id)).length;
  const activeFinishLine = activeTheme.trackFinishLine?.[profile.track]
    ? `${activeTheme.finishLine} ${activeTheme.trackFinishLine[profile.track]}`
    : activeTheme.finishLine;

  const updateProfile = (key: keyof WorkspaceProfile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const updateFollowUp = (key: keyof SiteWebFollowUpValues, value: string) => {
    setFollowUp((current) => ({ ...current, [key]: value }));
  };

  const openTheme = (themeId: string) => {
    setActiveThemeId(themeId);
    window.history.replaceState(null, "", `#${themeId}`);
  };

  const toggleTask = async (itemId: string) => {
    if (pendingTaskSet.current.has(itemId) || resetInFlightRef.current) return;

    const wasCompleted = completed.includes(itemId);
    const desiredCompleted = !wasCompleted;
    pendingTaskSet.current.add(itemId);
    setPendingTaskIds((current) => [...current, itemId]);
    setCompleted((current) =>
      desiredCompleted
        ? Array.from(new Set([...current, itemId]))
        : current.filter((id) => id !== itemId)
    );
    setSyncState("saving");

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        queueMutation({ itemId, completed: desiredCompleted });
        setSyncState(userError ? "error" : "local");
        setMessage("Modification conservée ici. Elle sera synchronisée à la prochaine connexion.");
        return;
      }

      const result = desiredCompleted
        ? await supabase.from("progress").upsert(
            { user_id: user.id, module_id: "web-accompagnement", item_id: itemId },
            { onConflict: "user_id,item_id", ignoreDuplicates: true }
          )
        : await supabase
            .from("progress")
            .delete()
            .eq("user_id", user.id)
            .eq("item_id", itemId);

      if (result.error) {
        queueMutation({ itemId, completed: desiredCompleted });
        setSyncState("error");
        setMessage("Modification conservée ici et placée en attente de synchronisation.");
        return;
      }

      const remaining = readJson<PendingMutation[]>(OUTBOX_KEY, []).filter(
        (mutation) => mutation.itemId !== itemId
      );
      writeOutbox(remaining);
      setSyncState(remaining.length ? "error" : "synced");
      setMessage(remaining.length ? "D'autres modifications attendent encore." : "");
    } finally {
      pendingTaskSet.current.delete(itemId);
      setPendingTaskIds((current) => current.filter((id) => id !== itemId));
    }
  };

  const resetProgress = async () => {
    if (!hasHydrated) {
      setMessage("Attends la fin du chargement avant de remettre la progression à zéro.");
      return;
    }
    if (pendingTaskSet.current.size > 0) {
      setMessage("Attends la fin de la sauvegarde en cours.");
      return;
    }
    if (!window.confirm("Remettre la progression à zéro dans BUILD et sur tes autres appareils ?")) return;
    resetInFlightRef.current = true;
    setIsResetting(true);
    setSyncState("saving");
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setSyncState("error");
        setMessage("La remise à zéro demande une connexion active. Rien n'a été supprimé.");
        return;
      }

      const { error } = await supabase
        .from("progress")
        .delete()
        .eq("user_id", user.id)
        .like("item_id", "web-%");
      if (error) {
        setSyncState("error");
        setMessage("La remise à zéro a échoué. La progression locale est conservée.");
        return;
      }

      writeOutbox([]);
      localStorage.setItem(LOCAL_PROGRESS_KEY, "[]");
      setCompleted([]);
      setSyncState("synced");
      setMessage("Progression remise à zéro dans BUILD.");
    } finally {
      resetInFlightRef.current = false;
      setIsResetting(false);
    }
  };

  const exportFollowUp = () => {
    const content = buildSiteWebFollowUpMarkdown({ profile, followUp, completed });
    const filename = buildSiteWebFollowUpFilename(profile);
    downloadText(filename, content);
  };

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8]">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0e0e0f]">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/accompagnement/site-web"
              aria-label="Retour à l'offre Site Web"
              className="flex h-11 w-11 flex-none items-center justify-center border border-white/[0.12] text-[#aaa59c] transition-colors hover:border-white/35 hover:text-[#f0ede8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link href="/accompagnement" className="hidden sm:block" aria-label="Retour aux accompagnements">
              <Logo layout="horizontal" />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8f887d]">
                Espace Site Web
              </p>
              <p className="truncate text-sm font-semibold text-[#f0ede8]">
                {profile.name ? `Espace de ${profile.name}` : "Ton espace de travail"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div aria-live="polite" aria-atomic="true" className="hidden items-center gap-2 text-xs text-[#9c978e] md:flex">
              {syncState === "loading" || syncState === "saving" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {syncState === "synced" && "Sauvegardé"}
              {syncState === "local" && "Sauvegarde ici"}
              {syncState === "saving" && "Sauvegarde"}
              {syncState === "loading" && "Chargement"}
              {syncState === "error" && "À resynchroniser"}
            </div>
            <button
              type="button"
              onClick={exportFollowUp}
              className="inline-flex min-h-11 items-center gap-2 border border-white/[0.16] px-4 text-xs font-semibold text-[#f0ede8] transition-colors hover:border-white/40 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exporter</span>
            </button>
          </div>
        </div>
      </header>

      <section className="border-b border-white/[0.08] px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e8d5b0]">
            Ton accompagnement
          </p>
          <h1 className="mt-6 text-balance text-4xl font-medium leading-[0.98] tracking-[-0.05em] text-[#f0ede8] sm:text-6xl">
            Ton site avance avec un plan clair.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#aaa59c]">
            Choisis un thème, fais le travail qui compte maintenant, puis passe au suivant quand le résultat est prêt.
          </p>
          <div className="mx-auto mt-10 max-w-2xl text-left">
            <div className="flex items-end justify-between gap-4 text-xs text-[#9c978e]">
              <span>{completedVisible} tâches sur {visibleTasks.length}</span>
              <span className="text-[#e8d5b0]">{progress}%</span>
            </div>
            <div className="mt-3 h-1 bg-white/[0.1]" aria-hidden="true">
              <div className="h-full bg-[#e8d5b0] transition-[width] duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[270px_minmax(0,1fr)_310px]">
        <aside className="min-w-0 border-b border-white/[0.08] px-4 py-6 sm:px-6 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-8">
          <div className="lg:hidden">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f887d]">
              Ton point de départ
            </p>
            <TrackSelector
              value={profile.track}
              onChange={(track) => setProfile((current) => ({ ...current, track }))}
              compact
            />
          </div>

          <nav className="mt-8" aria-label="Thèmes de l'accompagnement">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f887d]">
                Thèmes
              </p>
              <span className="text-xs text-[#777169]">{THEMES.length}</span>
            </div>
            <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {THEMES.map((theme) => {
                const tasks = theme.tasks.filter(
                  (task) => !task.tracks || task.tracks.includes(profile.track)
                );
                const done = tasks.filter((task) => completed.includes(task.id)).length;
                const active = theme.id === activeTheme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => openTheme(theme.id)}
                    aria-current={active ? "page" : undefined}
                    className={`block min-h-11 w-full border-l-2 px-3 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] focus-visible:ring-inset ${
                      active
                        ? "border-[#e8d5b0] bg-white/[0.04] text-[#f0ede8]"
                        : "border-transparent text-[#8f887d] hover:bg-white/[0.025] hover:text-[#d7d1c8]"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <span className="text-xs tabular-nums text-[#e8d5b0]">{theme.marker}</span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium leading-5">{theme.title}</span>
                        <span className="mt-1 block text-[11px] text-[#777169]">{done}/{tasks.length} tâches</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        <section className="min-w-0 px-5 py-10 sm:px-8 lg:px-10 lg:py-14 xl:px-14" id={activeTheme.id}>
          {message && (
            <div role="status" aria-live="polite" className="mb-8 border border-[#e8d5b0]/30 bg-[#e8d5b0]/[0.06] px-4 py-3 text-sm leading-6 text-[#e8d5b0]">
              {message}
            </div>
          )}

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f887d]">
              <span>Thème {activeTheme.marker}</span>
              <span>{themeCompleted}/{activeTasks.length} tâches</span>
            </div>
            <h2 className="mt-6 text-balance text-4xl font-medium leading-[0.98] tracking-[-0.05em] text-[#f0ede8] sm:text-6xl">
              {activeTheme.title}
            </h2>
            <p className="mt-7 max-w-3xl text-base leading-8 text-[#c4bfb5] sm:text-lg">
              {activeTheme.promise}
            </p>
            <div className="mt-8 border-l border-[#e8d5b0]/45 pl-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f887d]">
                Pourquoi ce sujet compte
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#aaa59c]">{activeTheme.why}</p>
            </div>
          </div>

          <div className="mt-14 max-w-4xl">
            <div className="flex flex-col gap-2 border-b border-white/[0.1] pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#f0ede8]">À faire maintenant</h3>
                <p className="mt-1 text-sm text-[#777169]">Coche une tâche quand elle est réellement faite.</p>
              </div>
              <span className="text-xs text-[#9c978e]">{themeCompleted} sur {activeTasks.length}</span>
            </div>
            <div className="divide-y divide-white/[0.08]">
              {activeTasks.map((task) => {
                const isDone = completed.includes(task.id);
                const isPending = pendingTaskIds.includes(task.id);
                return (
                  <button
                    key={task.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isDone}
                    aria-busy={isPending}
                    disabled={isPending}
                    onClick={() => toggleTask(task.id)}
                    className="group grid min-h-11 w-full grid-cols-[28px_1fr] gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] focus-visible:ring-inset disabled:cursor-wait disabled:opacity-65"
                  >
                    <span className={`mt-0.5 flex h-6 w-6 items-center justify-center border transition-colors ${isDone ? "border-[#e8d5b0] bg-[#e8d5b0] text-[#0e0e0f]" : "border-white/25 text-transparent group-hover:border-[#e8d5b0]/70"}`}>
                      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#e8d5b0]" /> : <span className="text-sm">✓</span>}
                    </span>
                    <span>
                      <span className={`block text-sm font-medium leading-6 transition-colors ${isDone ? "text-[#777169] line-through decoration-white/20" : "text-[#f0ede8]"}`}>
                        {task.title}
                      </span>
                      <span className="mt-1.5 block text-xs leading-6 text-[#8f887d]">À la fin : {task.outcome}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-12 max-w-4xl border border-white/[0.12] bg-[#161618] px-5 py-6 sm:px-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8d5b0]">
              On passe à la suite quand
            </p>
            <p className="mt-3 text-sm leading-7 text-[#c4bfb5]">{activeFinishLine}</p>
          </div>

          <div className="mt-12 max-w-4xl">
            <h3 className="text-lg font-semibold text-[#f0ede8]">Ce que tu repars avec</h3>
            <div className="mt-4 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {activeTheme.deliverables.map((item, index) => (
                <div key={item} className="grid grid-cols-[40px_1fr] gap-4 py-4 text-sm">
                  <span className="text-xs tabular-nums text-[#e8d5b0]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-[#c4bfb5]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 max-w-4xl border-t border-white/[0.1] pt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f887d]">
              Après la mise en ligne
            </p>
            <h3 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] text-[#f0ede8] sm:text-4xl">
              Garde une trace de ce que le site change.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#9c978e]">
              Ces notes servent à décider de la suite à 30, 60 et 90 jours. Elles sont enregistrées dans ce navigateur et incluses dans l'export.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FollowUpField
                  label="Le départ et l'état actuel"
                  value={followUp.baseline}
                  onChange={(value) => updateFollowUp("baseline", value)}
                  rows={4}
                />
              </div>
              <FollowUpField
                label="À 30 jours"
                value={followUp.day30}
                onChange={(value) => updateFollowUp("day30", value)}
                rows={5}
              />
              <FollowUpField
                label="À 60 jours"
                value={followUp.day60}
                onChange={(value) => updateFollowUp("day60", value)}
                rows={5}
              />
              <FollowUpField
                label="À 90 jours"
                value={followUp.day90}
                onChange={(value) => updateFollowUp("day90", value)}
                rows={5}
              />
              <FollowUpField
                label="Ce qu'on regarde"
                value={followUp.metrics}
                onChange={(value) => updateFollowUp("metrics", value)}
                rows={5}
              />
              <div className="sm:col-span-2">
                <FollowUpField
                  label="Notes de suivi"
                  value={followUp.observations}
                  onChange={(value) => updateFollowUp("observations", value)}
                  rows={5}
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={exportFollowUp}
                className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#e8d5b0] px-5 text-sm font-semibold text-[#0e0e0f] transition-colors hover:bg-[#f0dfc0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0]"
              >
                <Download className="h-4 w-4" />
                Exporter le suivi
              </button>
              <button
                type="button"
                onClick={resetProgress}
                disabled={!hasHydrated || pendingTaskIds.length > 0 || syncState === "saving" || isResetting}
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/[0.12] px-5 text-sm font-medium text-[#9c978e] transition-colors hover:border-white/35 hover:text-[#f0ede8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e8d5b0] disabled:cursor-not-allowed disabled:opacity-45"
              >
                <RotateCcw className="h-4 w-4" />
                Remettre à zéro
              </button>
            </div>
          </div>
        </section>

        <aside className="border-t border-white/[0.08] px-5 py-10 sm:px-8 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:px-6 lg:py-8">
          <div className="hidden lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f887d]">
              Ton point de départ
            </p>
            <p className="mt-3 text-sm leading-7 text-[#9c978e]">
              Ces informations servent à personnaliser le suivi exporté.
            </p>
            <div className="mt-7 space-y-5">
              <Field label="Ton nom" value={profile.name} onChange={(value) => updateProfile("name", value)} />
              <Field label="Entreprise" value={profile.company} onChange={(value) => updateProfile("company", value)} />
              <Field label="Projet" value={profile.project} onChange={(value) => updateProfile("project", value)} />
              <Field label="Adresse du site" type="url" value={profile.siteUrl} onChange={(value) => updateProfile("siteUrl", value)} />
            </div>
            <div className="mt-8 border-t border-white/[0.1] pt-7">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f887d]">
                Ton point de départ
              </p>
              <div className="mt-4">
                <TrackSelector
                  value={profile.track}
                  onChange={(track) => setProfile((current) => ({ ...current, track }))}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/[0.1] pt-7 lg:mt-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f887d]">
              À garder en tête
            </p>
            <p className="mt-3 text-sm leading-7 text-[#aaa59c]">
              Une tâche cochée signifie que tu l'as faite. Elle ne remplace pas la relecture du projet.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
