"use client";

/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Clipboard, KeyRound, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";
import { AGENT_PERMISSION_VALUES, type AgentPermission } from "@/lib/adminAgent/types";
import { toolLogoSrc } from "@/lib/tools/registry";
import { animateAppElement } from "@/lib/ui/motion";
import { playAppSound } from "@/lib/ui/sound";
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
  liste_blocs: { label: "Lire les blocs", description: "Voir le programme et les chapitres disponibles." },
  envoyer_video: { label: "Envoyer une vidéo", description: "Créer un envoi direct vers Mux." },
  ecrire_chapitres: { label: "Écrire les chapitres", description: "Enregistrer les repères de la vidéo." },
  ecrire_resume: { label: "Écrire le résumé", description: "Préparer le texte qui accompagne la vidéo." },
  choisir_miniature: { label: "Choisir la miniature", description: "Choisir une image parmi les propositions Mux." },
  demander_publication: { label: "Demander la publication", description: "Préparer une demande que tu valides." },
  preparer_mail: { label: "Préparer le mail", description: "Préparer un mail qui attend toujours ton accord." },
  statut_video: { label: "Lire le statut", description: "Voir ce qui est prêt ou encore manquant." },
  journal: { label: "Lire le journal", description: "Voir les actions réalisées avec ce jeton." },
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
  "agent.envoyer_video": "Ton agent a préparé l'envoi d'une vidéo.",
  "agent.ecrire_chapitres": "Ton agent a écrit les chapitres.",
  "agent.ecrire_resume": "Ton agent a écrit le résumé.",
  "agent.choisir_miniature": "Ton agent a choisi la miniature.",
  "agent.demander_publication": "Ton agent a demandé une publication.",
  "agent.preparer_mail": "Ton agent a préparé un mail.",
  "agent.statut_video": "Ton agent a consulté le statut d'une vidéo.",
  "agent.journal": "Ton agent a consulté son journal.",
  "agent.request_create": "Ton agent a créé une demande.",
  "agent.request_approve": "Tu as validé une demande de l'agent.",
  "agent.request_refuse": "Tu as refusé une demande de l'agent.",
  "agent.request_expire": "Une demande de l'agent a expiré.",
  "agent.token_create": "Tu as créé un jeton.",
  "agent.token_revoke": "Tu as révoqué un jeton.",
  "agent.permissions_update": "Tu as modifié les permissions d'un jeton.",
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
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-11 w-[52px] shrink-0 rounded-full border transition-colors ${checked ? "border-emerald-300/40 bg-emerald-300/25" : "border-white/15 bg-white/5"}`}><span className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} /></button>;
}

function PermissionList({ selected, onToggle }: { selected: AgentPermission[]; onToggle: (permission: AgentPermission) => void }) {
  return <ul className="divide-y divide-white/10">{AGENT_PERMISSION_VALUES.map((permission) => {
    const copy = permissionCopy[permission];
    return <li key={permission} className="flex min-h-16 items-center justify-between gap-4 py-3"><span className="min-w-0"><b className="block text-sm font-medium text-white">{copy.label}</b><span className="mt-1 block text-xs leading-5 text-white/55">{copy.description}</span></span><Toggle checked={selected.includes(permission)} label={copy.label} onChange={() => onToggle(permission)} /></li>;
  })}</ul>;
}

function Confirmation({ title, description, expected, confirmLabel, danger = false, onCancel, onConfirm }: { title: string; description: string; expected?: string; confirmLabel: string; danger?: boolean; onCancel: () => void; onConfirm: (confirmation?: string) => void }) {
  const [value, setValue] = useState("");
  const allowed = !expected || value === expected;
  return <div className="fixed inset-0 z-[100] grid place-items-end bg-black/70 p-0 sm:place-items-center sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}><section role="dialog" aria-modal="true" aria-labelledby="agent-confirm-title" className="w-full rounded-t-3xl border border-white/10 bg-[#151719] p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-7"><h3 id="agent-confirm-title" className="text-xl font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{description}</p>{expected && <label className="mt-5 block text-sm text-white/75">Saisis <b className="text-white">{expected}</b><input autoFocus value={value} onChange={(event) => setValue(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-black/25 px-3 text-white outline-none focus:border-white/45" /></label>}<div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" onClick={onCancel} className="min-h-11 rounded-full border border-white/15 px-5 text-sm text-white/80">Annuler</button><button type="button" disabled={!allowed} onClick={() => onConfirm(value)} className={`min-h-11 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "bg-red-500/20 text-red-100 ring-1 ring-red-400/35" : "bg-white text-black"}`}>{confirmLabel}</button></div></section></div>;
}

export function AgentClient() {
  const root = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AgentViewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("Mon agent");
  const [expiresInDays, setExpiresInDays] = useState(90);
  const [newPermissions, setNewPermissions] = useState<AgentPermission[]>([...AGENT_PERMISSION_VALUES]);
  const [permissionDrafts, setPermissionDrafts] = useState<Record<string, AgentPermission[]>>({});
  const [freshToken, setFreshToken] = useState<string | null>(null);
  const [client, setClient] = useState<ClientName>("Claude Code");
  const [confirm, setConfirm] = useState<{ type: "mode" } | { type: "revoke"; tokenId: string } | { type: "request"; request: AgentRequestView } | null>(null);

  const load = useCallback(async () => {
    setError(null);
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

  if (!data && !error) return <div className="grid gap-5" aria-busy="true" aria-label="Chargement de la vue Agent"><div className="h-24 animate-pulse rounded-3xl bg-white/5" /><div className="h-72 animate-pulse rounded-3xl bg-white/5" /><div className="h-56 animate-pulse rounded-3xl bg-white/5" /></div>;
  if (!data) return <section className="rounded-3xl border border-red-400/25 bg-red-500/10 p-6" role="alert"><h2 className="text-lg font-semibold text-white">La vue Agent ne s'est pas chargée.</h2><p className="mt-2 text-sm text-white/65">{error}</p><button type="button" onClick={() => void load()} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-white"><RefreshCw size={16} />Réessayer</button></section>;

  return <div ref={root} className="grid gap-12 text-[#f0ede8]">
    <header><h2 className="text-3xl font-semibold tracking-tight">Brancher un agent IA</h2><p className="mt-3 max-w-3xl text-base leading-7 text-white/60">Ton agent envoie la vidéo, écrit les chapitres, choisit la miniature et prépare le mail. Par défaut, il prépare et tu publies.</p></header>

    {error && <p className="flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-sm text-red-50" role="alert"><ShieldAlert className="mt-0.5 shrink-0" size={18} />{error}</p>}

      <section aria-labelledby="agent-requests-title"><div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h3 id="agent-requests-title" className="text-xl font-semibold">À valider</h3><p className="mt-1 text-sm text-white/45">{requestCount ? `${requestCount} demande${requestCount > 1 ? "s" : ""} de ton agent` : "Aucune demande en attente"}</p></div></div>{requestCount === 0 ? <p className="rounded-2xl bg-white/[.04] p-5 text-sm leading-6 text-white/60"><b className="text-white">Rien à valider pour l'instant.</b> Quand ton agent veut publier ou envoyer un mail, la demande arrive ici.</p> : <ul className="grid gap-3">{data.requests.map((request) => <li key={request.id} className="grid gap-4 rounded-2xl bg-white/[.055] p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center"><div><h4 className="text-lg font-semibold">{request.kind === "publication" ? "Ton agent veut publier une vidéo." : "Ton agent veut envoyer un mail."}</h4><p className="mt-2 text-sm leading-6 text-white/55">{request.kind === "publication" ? "La publication attend ton accord et la confirmation PUBLIER." : "Rien ne part sans ton accord et la confirmation ENVOYER."}</p><time className="mt-2 block text-xs text-white/35" dateTime={request.createdAt}>{dateLabel(request.createdAt)}</time></div><div className="flex flex-wrap gap-2 md:justify-end"><button type="button" disabled={busy} onClick={() => void mutation(() => decideAgentRequestAction(request.id, "refuse"))} className="min-h-11 rounded-full border border-white/15 px-5 text-sm text-white/80">Refuser</button><button type="button" disabled={busy} onClick={() => { setConfirm({ type: "request", request }); void playAppSound("open"); }} className="min-h-11 rounded-full border border-white/20 bg-white/10 px-5 text-sm font-semibold text-white">Valider</button></div></li>)}</ul>}</section>

    <div className="grid items-start gap-5 xl:grid-cols-2">
      <div className="grid gap-5">
        <section className="rounded-3xl bg-white/[.045] p-5 sm:p-6" aria-labelledby="agent-connection-title"><h3 id="agent-connection-title" className="text-xl font-semibold">Connexion</h3><label className="mt-5 block text-sm text-white/65">Adresse du MCP<input readOnly value="/api/agent/mcp" className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 font-mono text-sm text-emerald-200" /></label><button type="button" onClick={() => { void navigator.clipboard.writeText("/api/agent/mcp"); void playAppSound("confirm"); }} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm"><Clipboard size={16} />Copier l'adresse</button>
          <div className="mt-7 border-t border-white/10 pt-6"><h4 className="font-semibold">Créer un jeton</h4><div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]"><label className="text-sm text-white/65">Nom<input value={name} maxLength={80} onChange={(event) => setName(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white" /></label><label className="text-sm text-white/65">Expiration<select value={expiresInDays} onChange={(event) => setExpiresInDays(Number(event.target.value))} className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/25 px-3 text-white"><option value={30}>30 jours</option><option value={90}>90 jours</option><option value={180}>180 jours</option><option value={365}>365 jours</option></select></label></div><div className="mt-5"><PermissionList selected={newPermissions} onToggle={(permission) => { setNewPermissions((current) => toggle(current, permission)); void playAppSound("select"); }} /></div><button type="button" disabled={busy || !name.trim()} onClick={() => void mutation(() => createAgentTokenAction({ name, permissions: newPermissions, expiresInDays }), ({ token }) => setFreshToken(token))} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald-200/30 bg-emerald-300/10 px-5 text-sm font-semibold text-emerald-50 disabled:opacity-40"><KeyRound size={17} />Créer le jeton</button></div>
          {freshToken && <div className="mt-6 rounded-2xl border border-amber-200/25 bg-amber-200/10 p-4" role="status"><p className="text-sm font-semibold text-amber-50">Copie ce jeton maintenant.</p><p className="mt-1 text-sm leading-6 text-amber-50/70">Il ne sera plus affiché après avoir quitté ou masqué cette zone.</p><code className="mt-3 block overflow-wrap-anywhere rounded-xl bg-black/30 p-3 text-sm text-emerald-200">{freshToken}</code><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => { void navigator.clipboard.writeText(freshToken); void playAppSound("confirm"); }} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm"><Clipboard size={16} />Copier</button><button type="button" onClick={() => setFreshToken(null)} className="min-h-11 rounded-full border border-white/15 px-4 text-sm">J'ai copié le jeton</button></div></div>}
        </section>

        <section className="rounded-3xl bg-white/[.045] p-5 sm:p-6" aria-labelledby="agent-guide-title"><h3 id="agent-guide-title" className="text-xl font-semibold">À coller dans ton agent</h3><p className="mt-2 text-sm leading-6 text-white/55">Remplace le domaine d'exemple et garde le jeton dans la variable <code>BUILD_AGENT_TOKEN</code>.</p><div className="mt-5 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Choisir un client MCP">{clients.map((name) => <button key={name} type="button" role="tab" aria-selected={client === name} onClick={() => { setClient(name); void playAppSound("select"); }} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm ${client === name ? "border-white/30 bg-white/12 text-white" : "border-white/10 text-white/55"}`}>{toolLogoSrc(name) && <img src={toolLogoSrc(name)!} alt="" className="h-5 w-5 object-contain" />}{name}</button>)}</div><pre className="mt-3 max-w-full overflow-x-auto rounded-2xl bg-black/35 p-4 text-sm leading-6 text-emerald-200" tabIndex={0}><code>{snippets[client]}</code></pre><button type="button" onClick={() => { void navigator.clipboard.writeText(snippets[client]); void playAppSound("confirm"); }} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm"><Clipboard size={16} />Copier l'exemple</button><details className="mt-6 border-t border-white/10 pt-4 text-sm text-white/60"><summary className="min-h-11 cursor-pointer py-3 text-white/80">Commande CLI et autres clients MCP</summary><p className="mt-3 leading-6">La CLI utilise le même jeton et les mêmes permissions.</p><pre className="mt-3 overflow-x-auto rounded-xl bg-black/35 p-3 text-emerald-200"><code>{`node scripts/build-admin/build-admin.mjs login \\\n  --origin https://build.example \\\n  --token "$BUILD_AGENT_TOKEN"`}</code></pre><p className="mt-4 leading-6">Pour un autre client MCP HTTP, utilise <code>{endpoint}</code> et l'en-tête <code>Authorization: Bearer $BUILD_AGENT_TOKEN</code>.</p></details></section>
      </div>

      <div className="grid gap-5">
        <section className="rounded-3xl bg-white/[.045] p-5 sm:p-6" aria-labelledby="agent-mode-title"><h3 id="agent-mode-title" className="text-xl font-semibold">Mode de l'agent</h3><div className="mt-5 grid gap-2 rounded-2xl bg-black/20 p-1 sm:grid-cols-2" role="group" aria-label="Mode de l'agent"><button type="button" aria-pressed={data.mode === "prepare"} disabled={busy} onClick={() => { if (data.mode !== "prepare") void mutation(() => setAgentModeAction("prepare")); }} className={`min-h-11 rounded-xl px-4 text-sm ${data.mode === "prepare" ? "bg-white/15 text-white" : "text-white/50"}`}>L'agent prépare, tu publies</button><button type="button" aria-pressed={data.mode === "autopublish"} disabled={busy} onClick={() => { if (data.mode !== "autopublish") { setConfirm({ type: "mode" }); void playAppSound("open"); } }} className={`min-h-11 rounded-xl px-4 text-sm ${data.mode === "autopublish" ? "bg-white/15 text-white" : "text-white/50"}`}>L'agent publie seul</button></div><p className="mt-4 text-sm leading-6 text-white/55">Même dans le second mode, un mail attend toujours ta validation. L'agent ne change aucun palier et ne valide jamais sa propre demande.</p></section>

        <section className="rounded-3xl bg-white/[.045] p-5 sm:p-6" aria-labelledby="agent-tokens-title"><div className="flex flex-wrap items-end justify-between gap-3"><div><h3 id="agent-tokens-title" className="text-xl font-semibold">Jetons</h3><p className="mt-1 text-sm text-white/45">{activeTokens.length} actif{activeTokens.length > 1 ? "s" : ""}</p></div><button type="button" onClick={() => void load()} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm"><RefreshCw size={16} />Actualiser</button></div>{data.tokens.length === 0 ? <p className="mt-5 rounded-2xl bg-black/15 p-4 text-sm text-white/55">Aucun jeton créé.</p> : <ul className="mt-5 grid gap-4">{data.tokens.map((token) => { const state = tokenState(token); const selected = permissionDrafts[token.id] ?? token.permissions; return <li key={token.id} className="rounded-2xl border border-white/10 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h4 className="font-semibold text-white">{token.name}</h4><p className="mt-1 font-mono text-sm text-white/45">btv_agt_xxxx{token.lastFour}</p></div><span className={`rounded-full px-3 py-1 text-xs ${state === "Actif" ? "bg-emerald-300/15 text-emerald-100" : "bg-white/8 text-white/45"}`}>{state}</span></div><dl className="mt-4 grid gap-2 text-xs text-white/45 sm:grid-cols-2"><div><dt>Dernière utilisation</dt><dd className="mt-1 text-white/70">{dateLabel(token.lastUsedAt)}</dd></div><div><dt>Expiration</dt><dd className="mt-1 text-white/70">{dateLabel(token.expiresAt)}</dd></div></dl>{state === "Actif" && <details className="mt-4 border-t border-white/10 pt-3"><summary className="min-h-11 cursor-pointer py-3 text-sm text-white/75">Modifier les permissions</summary><PermissionList selected={selected} onToggle={(permission) => { setPermissionDrafts((current) => ({ ...current, [token.id]: toggle(selected, permission) })); void playAppSound("select"); }} /><div className="mt-3 flex flex-wrap justify-between gap-2"><button type="button" disabled={busy} onClick={() => setConfirm({ type: "revoke", tokenId: token.id })} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-red-300/20 px-4 text-sm text-red-100"><Trash2 size={16} />Révoquer</button><button type="button" disabled={busy} onClick={() => void mutation(() => updateAgentPermissionsAction(token.id, selected))} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm"><Check size={16} />Enregistrer</button></div></details>}</li>; })}</ul>}</section>
      </div>
    </div>

    <section aria-labelledby="agent-journal-title"><div className="mb-4"><h3 id="agent-journal-title" className="text-xl font-semibold">Ce que l'agent a fait</h3><p className="mt-1 text-sm text-white/45">Le journal ne montre aucun jeton, secret ou corps de mail.</p></div>{data.journal.length === 0 ? <p className="rounded-2xl bg-white/[.04] p-5 text-sm text-white/55"><b className="text-white">Ton agent n'a encore rien fait.</b> Ses actions apparaîtront ici.</p> : <ul className="divide-y divide-white/10 rounded-2xl bg-white/[.04] px-4">{data.journal.map((entry) => <li key={entry.id} className="grid gap-2 py-4 sm:grid-cols-[150px_minmax(0,1fr)_auto] sm:items-center sm:gap-4"><time className="text-xs text-white/35" dateTime={entry.createdAt}>{dateLabel(entry.createdAt)}</time><span className="text-sm text-white/80">{journalLabels[entry.action] ?? "Une action de l'agent a été enregistrée."}</span><span className="w-fit rounded-full bg-white/8 px-3 py-1 text-xs text-white/55">{entry.result === "completed" || entry.result === "approved" ? "Fait" : entry.result === "pending" ? "Attend ta réponse" : entry.result === "refused" ? "Refusé" : entry.result === "failed" ? "Erreur" : "Terminé"}</span></li>)}</ul>}</section>

    {confirm?.type === "mode" && <Confirmation title="Laisser l'agent publier seul ?" description="Il pourra publier une vidéo prête sans nouvelle demande. Les mails restent toujours soumis à ton accord." expected="AUTORISER" confirmLabel="Autoriser" danger onCancel={() => setConfirm(null)} onConfirm={(value) => void mutation(() => setAgentModeAction("autopublish", value)).then((ok) => { if (ok) setConfirm(null); })} />}
    {confirm?.type === "revoke" && <Confirmation title="Révoquer ce jeton ?" description="L'agent perd l'accès immédiatement. Ce qu'il a déjà fait reste dans le journal." confirmLabel="Révoquer" danger onCancel={() => setConfirm(null)} onConfirm={() => void mutation(() => revokeAgentTokenAction(confirm.tokenId)).then((ok) => { if (ok) setConfirm(null); })} />}
    {confirm?.type === "request" && <Confirmation title={confirm.request.kind === "publication" ? "Publier cette vidéo ?" : "Envoyer ce mail ?"} description={confirm.request.kind === "publication" ? "La validation exécute la publication maintenant." : "La validation exécute l'envoi maintenant. Rien ne part avant cette confirmation."} expected={confirm.request.kind === "publication" ? "PUBLIER" : "ENVOYER"} confirmLabel={confirm.request.kind === "publication" ? "Publier" : "Envoyer"} onCancel={() => setConfirm(null)} onConfirm={(value) => void mutation(() => decideAgentRequestAction(confirm.request.id, "approve", value)).then((ok) => { if (ok) setConfirm(null); })} />}
  </div>;
}
