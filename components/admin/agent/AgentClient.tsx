"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Clipboard, KeyRound, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";
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

const DEFAULT_NEW_TOKEN_PERMISSIONS: AgentPermission[] = [
  "liste_blocs",
  "statut_video",
  "journal",
];
const PREPARE_PERMISSIONS: AgentPermission[] = [...AGENT_PERMISSION_VALUES];
const READ_ONLY_PERMISSIONS: AgentPermission[] = ["liste_blocs", "lister_videos", "lire_transcription", "lister_nouveautes", "statut_video", "journal"];

const DEMO_AGENT_DATA: AgentViewData = {
  mode: "prepare",
  requests: [
    { id: "demo-request-1", kind: "publication", createdAt: "2026-10-24T09:20:00.000Z", expiresAt: "2026-10-26T09:20:00.000Z" },
    { id: "demo-request-2", kind: "mail", createdAt: "2026-10-23T14:10:00.000Z", expiresAt: "2026-10-25T14:10:00.000Z" },
  ],
  tokens: [
    { id: "demo-access-1", name: "Préparation des vidéos", lastFour: "7F2A", permissions: [...DEFAULT_NEW_TOKEN_PERMISSIONS], expiresAt: "2027-01-22T09:00:00.000Z", lastUsedAt: "2026-10-24T09:18:00.000Z", revokedAt: null, createdAt: "2026-10-01T09:00:00.000Z" },
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

export function AgentClient() {
  const root = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AgentViewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("Mon agent");
  const [expiresInDays, setExpiresInDays] = useState(90);
  const [newPermissions, setNewPermissions] = useState<AgentPermission[]>([...DEFAULT_NEW_TOKEN_PERMISSIONS]);
  const [permissionDrafts, setPermissionDrafts] = useState<Record<string, AgentPermission[]>>({});
  const [freshToken, setFreshToken] = useState<string | null>(null);
  const [client, setClient] = useState<ClientName>("Claude Code");
  const [preset, setPreset] = useState<"prepare" | "read" | "custom">("prepare");
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
  const journalGroups = useMemo(() => {
    const groups = new Map<string, AgentViewData["journal"]>();
    for (const entry of data?.journal ?? []) {
      const day = new Date(entry.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
      groups.set(day, [...(groups.get(day) ?? []), entry]);
    }
    return [...groups.entries()];
  }, [data]);

  if (!data && !error) return <div className="grid gap-5" aria-busy="true" aria-label="Chargement de la vue Agent"><div className="h-24 animate-pulse rounded-3xl bg-white/5" /><div className="h-72 animate-pulse rounded-3xl bg-white/5" /><div className="h-56 animate-pulse rounded-3xl bg-white/5" /></div>;
  if (!data) return <section className="rounded-3xl border border-red-400/25 bg-red-500/10 p-6" role="alert"><h2 className="text-lg font-semibold text-white">La vue Agent ne s'est pas chargée.</h2><p className="mt-2 text-sm text-white/65">{error}</p><button type="button" onClick={() => void load()} className="adm-ghost-button mt-5"><RefreshCw size={16} />Réessayer</button></section>;

  return <div ref={root} className="ag-shell">
    <header className="ag-header">
      <div><h2>Ton agent</h2><p>Prépare tes vidéos et tes messages, puis garde la main sur chaque publication.</p></div>
      {requestCount > 0 && <span className="ag-count">{requestCount} à valider</span>}
    </header>

    {error && <p className="ag-alert" role="alert"><ShieldAlert size={18} />{error}</p>}

    {requestCount > 0 && <section className="ag-panel ag-requests" aria-labelledby="agent-requests-title">
      <div className="ag-section-heading"><div><h3 id="agent-requests-title">À valider</h3><p>Une action attend ton accord.</p></div></div>
      <ul className="ag-request-list">{data.requests.map((request) => <li className="ag-request" key={request.id}><div className="min-w-0"><h4>{request.kind === "publication" ? "Préparer cette publication ?" : request.kind === "nouveaute" ? "Préparer cette nouveauté ?" : "Préparer cet envoi ?"}</h4><p>{request.kind === "publication" ? "Vérifie le contenu, puis autorise la mise en ligne." : request.kind === "nouveaute" ? "Vérifie l'aperçu membre, puis valide sa publication." : "Vérifie le message, puis autorise l'envoi."}</p>{request.kind === "nouveaute" && request.preview ? <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 sm:grid-cols-[180px_minmax(0,1fr)]"><img src={request.preview.thumbnail} alt="" className="aspect-video w-full rounded-xl object-cover" /><div className="min-w-0"><p className="text-xs font-medium uppercase tracking-[.14em] text-white/50">{request.preview.blocLabel ?? "Nouveauté BUILD"}</p><h5 className="mt-1 text-base font-semibold text-white">{request.preview.title}</h5><p className="mt-1 text-sm leading-5 text-white/70">{request.preview.sentence}</p>{request.preview.internalUrl ? <p className="mt-2 truncate text-xs text-white/45">{request.preview.internalUrl}</p> : null}<time className="mt-2 block text-xs text-white/45" dateTime={request.preview.publishedAt}>{dateLabel(request.preview.publishedAt)}</time></div></div> : null}<time dateTime={request.createdAt}>{dateLabel(request.createdAt)}</time></div><div className="ag-actions"><button type="button" disabled={busy} className="ag-button ag-button-quiet" onClick={() => void mutation(() => decideAgentRequestAction(request.id, "refuse"))}>Refuser</button><button type="button" disabled={busy} className="ag-button ag-button-primary" onClick={() => { setConfirm({ type: "request", request }); void playAppSound("open"); }}>Valider</button></div></li>)}</ul>
    </section>}

    <div className="ag-grid">
      <section className="ag-panel" aria-labelledby="agent-access-title">
        <div className="ag-section-heading"><div><div className="ag-step-title"><span className="ag-step-number">1</span><h3 id="agent-access-title">Créer un accès</h3></div><p>Choisis ce que ton agent peut faire. Tu peux modifier ces choix plus tard.</p></div></div>
        <div className="ag-inset">
        <label className="ag-label">Nom de l'accès<input value={name} maxLength={80} onChange={(event) => setName(event.target.value)} /></label>
        <label className="ag-label">Durée<select value={expiresInDays} onChange={(event) => setExpiresInDays(Number(event.target.value))}><option value={30}>30 jours</option><option value={90}>90 jours</option><option value={180}>180 jours</option><option value={365}>365 jours</option></select></label>
        <div className="ag-presets" role="group" aria-label="Choisir un niveau d'accès"><button type="button" className={cn("ag-preset", preset === "prepare" && "is-selected")} onClick={() => { setPreset("prepare"); setNewPermissions(PREPARE_PERMISSIONS); }}><b>Il prépare, tu valides</b><small>Ton agent prépare les éléments, tu donnes le feu vert.</small></button><button type="button" className={cn("ag-preset", preset === "read" && "is-selected")} onClick={() => { setPreset("read"); setNewPermissions(READ_ONLY_PERMISSIONS); }}><b>Lecture seule</b><small>Il consulte tes contenus sans rien modifier.</small></button><button type="button" className={cn("ag-preset", preset === "custom" && "is-selected")} onClick={() => setPreset("custom")}><b>Personnalisé</b><small>Tu choisis chaque permission.</small></button></div>
        <details className="ag-details"><summary>Voir les permissions</summary><PermissionList selected={newPermissions} onToggle={(permission) => { setPreset("custom"); setNewPermissions((current) => toggle(current, permission)); }} /></details>
        <button type="button" disabled={busy || !name.trim()} onClick={() => void mutation(() => createAgentTokenAction({ name, permissions: newPermissions, expiresInDays }), ({ token }) => setFreshToken(token))} className="ag-button ag-button-primary ag-main-action"><KeyRound size={17} />Créer cet accès</button>
        {freshToken && <div className="ag-secret" role="status"><p className="ag-secret-title">Ton accès est prêt</p><p>Copie ce secret maintenant. Il ne sera plus affiché après cette page.</p><code>{freshToken}</code><div className="ag-actions"><button type="button" className="ag-button ag-button-quiet" onClick={() => { void navigator.clipboard.writeText(freshToken); void playAppSound("confirm"); }}><Clipboard size={16} />Copier</button><button type="button" className="ag-button ag-button-quiet" onClick={() => setFreshToken(null)}>J'ai copié</button></div></div>}
        </div>
      </section>

      {activeTokens.length > 0 || freshToken ? <section className="ag-panel" aria-labelledby="agent-link-title">
        <div className="ag-section-heading"><div><div className="ag-step-title"><span className="ag-step-number">2</span><h3 id="agent-link-title">Relier ton outil</h3></div><p>Choisis ton outil et colle l'exemple dans sa configuration.</p></div></div>
        <div className="ag-tabs" role="tablist" aria-label="Choisir un outil">{clients.map((item) => <button key={item} type="button" role="tab" aria-selected={client === item} onClick={() => setClient(item)}>{item}</button>)}</div>
        <pre className="ag-code" tabIndex={0}><code>{snippets[client]}</code></pre>
        <button type="button" className="ag-button ag-button-quiet" onClick={() => { void navigator.clipboard.writeText(snippets[client]); void playAppSound("confirm"); }}><Clipboard size={16} />Copier l'exemple</button>
        <details className="ag-details ag-technical"><summary>Voir le détail technique</summary><p>Adresse de connexion : <code>{endpoint}</code>. Le secret passe dans la variable <code>BUILD_AGENT_TOKEN</code>.</p><p>Pour un autre outil compatible, utilise l'en-tête <code>Authorization: Bearer</code> avec ce secret.</p></details>
      </section> : <p className="ag-link-disabled">Crée d'abord un accès pour relier ton outil.</p>}
      <section className="ag-panel" aria-labelledby="agent-mode-title">
        <div className="ag-section-heading"><div><div className="ag-step-title"><span className="ag-step-number">3</span><h3 id="agent-mode-title">Qui publie ?</h3></div><p>Le réglage recommandé te laisse valider chaque sortie.</p></div></div>
        <div className="ag-segmented" role="group" aria-label="Mode de publication"><button type="button" aria-pressed={data.mode === "prepare"} disabled={busy} onClick={() => { if (data.mode !== "prepare") void mutation(() => setAgentModeAction("prepare")); }}>Il prépare, tu publies</button><button type="button" aria-pressed={data.mode === "autopublish"} disabled={busy} onClick={() => { if (data.mode !== "autopublish") { setConfirm({ type: "mode" }); void playAppSound("open"); } }}>Il publie seul</button></div>
        <p className="ag-note">En mode autonome, ton agent publie sans nouvelle validation. Les messages restent toujours soumis à ton accord.</p>
      </section>

      <section className="ag-panel" aria-labelledby="agent-tokens-title">
        <div className="ag-section-heading ag-heading-row"><div><h3 id="agent-tokens-title">Tes accès</h3><p>{activeTokens.length} actif{activeTokens.length > 1 ? "s" : ""}</p></div><button type="button" className="ag-button ag-button-quiet" onClick={() => void load()}><RefreshCw size={16} />Actualiser</button></div>
        {data.tokens.length === 0 ? <p className="ag-empty">Aucun accès pour l'instant.</p> : <ul className="ag-access-list">{data.tokens.map((token) => { const state = tokenState(token); const selected = permissionDrafts[token.id] ?? token.permissions; return <li className={cn("ag-access", state !== "Actif" && "is-muted")} key={token.id}><div className="ag-access-top"><div><h4>{token.name}</h4><p className="ag-mono">btv_agt_xxxx{token.lastFour}</p></div><span className="ag-status">{state}</span></div><dl><div><dt>Dernière utilisation</dt><dd>{dateLabel(token.lastUsedAt)}</dd></div><div><dt>Expiration</dt><dd>{dateLabel(token.expiresAt)}</dd></div>{token.revokedAt && <div><dt>Révoqué le</dt><dd>{dateLabel(token.revokedAt)}</dd></div>}</dl>{state === "Actif" && <><details className="ag-details"><summary>Voir les permissions</summary><PermissionList selected={selected} onToggle={(permission) => setPermissionDrafts((current) => ({ ...current, [token.id]: toggle(selected, permission) }))} /><button type="button" className="ag-button ag-button-quiet" disabled={busy} onClick={() => void mutation(() => updateAgentPermissionsAction(token.id, selected))}><Check size={16} />Enregistrer</button></details><button type="button" disabled={busy} className="ag-button ag-button-danger" onClick={() => { setConfirm({ type: "revoke", tokenId: token.id }); void playAppSound("open"); }}><Trash2 size={16} />Révoquer</button></>}</li>; })}</ul>}
      </section>
    </div>

    <section className="ag-panel" aria-labelledby="agent-journal-title"><div className="ag-section-heading"><div><h3 id="agent-journal-title">Ce que ton agent a fait</h3><p>Le journal ne contient ni secret ni contenu de message.</p></div></div>{data.journal.length === 0 ? <p className="ag-empty">Ton agent n'a encore rien fait.</p> : <div className="ag-journal">{journalGroups.map(([day, entries]) => <section className="ag-journal-day" key={day}><h4>{day}</h4><ul>{entries.map((entry) => <li key={entry.id}><time dateTime={entry.createdAt}>{new Date(entry.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</time><span>{journalLabels[entry.action] ?? "Une action de ton agent a été enregistrée."}</span><b>{entry.result === "pending" ? "À valider" : entry.result === "refused" ? "Refusé" : entry.result === "failed" ? "Erreur" : "Fait"}</b></li>)}</ul></section>)}</div>}</section>
    {confirm?.type === "mode" && <Confirmation title="Laisser ton agent publier seul ?" description="Il pourra publier une vidéo prête sans nouvelle demande. Les messages restent soumis à ton accord." expected="AUTORISER" confirmLabel="Autoriser" onCancel={() => setConfirm(null)} onConfirm={(value) => void mutation(() => setAgentModeAction("autopublish", value)).then((ok) => { if (ok) setConfirm(null); })} />}
    {confirm?.type === "revoke" && <Confirmation title="Révoquer cet accès ?" description="Ton agent perd l'accès immédiatement. Ce qu'il a déjà fait reste dans le journal." confirmLabel="Révoquer" danger onCancel={() => setConfirm(null)} onConfirm={() => void mutation(() => revokeAgentTokenAction(confirm.tokenId)).then((ok) => { if (ok) setConfirm(null); })} />}
    {confirm?.type === "request" && <Confirmation title={confirm.request.kind === "publication" ? "Publier cette vidéo ?" : confirm.request.kind === "nouveaute" ? "Publier cette nouveauté ?" : "Envoyer ce message ?"} description="Cette action sera effectuée maintenant. Vérifie une dernière fois avant de confirmer." expected={confirm.request.kind === "publication" || confirm.request.kind === "nouveaute" ? "PUBLIER" : "ENVOYER"} confirmLabel={confirm.request.kind === "publication" || confirm.request.kind === "nouveaute" ? "Publier" : "Envoyer"} onCancel={() => setConfirm(null)} onConfirm={(value) => void mutation(() => decideAgentRequestAction(confirm.request.id, "approve", value)).then((ok) => { if (ok) setConfirm(null); })} />}
  </div>;
}
