"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Clipboard, Image as ImageIcon, KeyRound, MoreHorizontal, RefreshCw, ShieldAlert, X } from "lucide-react";
import { AGENT_PERMISSION_VALUES, type AgentPermission } from "@/lib/adminAgent/types";
import { animateAppElement } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
import { cn } from "@/lib/utils";
import {
  createAgentTokenAction,
  decideAgentRequestAction,
  loadAgentViewAction,
  revokeAgentTokenAction,
  setAgentModeAction,
  updateAgentPermissionsAction,
} from "./actions";
import type { AgentRequestView, AgentTokenView, AgentViewData } from "./types";

function AgentThumbnail({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="grid h-full place-items-center bg-black/40 text-white/40" aria-hidden="true"><ImageIcon size={24} /></span>;
  return <img src={src} alt="Miniature de la vidéo" className="h-full w-full object-cover" onError={() => setFailed(true)} />;
}

const permissionCopy: Record<AgentPermission, { label: string; description: string }> = {
  liste_blocs: { label: "Parcourir le programme", description: "Voir les blocs et les chapitres disponibles." },
  envoyer_video: { label: "Envoyer une vidéo", description: "Transférer une vidéo pour qu'elle soit préparée." },
  lister_videos: { label: "Suivre les vidéos", description: "Voir les vidéos et leur état d'avancement." },
  lire_transcription: { label: "Lire le texte d'une vidéo", description: "Consulter les extraits horodatés d'une vidéo." },
  ecrire_chapitres: { label: "Modifier les chapitres", description: "Enregistrer les repères qui structurent une vidéo." },
  ecrire_resume: { label: "Modifier le résumé", description: "Préparer le texte qui accompagne une vidéo." },
  deposer_sous_titres: { label: "Ajouter des sous-titres", description: "Ajouter un fichier de sous-titres à une vidéo." },
  choisir_miniature: { label: "Choisir une image de vidéo", description: "Choisir l'image d'un instant précis de la vidéo." },
  deposer_miniature: { label: "Ajouter une miniature", description: "Ajouter une image JPEG, PNG ou WebP au format 16:9." },
  demander_publication: { label: "Préparer une publication", description: "Préparer une demande que tu valides avant sa mise en ligne." },
  synchroniser_video: { label: "Actualiser une vidéo", description: "Récupérer l'état et les sous-titres d'une vidéo." },
  preparer_mail: { label: "Préparer un message", description: "Préparer un message qui attend toujours ton accord." },
  lister_nouveautes: { label: "Consulter les nouveautés", description: "Voir les publications récentes et les propositions en attente." },
  preparer_nouveaute: { label: "Préparer une nouveauté", description: "Préparer une publication avec sa miniature, sans la publier." },
  statut_video: { label: "Consulter l'état d'une vidéo", description: "Voir ce qui est prêt ou encore manquant." },
  journal: { label: "Consulter l'historique", description: "Voir les actions réalisées avec ce jeton." },
};

const PREPARE_PERMISSIONS: AgentPermission[] = [...AGENT_PERMISSION_VALUES];
const READ_ONLY_PERMISSIONS: AgentPermission[] = ["liste_blocs", "lister_videos", "lire_transcription", "lister_nouveautes", "statut_video", "journal"];

const DEMO_AGENT_DATA: AgentViewData = {
  mode: "prepare",
  requests: [
    {
      id: "demo-request-1",
      kind: "publication",
      createdAt: "2026-10-24T09:20:00.000Z",
      expiresAt: "2026-10-26T09:20:00.000Z",
      videoPreview: {
        id: "123e4567-e89b-42d3-a456-426614174000",
        title: "BUILD - Bloc 1 - Vidéo 1",
        locationLabel: "Bloc 1",
        position: 1,
        durationSeconds: 372,
        thumbnailUrl: "/images/og-image.png",
        steps: { summary: true, chapters: true, thumbnail: true, transcript: false },
        reviewUrl: "/admin#/videos?videoId=123e4567-e89b-42d3-a456-426614174000",
      },
    },
    {
      id: "demo-request-2",
      kind: "mail",
      createdAt: "2026-10-23T14:10:00.000Z",
      expiresAt: "2026-10-25T14:10:00.000Z",
      mailPreview: { subject: "La nouvelle étape de ton parcours", audience: "beginner", recipientCount: 7 },
    },
  ],
  tokens: [
    { id: "demo-access-1", name: "Préparation des vidéos", lastFour: "7F2A", permissions: [...PREPARE_PERMISSIONS], expiresAt: "2027-01-22T09:00:00.000Z", lastUsedAt: "2026-10-24T09:18:00.000Z", revokedAt: null, createdAt: "2026-10-01T09:00:00.000Z" },
    { id: "demo-access-2", name: "Lecture seule", lastFour: "19C4", permissions: ["liste_blocs", "lister_videos", "statut_video", "journal"], expiresAt: "2027-02-01T09:00:00.000Z", lastUsedAt: "2026-10-20T11:30:00.000Z", revokedAt: null, createdAt: "2026-09-01T09:00:00.000Z" },
    { id: "demo-access-3", name: "Ancien accès", lastFour: "0B91", permissions: ["liste_blocs", "journal"], expiresAt: "2026-08-01T09:00:00.000Z", lastUsedAt: null, revokedAt: "2026-08-12T08:00:00.000Z", createdAt: "2026-07-01T09:00:00.000Z" },
  ],
  journal: [
    { id: "demo-log-1", action: "agent.demander_publication", result: "pending", createdAt: "2026-10-24T09:20:00.000Z" },
    { id: "demo-log-2", action: "agent.ecrire_resume", result: "completed", createdAt: "2026-10-24T09:15:00.000Z" },
    { id: "demo-log-3", action: "agent.ecrire_chapitres", result: "completed", createdAt: "2026-10-24T09:12:00.000Z" },
    { id: "demo-log-4", action: "agent.synchroniser_video", result: "completed", createdAt: "2026-10-23T14:00:00.000Z" },
    { id: "demo-log-5", action: "agent.request_refuse", result: "refused", createdAt: "2026-10-22T10:00:00.000Z" },
  ],
};


const clients = ["Claude Code", "Codex", "Hermes Agent", "Oh My Pi", "Cursor"] as const;
type ClientName = (typeof clients)[number];
const endpoint = "https://build.example/api/agent/mcp";
const snippets: Record<ClientName, string> = {
  "Claude Code": `claude mcp add --transport http build-admin ${endpoint} \\\n  --header "Authorization: Bearer $BUILD_AGENT_TOKEN"`,
  Codex: `[mcp_servers.build_admin]\nurl = "${endpoint}"\nbearer_token_env_var = "BUILD_AGENT_TOKEN"`,
  "Hermes Agent": `mcp_servers:\n  build-admin:\n    url: "${endpoint}"\n    headers:\n      Authorization: "Bearer \${BUILD_AGENT_TOKEN}"`,
  "Oh My Pi": `{\n  "mcpServers": {\n    "build-admin": {\n      "type": "http",\n      "url": "${endpoint}",\n      "headers": { "Authorization": "Bearer \${BUILD_AGENT_TOKEN}" }\n    }\n  }\n}`,
  Cursor: `{\n  "mcpServers": {\n    "build-admin": {\n      "url": "${endpoint}",\n      "headers": { "Authorization": "Bearer \${env:BUILD_AGENT_TOKEN}" }\n    }\n  }\n}`,
};

const journalLabels: Record<string, string> = {
  "agent.liste_blocs": "Ton agent a lu la liste des blocs.",
  "agent.lister_videos": "Ton agent a consulté la liste des vidéos.",
  "agent.lister_nouveautes": "Ton agent a consulté les nouveautés.",
  "agent.envoyer_video": "Ton agent a préparé l'envoi d'une vidéo.",
  "agent.lire_transcription": "Ton agent a lu des extraits de transcription.",
  "agent.ecrire_chapitres": "Ton agent a écrit les chapitres.",
  "agent.ecrire_resume": "Ton agent a écrit le résumé.",
  "agent.choisir_miniature": "Ton agent a choisi une image de vidéo.",
  "agent.deposer_miniature": "Ton agent a déposé une miniature personnalisée.",
  "agent.demander_publication": "Ton agent a demandé une publication.",
  "agent.synchroniser_video": "Ton agent a synchronisé une vidéo.",
  "agent.deposer_sous_titres": "Ton agent a ajouté des sous-titres.",
  "agent.preparer_mail": "Ton agent a préparé un mail.",
  "agent.preparer_nouveaute": "Ton agent a préparé une nouveauté.",
  "agent.statut_video": "Ton agent a consulté le statut d'une vidéo.",
  "agent.journal": "Ton agent a consulté son journal.",
  "agent.request_create": "Ton agent a créé une demande.",
  "agent.request_approve": "Tu as validé une demande de l'agent.",
  "agent.request_refuse": "Tu as refusé une demande de l'agent.",
  "agent.request_expire": "Une demande de l'agent a expiré.",
  "agent.token_create": "Tu as créé un accès.",
  "agent.token_revoke": "Tu as révoqué un accès.",
  "agent.permissions_update": "Tu as modifié les permissions d'un accès.",
  "agent.mode_update": "Tu as modifié le mode de l'agent.",
};

function dateLabel(value: string | null) {
  if (!value) return "Jamais";
  return new Date(value).toLocaleString("fr-FR", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function tokenState(token: AgentTokenView) {
  if (token.revokedAt) return "Révoqué";
  if (Date.parse(token.expiresAt) <= Date.now()) return "Expiré";
  return "Actif";
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className="ag-switch adm-switch"><span className="ag-switch-track adm-switch-track" aria-hidden="true" /></button>;
}

const permissionGroups: Array<{ label: string; permissions: AgentPermission[] }> = [
  { label: "Lire", permissions: ["liste_blocs", "lister_videos", "lire_transcription", "lister_nouveautes", "statut_video", "journal"] },
  { label: "Vidéos", permissions: ["envoyer_video", "synchroniser_video", "choisir_miniature", "deposer_miniature"] },
  { label: "Texte", permissions: ["ecrire_chapitres", "ecrire_resume", "deposer_sous_titres"] },
  { label: "Nouveautés", permissions: ["preparer_nouveaute"] },
  { label: "Publication", permissions: ["demander_publication"] },
  { label: "Mails", permissions: ["preparer_mail"] },
];

function PermissionList({ selected, onToggle }: { selected: AgentPermission[]; onToggle: (permission: AgentPermission) => void }) {
  return <div className="ag-permission-groups">{permissionGroups.map((group) => <fieldset className="ag-permission-group" key={group.label}><legend>{group.label}</legend><div>{group.permissions.map((permission) => {
    const copy = permissionCopy[permission];
    return <div className="ag-permission-row" key={permission}><span><b>{copy.label}</b><small>{copy.description}</small></span><Toggle checked={selected.includes(permission)} label={copy.label} onChange={() => { void playAppSound("select"); onToggle(permission); }} /></div>;
  })}</div></fieldset>)}</div>;
}

function Confirmation({ title, description, expected, confirmLabel, danger = false, onCancel, onConfirm }: { title: string; description: string; expected?: string; confirmLabel: string; danger?: boolean; onCancel: () => void; onConfirm: (confirmation?: string) => void }) {
  const [value, setValue] = useState("");
  const allowed = !expected || value === expected;
  return <div className="ag-confirm-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}><section role="dialog" aria-modal="true" aria-labelledby="agent-confirm-title" className="ag-confirm"><h3 id="agent-confirm-title">{title}</h3><p>{description}</p>{expected && <label>Écris <b>{expected}</b> pour confirmer.<input autoFocus value={value} onChange={(event) => setValue(event.target.value)} /></label>}<div className="ag-actions"><button type="button" onClick={onCancel} className="ag-button ag-button-quiet">Annuler</button><button type="button" disabled={!allowed} onClick={() => onConfirm(value)} className={danger ? "ag-button ag-button-danger" : "ag-button ag-button-primary"}>{confirmLabel}</button></div></section></div>;
}

function durationLabel(seconds: number | null) {
  if (!seconds || !Number.isFinite(seconds)) return "Durée indisponible";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.round(seconds % 60);
  return `${minutes} min ${String(remaining).padStart(2, "0")} s`;
}

function audienceLabel(audience: "all" | "free" | "beginner" | "full") {
  return { all: "tous les comptes autorisés", free: "comptes gratuits", beginner: "membres débutants", full: "membres du Coffre" }[audience];
}
function groupJournal(entries: AgentViewData["journal"]) {
  const groups = new Map<string, AgentViewData["journal"]>();
  for (const entry of entries) {
    const day = new Date(entry.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    groups.set(day, [...(groups.get(day) ?? []), entry]);
  }
  return [...groups.entries()];
}
export function AgentClient() {
  const root = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AgentViewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("Mon agent");
  const [expiresInDays, setExpiresInDays] = useState(90);
  const [newPermissions, setNewPermissions] = useState<AgentPermission[]>([...PREPARE_PERMISSIONS]);
  const [permissionDrafts, setPermissionDrafts] = useState<Record<string, AgentPermission[]>>({});
  const [freshToken, setFreshToken] = useState<string | null>(null);
  const [client, setClient] = useState<ClientName>("Claude Code");
  const [preset, setPreset] = useState<"prepare" | "read" | "custom">("prepare");
  const [openStep, setOpenStep] = useState<"create" | "link" | "mode">("create");
  const [journalOpen, setJournalOpen] = useState(false);
  const [journalPage, setJournalPage] = useState(0);
  const [accessMenuId, setAccessMenuId] = useState<string | null>(null);
  const [permissionsTokenId, setPermissionsTokenId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ type: "mode" } | { type: "revoke"; tokenId: string } | { type: "request"; request: AgentRequestView } | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const demo = process.env.NODE_ENV !== "production" && typeof window !== "undefined" && new URL(window.location.href).searchParams.get("agent-demo") === "1";
    if (demo) {
      setData(DEMO_AGENT_DATA);
      setPermissionDrafts(Object.fromEntries(DEMO_AGENT_DATA.tokens.map((token) => [token.id, token.permissions])));
      return;
    }
    const result = await loadAgentViewAction();
    if ("error" in result) { setError(result.error); setData(null); return; }
    setData(result.data);
    setPermissionDrafts(Object.fromEntries(result.data.tokens.map((token) => [token.id, token.permissions])));
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);
  useEffect(() => {
    if (!data || !root.current) return;
    animateAppElement(root.current, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], "doux");
  }, [data]);
  useEffect(() => {
    const hide = () => setFreshToken(null);
    const hideWhenBackgrounded = () => { if (document.visibilityState === "hidden") hide(); };
    document.addEventListener("visibilitychange", hideWhenBackgrounded);
    window.addEventListener("hashchange", hide);
    return () => {
      document.removeEventListener("visibilitychange", hideWhenBackgrounded);
      window.removeEventListener("hashchange", hide);
    };
  }, []);

  const mutation = useCallback(async <T,>(work: () => Promise<{ ok: true; data: T } | { ok: false; error: string }>, after?: (value: T) => void) => {
    setBusy(true); setError(null);
    const demo = process.env.NODE_ENV !== "production" && typeof window !== "undefined" && new URL(window.location.href).searchParams.get("agent-demo") === "1";
    if (demo) {
      setBusy(false);
      after?.("btv_agt_demo_once_only" as T);
      await load();
      return true;
    }
    const result = await work();
    setBusy(false);
    if ("error" in result) { setError(result.error); void playAppSound("error"); return false; }
    after?.(result.data);
    await load();
    void playAppSound("confirm");
    return true;
  }, [load]);

  const toggle = (values: AgentPermission[], permission: AgentPermission) => values.includes(permission) ? values.filter((value) => value !== permission) : [...values, permission];
  const requestCount = data?.requests.length ?? 0;
  const activeTokens = useMemo(() => data?.tokens.filter((token) => tokenState(token) === "Actif") ?? [], [data]);
  const archivedTokens = useMemo(() => data?.tokens.filter((token) => tokenState(token) !== "Actif") ?? [], [data]);
  const journalPreviewGroups = useMemo(() => groupJournal((data?.journal ?? []).slice(0, 6)), [data]);
  const journalPageCount = Math.max(1, Math.ceil((data?.journal.length ?? 0) / 20));
  const journalPageGroups = useMemo(() => groupJournal(data?.journal.slice(journalPage * 20, (journalPage + 1) * 20) ?? []), [data?.journal, journalPage]);
  const permissionsToken = data?.tokens.find((token) => token.id === permissionsTokenId) ?? null;

  if (!data && !error) return <div className="grid gap-5" aria-busy="true" aria-label="Chargement de la vue Agent"><div className="h-24 animate-pulse rounded-3xl bg-white/5" /><div className="h-72 animate-pulse rounded-3xl bg-white/5" /><div className="h-56 animate-pulse rounded-3xl bg-white/5" /></div>;
  if (!data) return <section className="rounded-3xl border border-red-400/25 bg-red-500/10 p-6" role="alert"><h2 className="text-lg font-semibold text-white">La vue Agent ne s'est pas chargée.</h2><p className="mt-2 text-sm text-white/65">{error}</p><button type="button" onClick={() => void load()} className="adm-ghost-button mt-5"><RefreshCw size={16} />Réessayer</button></section>;

  return <div ref={root} className="ag-shell">
    <header className="ag-header">
      <div><h2>Ton agent</h2><p>Prépare, puis garde la main sur chaque publication.</p></div>
      {requestCount > 0 && <span className="ag-count">{requestCount} à valider</span>}
    </header>

    {error && <p className="ag-alert" role="alert"><ShieldAlert size={18} />{error}</p>}

    {requestCount > 0 && <section className="ag-panel ag-requests" aria-labelledby="agent-requests-title">
      <div className="ag-section-heading"><div><h3 id="agent-requests-title">À valider</h3><p>Une action attend ton accord.</p></div></div>
      <ul className="ag-request-list">{data.requests.map((request) => <li className="ag-request" key={request.id}>
        <div className="ag-request-copy"><h4>{request.kind === "publication" ? "Publication vidéo" : request.kind === "nouveaute" ? "Nouvelle publication" : "Message"}</h4><time dateTime={request.createdAt}>{dateLabel(request.createdAt)}</time>
          {request.videoPreview ? <details className="ag-request-detail"><summary>Voir l'aperçu</summary><div className="ag-request-preview"><div className="ag-request-thumb">{request.videoPreview.thumbnailUrl ? <AgentThumbnail src={request.videoPreview.thumbnailUrl} /> : <span>Miniature indisponible</span>}</div><div><b>{request.videoPreview.title}</b><p>{request.videoPreview.locationLabel}, épisode {request.videoPreview.position}, {durationLabel(request.videoPreview.durationSeconds)}</p><a href={request.videoPreview.reviewUrl}>Relire dans Vidéos</a></div></div></details> : null}
          {request.mailPreview ? <details className="ag-request-detail"><summary>Voir le message</summary><div className="ag-request-preview"><div><b>{request.mailPreview.subject}</b><p>{request.mailPreview.recipientCount === null ? "Destinataires inconnus" : `${request.mailPreview.recipientCount} destinataire${request.mailPreview.recipientCount > 1 ? "s" : ""}`}, {audienceLabel(request.mailPreview.audience)}</p></div></div></details> : null}
        </div>
        <div className="ag-actions"><button type="button" disabled={busy} className="ag-button ag-button-quiet" onClick={() => void mutation(() => decideAgentRequestAction(request.id, "refuse"))}>Refuser</button><button type="button" disabled={busy} className="ag-button ag-button-primary" onClick={() => { setConfirm({ type: "request", request }); void playAppSound("open"); }}>Valider</button></div>
      </li>)}</ul>
    </section>}

    <section className="ag-panel ag-setup" aria-labelledby="agent-setup-title">
      <div className="ag-section-heading"><div><h3 id="agent-setup-title">Configurer ton agent</h3><p>Trois étapes, une seule ouverte à la fois.</p></div></div>
      <div className="ag-step-list">
        <button type="button" className={cn("ag-step-trigger", openStep === "create" && "is-open")} aria-expanded={openStep === "create"} onClick={() => setOpenStep("create")}><span className="ag-step-number">1</span><span><b>Créer un accès</b><small>Nom, durée et permissions</small></span><span aria-hidden="true">⌄</span></button>
        {openStep === "create" && <div className="ag-step-body">
          <div className="ag-form-row"><label className="ag-label">Nom<input value={name} maxLength={80} onChange={(event) => setName(event.target.value)} /></label><label className="ag-label">Durée<select value={expiresInDays} onChange={(event) => setExpiresInDays(Number(event.target.value))}><option value={30}>30 jours</option><option value={90}>90 jours</option><option value={180}>180 jours</option><option value={365}>365 jours</option></select></label></div>
          <div className="ag-presets" role="group" aria-label="Choisir un niveau d'accès"><button type="button" className={cn("ag-preset", preset === "prepare" && "is-selected")} onClick={() => { setPreset("prepare"); setNewPermissions(PREPARE_PERMISSIONS); }}><b>Préparer</b><small>Tu valides</small></button><button type="button" className={cn("ag-preset", preset === "read" && "is-selected")} onClick={() => { setPreset("read"); setNewPermissions(READ_ONLY_PERMISSIONS); }}><b>Lecture seule</b><small>Rien modifier</small></button><button type="button" className={cn("ag-preset", preset === "custom" && "is-selected")} onClick={() => setPreset("custom")}><b>Personnalisé</b><small>Choisir les droits</small></button></div>
          <details className="ag-details"><summary>Voir les permissions</summary><PermissionList selected={newPermissions} onToggle={(permission) => { setPreset("custom"); setNewPermissions((current) => toggle(current, permission)); }} /></details>
          <button type="button" disabled={busy || !name.trim()} onClick={() => void mutation(() => createAgentTokenAction({ name, permissions: newPermissions, expiresInDays }), ({ token }) => setFreshToken(token))} className="ag-button ag-button-primary ag-main-action"><KeyRound size={17} />Créer cet accès</button>
          {freshToken && <div className="ag-secret" role="status"><p className="ag-secret-title">Accès créé</p><code>{freshToken}</code><div className="ag-actions"><button type="button" className="ag-button ag-button-quiet" onClick={() => { void navigator.clipboard.writeText(freshToken); void playAppSound("confirm"); }}><Clipboard size={16} />Copier</button><button type="button" className="ag-button ag-button-quiet" onClick={() => setFreshToken(null)}>Fermer</button></div></div>}
        </div>}

        <button type="button" className={cn("ag-step-trigger", openStep === "link" && "is-open")} aria-expanded={openStep === "link"} onClick={() => setOpenStep("link")}><span className="ag-step-number">2</span><span><b>Relier ton outil</b><small>Copier la configuration</small></span><span aria-hidden="true">⌄</span></button>
        {openStep === "link" && <div className="ag-step-body">{activeTokens.length > 0 || freshToken ? <><div className="ag-tabs" role="tablist" aria-label="Choisir un outil">{clients.map((item) => <button key={item} type="button" role="tab" aria-selected={client === item} onClick={() => setClient(item)}>{item}</button>)}</div><div className="ag-link-actions"><button type="button" className="ag-button ag-button-primary" onClick={() => { void navigator.clipboard.writeText(snippets[client]); void playAppSound("confirm"); }}><Clipboard size={16} />Copier</button><details className="ag-details ag-example"><summary>Voir l'exemple</summary><pre className="ag-code" tabIndex={0}><code>{snippets[client]}</code></pre></details></div><details className="ag-details ag-technical"><summary>Voir les détails</summary><p>Adresse : <code>{endpoint}</code>. Secret : <code>BUILD_AGENT_TOKEN</code>.</p></details></> : <p className="ag-empty">Crée d'abord un accès.</p>}</div>}

        <button type="button" className={cn("ag-step-trigger", openStep === "mode" && "is-open")} aria-expanded={openStep === "mode"} onClick={() => setOpenStep("mode")}><span className="ag-step-number">3</span><span><b>Mode de publication</b><small>{data.mode === "prepare" ? "Tu valides chaque sortie" : "Publication automatique"}</small></span><span aria-hidden="true">⌄</span></button>
        {openStep === "mode" && <div className="ag-step-body"><div className="ag-segmented" role="group" aria-label="Mode de publication"><button type="button" aria-pressed={data.mode === "prepare"} disabled={busy} onClick={() => { if (data.mode !== "prepare") void mutation(() => setAgentModeAction("prepare")); }}>Tu valides</button><button type="button" aria-pressed={data.mode === "autopublish"} disabled={busy} onClick={() => { if (data.mode !== "autopublish") { setConfirm({ type: "mode" }); void playAppSound("open"); } }}>Il publie seul</button></div><p className="ag-note">Les messages restent soumis à ton accord.</p></div>}
      </div>
    </section>

    <div className="ag-grid">
      <section className="ag-panel" aria-labelledby="agent-tokens-title">
        <div className="ag-section-heading ag-heading-row"><div><h3 id="agent-tokens-title">Tes accès</h3><p>{activeTokens.length} actif{activeTokens.length > 1 ? "s" : ""}</p></div><button type="button" className="ag-button ag-button-quiet" onClick={() => void load()} aria-label="Actualiser les accès"><RefreshCw size={16} /></button></div>
        {activeTokens.length === 0 && archivedTokens.length === 0 ? <p className="ag-empty">Aucun accès pour l'instant.</p> : <><ul className="ag-access-list">{activeTokens.map((token) => { const selected = permissionDrafts[token.id] ?? token.permissions; return <li className="ag-access" key={token.id}><div className="ag-access-top"><div><h4>{token.name}</h4><p className="ag-mono">btv_agt_xxxx{token.lastFour}</p></div><span className="ag-status is-active">Actif</span><button type="button" className="ag-menu-trigger" aria-label={`Actions pour ${token.name}`} aria-expanded={accessMenuId === token.id} onClick={() => setAccessMenuId(accessMenuId === token.id ? null : token.id)}><MoreHorizontal size={19} /></button>{accessMenuId === token.id && <div className="ag-access-menu" role="menu"><button type="button" role="menuitem" onClick={() => { setPermissionsTokenId(token.id); setAccessMenuId(null); }}>Permissions</button><button type="button" role="menuitem" onClick={() => { setConfirm({ type: "revoke", tokenId: token.id }); setAccessMenuId(null); void playAppSound("open"); }}>Révoquer</button></div>}</div><p className="ag-access-meta">Dernière utilisation : {dateLabel(token.lastUsedAt)}</p><p className="ag-access-meta">Expire le {dateLabel(token.expiresAt)}</p><span className="ag-permission-count">{selected.length} permission{selected.length > 1 ? "s" : ""}</span></li>; })}</ul>{archivedTokens.length > 0 && <details className="ag-archived"><summary>Anciens accès ({archivedTokens.length})</summary><ul className="ag-access-list">{archivedTokens.map((token) => <li className="ag-access is-muted" key={token.id}><div className="ag-access-top"><div><h4>{token.name}</h4><p className="ag-mono">btv_agt_xxxx{token.lastFour}</p></div><span className="ag-status">{tokenState(token)}</span></div><p className="ag-access-meta">Dernière utilisation : {dateLabel(token.lastUsedAt)}</p></li>)}</ul></details>}</>}
      </section>

      <section className="ag-panel ag-journal-panel" aria-labelledby="agent-journal-title"><div className="ag-section-heading ag-heading-row"><div><h3 id="agent-journal-title">Journal</h3><p>Les 6 dernières actions.</p></div>{data.journal.length > 6 && <button type="button" className="ag-button ag-button-quiet" onClick={() => { setJournalPage(0); setJournalOpen(true); }}>Voir tout ({data.journal.length})</button>}</div>{data.journal.length === 0 ? <p className="ag-empty">Ton agent n'a encore rien fait.</p> : <div className="ag-journal">{journalPreviewGroups.map(([day, entries]) => <section className="ag-journal-day" key={day}><h4>{day}</h4><ul>{entries.map((entry) => <li key={entry.id}><time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</time><span>{journalLabels[entry.action]?.replace(/^Ton agent a /, "").replace(/\.$/, "") ?? "Action enregistrée"}</span><b>{entry.result === "pending" ? "À valider" : entry.result === "refused" ? "Refusé" : entry.result === "failed" ? "Erreur" : "Fait"}</b></li>)}</ul></section>)}</div>}</section>
    </div>

    {journalOpen && <div className="ag-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setJournalOpen(false); }}><section className="ag-dialog" role="dialog" aria-modal="true" aria-labelledby="agent-journal-dialog-title"><div className="ag-dialog-head"><h3 id="agent-journal-dialog-title">Journal complet</h3><button type="button" className="ag-icon-button" aria-label="Fermer le journal" onClick={() => setJournalOpen(false)}><X size={18} /></button></div><div className="ag-dialog-list">{journalPageGroups.map(([day, entries]) => <section className="ag-journal-day" key={day}><h4>{day}</h4><ul>{entries.map((entry) => <li key={entry.id}><time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</time><span>{journalLabels[entry.action]?.replace(/^Ton agent a /, "").replace(/\.$/, "") ?? "Action enregistrée"}</span><b>{entry.result === "pending" ? "À valider" : entry.result === "refused" ? "Refusé" : entry.result === "failed" ? "Erreur" : "Fait"}</b></li>)}</ul></section>)}</div><div className="ag-pagination"><button type="button" className="ag-button ag-button-quiet" disabled={journalPage === 0} onClick={() => setJournalPage((page) => page - 1)}>Précédent</button><span>Page {journalPage + 1} sur {journalPageCount}</span><button type="button" className="ag-button ag-button-quiet" disabled={journalPage >= journalPageCount - 1} onClick={() => setJournalPage((page) => page + 1)}>Suivant</button></div></section></div>}

    {permissionsToken && <div className="ag-dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setPermissionsTokenId(null); }}><section className="ag-dialog ag-permissions-dialog" role="dialog" aria-modal="true" aria-labelledby="agent-permissions-title"><div className="ag-dialog-head"><div><h3 id="agent-permissions-title">Permissions</h3><p>{permissionsToken.name}</p></div><button type="button" className="ag-icon-button" aria-label="Fermer les permissions" onClick={() => setPermissionsTokenId(null)}><X size={18} /></button></div><PermissionList selected={permissionDrafts[permissionsToken.id] ?? permissionsToken.permissions} onToggle={(permission) => setPermissionDrafts((current) => ({ ...current, [permissionsToken.id]: toggle(current[permissionsToken.id] ?? permissionsToken.permissions, permission) }))} /><div className="ag-actions"><button type="button" className="ag-button ag-button-quiet" onClick={() => setPermissionsTokenId(null)}>Annuler</button><button type="button" className="ag-button ag-button-primary" disabled={busy} onClick={() => void mutation(() => updateAgentPermissionsAction(permissionsToken.id, permissionDrafts[permissionsToken.id] ?? permissionsToken.permissions)).then((ok) => { if (ok) setPermissionsTokenId(null); })}><Check size={16} />Enregistrer</button></div></section></div>}

    {confirm?.type === "mode" && <Confirmation title="Laisser ton agent publier seul ?" description="Il pourra publier une vidéo prête sans nouvelle demande. Les messages restent soumis à ton accord." expected="AUTORISER" confirmLabel="Autoriser" onCancel={() => setConfirm(null)} onConfirm={(value) => void mutation(() => setAgentModeAction("autopublish", value)).then((ok) => { if (ok) setConfirm(null); })} />}
    {confirm?.type === "revoke" && <Confirmation title="Révoquer cet accès ?" description="Ton agent perd l'accès immédiatement. Ce qu'il a déjà fait reste dans le journal." confirmLabel="Révoquer" danger onCancel={() => setConfirm(null)} onConfirm={() => void mutation(() => revokeAgentTokenAction(confirm.tokenId)).then((ok) => { if (ok) setConfirm(null); })} />}
    {confirm?.type === "request" && <Confirmation title={confirm.request.kind === "publication" ? "Publier cette vidéo ?" : confirm.request.kind === "nouveaute" ? "Publier cette nouveauté ?" : "Envoyer ce message ?"} description="Cette action sera effectuée maintenant. Vérifie une dernière fois avant de confirmer." expected={confirm.request.kind === "publication" || confirm.request.kind === "nouveaute" ? "PUBLIER" : "ENVOYER"} confirmLabel={confirm.request.kind === "publication" || confirm.request.kind === "nouveaute" ? "Publier" : "Envoyer"} onCancel={() => setConfirm(null)} onConfirm={(value) => void mutation(() => decideAgentRequestAction(confirm.request.id, "approve", value)).then((ok) => { if (ok) setConfirm(null); })} />}
  </div>;
}
