"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Circle,
  Download,
  FileText,
  Gauge,
  Loader2,
  RotateCcw,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AccompanimentTrack,
  buildSiteWebFollowUpFilename,
  buildSiteWebFollowUpMarkdown,
  PHASES,
  TRACKS,
} from "@/lib/siteWebAccompagnement";

const PROFILE_KEY = "build_site_web_accompagnement_profile_v1";
const LOCAL_PROGRESS_KEY = "build_site_web_accompagnement_progress_v1";
const FOLLOW_UP_KEY = "build_site_web_accompagnement_follow_up_v1";
const OUTBOX_KEY = "build_site_web_accompagnement_outbox_v1";

const DEFAULT_FOLLOW_UP = {
  baseline: "",
  day30: "Mesurer les premiers signaux, corriger les frictions critiques et consolider la production de contenu.",
  day60: "Comparer les angles d'acquisition, approfondir les requêtes utiles et documenter les process répétés.",
  day90: "Décider ce qui devient SOP, skill, asset ou test de non-régression, puis planifier le cycle suivant.",
  metrics: "Leads qualifiés, rendez-vous, conversion, requêtes utiles, temps de livraison, erreurs récurrentes.",
  observations: "",
};

type WorkspaceProfile = {
  name: string;
  company: string;
  project: string;
  siteUrl: string;
  track: AccompanimentTrack;
};

type FollowUp = typeof DEFAULT_FOLLOW_UP;

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

function proofLabel(count: number) {
  return `${count} ${count === 1 ? "preuve" : "preuves"}`;
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
      <legend className="sr-only">Choisir le parcours</legend>
      {TRACKS.map((track) => {
        const selected = value === track.id;
        return (
          <label
            key={track.id}
            className={`relative block min-h-11 w-full cursor-pointer rounded-xl border px-3 py-3 text-left transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#d6e3e8] ${selected ? "border-[#b7cbd3]/35 bg-[#c3d4da]/[0.1]" : "border-white/[0.09] hover:border-white/20"}`}
          >
            <input
              type="radio"
              name={groupName}
              value={track.id}
              checked={selected}
              onChange={() => onChange(track.id)}
              className="peer sr-only"
            />
            <span className={`block text-xs font-semibold ${selected ? "text-[#eef3f3]" : "text-[#a8b6bc]"}`}>{track.shortLabel}</span>
            <span className="mt-1 block text-[11px] leading-5 text-[#9aabb3]">{track.adjustment}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

export function SiteWebWorkspace() {
  const [profile, setProfile] = useState<WorkspaceProfile>({
    name: "Prénom",
    company: "Entreprise",
    project: "Projet site web",
    siteUrl: "",
    track: "debutant",
  });
  const [activePhaseId, setActivePhaseId] = useState(PHASES[0].id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [followUp, setFollowUp] = useState<FollowUp>(DEFAULT_FOLLOW_UP);
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
      const savedFollowUp = readJson<Partial<FollowUp>>(FOLLOW_UP_KEY, {});
      const localItems = readJson<string[]>(LOCAL_PROGRESS_KEY, []).filter(
        (item): item is string => typeof item === "string" && item.startsWith("web-")
      );
      const queued = readJson<PendingMutation[]>(OUTBOX_KEY, []).filter(
        (item) =>
          typeof item?.itemId === "string" &&
          item.itemId.startsWith("web-") &&
          typeof item.completed === "boolean"
      );

      setProfile((current) => ({ ...current, ...savedProfile }));
      setFollowUp((current) => ({ ...current, ...savedFollowUp }));
      setCompleted(localItems);

      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setSyncState(userError ? "error" : "local");
        if (userError) {
          setMessage("Progression conservée localement. La synchronisation reprendra à la prochaine connexion valide.");
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
        setMessage("Progression conservée localement. La copie distante n'a pas pu être relue.");
        setHasHydrated(true);
        return;
      }

      // Une fois authentifié, Supabase est la source de vérité. Le cache local
      // accélère le premier rendu mais ne peut jamais recréer une tâche supprimée
      // depuis un autre appareil. Seules les mutations encore dans l'outbox
      // peuvent temporairement surcharger la copie distante.
      const remoteItems = (data ?? [])
        .map((row: { item_id: string }) => row.item_id)
        .filter((itemId) => itemId.startsWith("web-") && !itemId.startsWith("web-reset:"));
      const desired = new Set(remoteItems);
      failedOutbox.forEach((mutation) => {
        if (mutation.completed) desired.add(mutation.itemId);
        else desired.delete(mutation.itemId);
      });

      setCompleted([...desired]);
      setSyncState(failedOutbox.length ? "error" : "synced");
      setMessage(
        failedOutbox.length
          ? "Certaines modifications restent locales et seront retentées à la prochaine ouverture."
          : ""
      );
      setHasHydrated(true);
    };

    load().catch(() => {
      setCompleted(readJson<string[]>(LOCAL_PROGRESS_KEY, []));
      setSyncState("error");
      setMessage("Progression conservée localement. La synchronisation reprendra plus tard.");
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
    if (PHASES.some((phase) => phase.id === hash)) setActivePhaseId(hash);
  }, []);

  const visibleTasks = useMemo(
    () =>
      PHASES.flatMap((phase) =>
        phase.tasks.filter((task) => !task.tracks || task.tracks.includes(profile.track))
      ),
    [profile.track]
  );

  const completedVisible = visibleTasks.filter((task) => completed.includes(task.id)).length;
  const progress = visibleTasks.length ? Math.round((completedVisible / visibleTasks.length) * 100) : 0;
  const activePhase = PHASES.find((phase) => phase.id === activePhaseId) ?? PHASES[0];
  const activeTasks = activePhase.tasks.filter(
    (task) => !task.tracks || task.tracks.includes(profile.track)
  );
  const phaseCompleted = activeTasks.filter((task) => completed.includes(task.id)).length;
  const activeValidation = activePhase.trackValidation?.[profile.track]
    ? `${activePhase.validation} ${activePhase.trackValidation[profile.track]}`
    : activePhase.validation;

  const updateProfile = (key: keyof WorkspaceProfile, value: string) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const updateFollowUp = (key: keyof FollowUp, value: string) => {
    setFollowUp((current) => ({ ...current, [key]: value }));
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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        queueMutation({ itemId, completed: desiredCompleted });
        setSyncState(userError ? "error" : "local");
        setMessage("Modification conservée localement. Elle sera synchronisée à la prochaine connexion valide.");
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
        setMessage("Modification conservée localement et placée en attente de synchronisation.");
        return;
      }

      const remaining = readJson<PendingMutation[]>(OUTBOX_KEY, []).filter(
        (mutation) => mutation.itemId !== itemId
      );
      writeOutbox(remaining);
      setSyncState(remaining.length ? "error" : "synced");
      setMessage(remaining.length ? "D'autres modifications attendent encore une synchronisation." : "");
    } finally {
      pendingTaskSet.current.delete(itemId);
      setPendingTaskIds((current) => current.filter((id) => id !== itemId));
    }
  };

  const resetProgress = async () => {
    if (!hasHydrated) {
      setMessage("Attends la fin du chargement avant de réinitialiser la progression.");
      return;
    }
    if (pendingTaskSet.current.size > 0) {
      setMessage("Attends la fin de la synchronisation en cours avant de réinitialiser la progression.");
      return;
    }
    if (!window.confirm("Réinitialiser la progression dans BUILD et sur tous tes appareils après synchronisation ?")) return;
    resetInFlightRef.current = true;
    setIsResetting(true);
    setSyncState("saving");
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setSyncState("error");
        setMessage("La réinitialisation partout exige une connexion active. Aucune progression n'a été supprimée.");
        return;
      }

      const { error } = await supabase
        .from("progress")
        .delete()
        .eq("user_id", user.id)
        .like("item_id", "web-%");
      if (error) {
        setSyncState("error");
        setMessage("La réinitialisation distante a échoué. Aucune progression locale n'a été supprimée.");
        return;
      }

      writeOutbox([]);
      localStorage.setItem(LOCAL_PROGRESS_KEY, "[]");
      setCompleted([]);
      setSyncState("synced");
      setMessage("Progression réinitialisée dans BUILD. Les autres appareils recevront cet état à leur prochaine synchronisation.");
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
    <main className="min-h-screen bg-[#0b1117] text-[#eff0eb]">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0b1117]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/accompagnement" aria-label="Retour à l'offre" className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#b8c6ce] transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-[#748b98]">Site Web by AI</p>
              <p className="truncate text-sm font-semibold text-[#eceae4]">Espace de progression de {profile.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div aria-live="polite" aria-atomic="true" className="hidden items-center gap-2 text-xs text-[#9aabb3] sm:flex">
              {syncState === "loading" || syncState === "saving" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {syncState === "synced" && "Synchronisé avec BUILD"}
              {syncState === "local" && "Sauvegarde locale"}
              {syncState === "saving" && "Sauvegarde"}
              {syncState === "loading" && "Chargement"}
              {syncState === "error" && "Modifications locales non synchronisées"}
            </div>
            <button onClick={exportFollowUp} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 text-xs font-semibold text-[#e9edef] transition hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Exporter le suivi</span>
              <span className="sm:hidden">Exporter</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[292px_minmax(0,1fr)_320px]">
        <aside className="min-w-0 border-b border-white/[0.08] px-4 py-5 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-7">
          <div className="rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(229,237,238,0.1),rgba(36,52,64,0.2))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#718692]">Progression</p>
                <p className="mt-2 text-4xl font-light tracking-[-0.05em] text-[#f2efe8]">{progress}%</p>
              </div>
              <Gauge className="h-6 w-6 text-[#bacbd3]" strokeWidth={1.3} />
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/30">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#8fa8b7,#e5ecec)] transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-xs text-[#7d909a]">{proofLabel(completedVisible)} sur {visibleTasks.length}</p>
          </div>

          <div className="mt-5 lg:hidden">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#94a7b0]">Choisis ton parcours avant de commencer</p>
            <TrackSelector
              value={profile.track}
              onChange={(track) => setProfile((current) => ({ ...current, track }))}
              compact
            />
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0" aria-label="Paliers de l'accompagnement">
            {PHASES.map((phase, index) => {
              const tasks = phase.tasks.filter((task) => !task.tracks || task.tracks.includes(profile.track));
              const done = tasks.filter((task) => completed.includes(task.id)).length;
              const active = phase.id === activePhase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => {
                    setActivePhaseId(phase.id);
                    window.history.replaceState(null, "", `#${phase.id}`);
                  }}
                  aria-current={active ? "step" : undefined}
                  className={`min-w-[230px] rounded-xl px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 lg:min-w-0 lg:w-full ${active ? "bg-white/[0.09] text-white" : "text-[#7f919b] hover:bg-white/[0.045] hover:text-[#dbe3e5]"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border text-[10px] ${done === tasks.length && tasks.length ? "border-[#b9ced6]/35 bg-[#b9ced6]/15 text-[#dce8eb]" : "border-white/10 text-[#96a8b0]"}`}>
                      {done === tasks.length && tasks.length ? <Check className="h-3.5 w-3.5" /> : String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">{phase.marker}</span>
                      <span className="mt-0.5 block truncate text-[11px] opacity-60">{done}/{tasks.length} {tasks.length === 1 ? "preuve" : "preuves"}</span>
                    </span>
                    <ChevronRight className="hidden h-3.5 w-3.5 opacity-50 lg:block" />
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 px-4 py-8 sm:px-8 lg:px-10 lg:py-12 xl:px-14" id={activePhase.id}>
          {message && (
            <div role="status" aria-live="polite" className="mb-6 rounded-2xl border border-[#d3b983]/20 bg-[#d3b983]/[0.07] px-4 py-3 text-sm leading-6 text-[#d8c7a4]">
              {message}
            </div>
          )}

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8196a1]">
              <span>{activePhase.marker}</span>
              <span className="h-1 w-1 rounded-full bg-[#526874]" />
              <span>{activePhase.duration}</span>
              <span className="h-1 w-1 rounded-full bg-[#526874]" />
              <span>{phaseCompleted}/{activeTasks.length} {activeTasks.length === 1 ? "preuve" : "preuves"}</span>
            </div>
            <h1 className="mt-6 text-balance text-4xl leading-[0.98] tracking-[-0.045em] text-[#f0ece5] sm:text-5xl [font-family:'Iowan_Old_Style','Baskerville','Times_New_Roman',serif]">
              {activePhase.title}
            </h1>
            <p className="mt-7 max-w-3xl text-base leading-8 text-[#9caab2]">{activePhase.promise}</p>

            <div className="mt-9 border-l border-[#a9bdc7]/25 pl-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#748a96]">Pourquoi ce palier existe</p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#bfcbcf]">{activePhase.why}</p>
            </div>
          </div>

          <div className="mt-12 max-w-4xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
              <h2 className="text-sm font-semibold text-[#eceae4]">Preuves à produire</h2>
              <span className="text-xs text-[#718590]">Cliquer seulement lorsque la preuve existe</span>
            </div>
            <div className="divide-y divide-white/[0.07]">
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
                    className="group grid min-h-11 w-full grid-cols-[28px_1fr] gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d6e3e8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1117] disabled:cursor-wait disabled:opacity-70"
                  >
                    <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border transition ${isDone ? "border-[#bcd0d7]/50 bg-[#bfd0d5]/15 text-[#e5edef]" : "border-white/15 text-transparent group-hover:border-white/35"}`}>
                      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin text-[#dce6e9]" /> : isDone ? <Check className="h-3.5 w-3.5" /> : <Circle className="h-2 w-2" />}
                    </span>
                    <span>
                      <span className={`block text-sm font-medium leading-6 transition ${isDone ? "text-[#8598a1] line-through decoration-white/20" : "text-[#e0e5e4]"}`}>{task.title}</span>
                      <span className="mt-1.5 block text-xs leading-6 text-[#718590]">Preuve : {task.proof}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-12 max-w-4xl rounded-3xl border border-[#c5d4d9]/15 bg-[#dce5e6]/[0.055] p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-[#c9d9de]" strokeWidth={1.4} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9eafb7]">Gate de validation</p>
                <p className="mt-3 text-sm leading-7 text-[#d6dedf]">{activeValidation}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 max-w-4xl">
            <h2 className="text-sm font-semibold text-[#eceae4]">Livrables de ce palier</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {activePhase.deliverables.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-[#9eafb7]">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-16 max-w-4xl border-t border-white/[0.08] pt-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#748a96]">Document post-accompagnement</p>
                <h2 className="mt-3 text-2xl text-[#f0ece5] [font-family:'Iowan_Old_Style','Baskerville',serif]">Le plan qui reste après les sessions</h2>
              </div>
              <FileText className="h-6 w-6 text-[#8ea2ad]" strokeWidth={1.3} />
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="text-xs font-medium text-[#9dadb4]">Baseline et état de sortie</span>
                <textarea value={followUp.baseline} onChange={(event) => updateFollowUp("baseline", event.target.value)} rows={4} placeholder="Ce qui existait au départ, ce qui fonctionne maintenant, ce qui reste fragile." className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[#e5e9e8] outline-none placeholder:text-[#8da0aa] focus-visible:border-[#b9ccd4]/45 focus-visible:ring-2 focus-visible:ring-[#d6e3e8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1117]" />
              </label>
              <label>
                <span className="text-xs font-medium text-[#9dadb4]">À 30 jours</span>
                <textarea value={followUp.day30} onChange={(event) => updateFollowUp("day30", event.target.value)} rows={5} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[#e5e9e8] outline-none focus-visible:border-[#b9ccd4]/45 focus-visible:ring-2 focus-visible:ring-[#d6e3e8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1117]" />
              </label>
              <label>
                <span className="text-xs font-medium text-[#9dadb4]">À 60 jours</span>
                <textarea value={followUp.day60} onChange={(event) => updateFollowUp("day60", event.target.value)} rows={5} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[#e5e9e8] outline-none focus-visible:border-[#b9ccd4]/45 focus-visible:ring-2 focus-visible:ring-[#d6e3e8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1117]" />
              </label>
              <label>
                <span className="text-xs font-medium text-[#9dadb4]">À 90 jours</span>
                <textarea value={followUp.day90} onChange={(event) => updateFollowUp("day90", event.target.value)} rows={5} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[#e5e9e8] outline-none focus-visible:border-[#b9ccd4]/45 focus-visible:ring-2 focus-visible:ring-[#d6e3e8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1117]" />
              </label>
              <label>
                <span className="text-xs font-medium text-[#9dadb4]">Métriques utiles</span>
                <textarea value={followUp.metrics} onChange={(event) => updateFollowUp("metrics", event.target.value)} rows={5} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[#e5e9e8] outline-none focus-visible:border-[#b9ccd4]/45 focus-visible:ring-2 focus-visible:ring-[#d6e3e8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1117]" />
              </label>
              <label className="sm:col-span-2">
                <span className="text-xs font-medium text-[#9dadb4]">Observations, erreurs et patterns candidats</span>
                <textarea value={followUp.observations} onChange={(event) => updateFollowUp("observations", event.target.value)} rows={5} placeholder="Ce qui s'est répété, ce qui a échoué, l'hypothèse de cause et la preuve encore nécessaire." className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-[#e5e9e8] outline-none placeholder:text-[#8da0aa] focus-visible:border-[#b9ccd4]/45 focus-visible:ring-2 focus-visible:ring-[#d6e3e8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1117]" />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={exportFollowUp} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#e5eceb] px-5 text-sm font-semibold text-[#172027] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                <Download className="h-4 w-4" /> Télécharger le suivi personnalisé
              </button>
              <button
                onClick={resetProgress}
                disabled={!hasHydrated || pendingTaskIds.length > 0 || syncState === "saving" || isResetting}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 px-5 text-sm font-medium text-[#8799a2] transition hover:border-white/20 hover:text-[#ced7da] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <RotateCcw className="h-4 w-4" /> Réinitialiser partout
              </button>
            </div>
          </div>
        </section>

        <aside className="border-t border-white/[0.08] px-4 py-8 lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:px-6 lg:py-8">
          <div className="flex items-center gap-3">
            <UserRound className="h-4 w-4 text-[#9cadb5]" strokeWidth={1.5} />
            <h2 className="text-sm font-semibold text-[#e7e9e5]">Personnalisation</h2>
          </div>
          <p className="mt-3 text-xs leading-6 text-[#6f848f]">Ces informations remplissent le document exporté. Elles restent dans ce navigateur.</p>

          <div className="mt-6 space-y-4">
            {[
              ["name", "Prénom ou nom", profile.name],
              ["company", "Entreprise", profile.company],
              ["project", "Projet", profile.project],
              ["siteUrl", "URL du site", profile.siteUrl],
            ].map(([key, label, value]) => (
              <label key={key} className="block">
                <span className="text-[11px] font-medium text-[#81949e]">{label}</span>
                <input value={value} onChange={(event) => updateProfile(key as keyof WorkspaceProfile, event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-[#e4e8e7] outline-none focus-visible:border-[#b6c9d1]/45 focus-visible:ring-2 focus-visible:ring-[#d6e3e8]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1117]" />
              </label>
            ))}
          </div>

          <div className="mt-7 hidden border-t border-white/[0.08] pt-6 lg:block">
            <p className="text-[11px] font-medium text-[#81949e]">Parcours</p>
            <div className="mt-3">
              <TrackSelector
                value={profile.track}
                onChange={(track) => setProfile((current) => ({ ...current, track }))}
              />
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-[#b9ccd4]/15 bg-[#c4d4d8]/[0.05] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8198a4]">Règle</p>
            <p className="mt-2 text-xs leading-6 text-[#aebcc2]">Une case cochée signifie qu'une preuve existe. Elle ne remplace pas la revue du palier.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
