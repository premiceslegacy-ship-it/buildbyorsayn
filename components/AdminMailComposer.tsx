"use client";

import { AlertCircle, FileText, Mail, RefreshCw, Send, Users, Video } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { COFFRE_LABEL } from "@/lib/pricing";
import { MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS } from "@/lib/resendTransport";
import { resolveSiteOrigin } from "@/lib/siteOrigin";
import { playAppSound } from "@/lib/ui/sound";

type MailUser = { id: string; email: string; tier: string | null; inactiveForEmail: boolean };
type Audience = "selected" | "all" | "free" | "beginner" | "full";
type TemplateKey = "blank" | "video" | "update";
type SendResult = { ok: boolean; accepted?: number; total?: number; error?: string };

const AUDIENCE_LABELS: Record<Audience, string> = {
  selected: "Sélection",
  all: "Tous",
  free: "Gratuits",
  beginner: "Fondations",
  full: "Complet",
};

const TEMPLATE_LABELS: Record<TemplateKey, { label: string; icon: typeof Mail }> = {
  blank: { label: "Vide", icon: FileText },
  video: { label: "Nouvelle vidéo", icon: Video },
  update: { label: "Mise à jour BUILD", icon: RefreshCw },
};

function templateContent(key: TemplateKey, values: { videoTitle: string; videoUrl: string; updateTitle: string; updateDesc: string }) {
  if (key === "video") return {
    subject: `Nouvelle vidéo : ${values.videoTitle || "Titre de la vidéo"}`,
    preheader: "Disponible maintenant dans ta bibliothèque BUILD.",
    body: `Une nouvelle vidéo vient d'être ajoutée à BUILD.\n\n${values.videoTitle || "Titre de la vidéo"}\n\nTu peux la regarder dès maintenant depuis ton espace.`,
    ctaLabel: "Regarder la vidéo",
    ctaUrl: values.videoUrl,
  };
  if (key === "update") return {
    subject: `Mise à jour BUILD : ${values.updateTitle || "Titre de la mise à jour"}`,
    preheader: "Le contenu vient d'être mis à jour.",
    body: `BUILD vient d'être mis à jour.\n\n${values.updateTitle || "Titre de la mise à jour"}\n\n${values.updateDesc || "Décris ici ce qui a changé."}\n\nConnecte-toi pour voir les changements.`,
    ctaLabel: "Voir la mise à jour",
    ctaUrl: `${resolveSiteOrigin(process.env.NEXT_PUBLIC_APP_URL, process.env.NODE_ENV)}/dashboard`,
  };
  return { subject: "", preheader: "", body: "", ctaLabel: "", ctaUrl: "" };
}

export function AdminMailComposer({ users, dataWarning }: { users: MailUser[]; dataWarning: string | null }) {
  const [audience, setAudience] = useState<Audience>("selected");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>("blank");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDesc, setUpdateDesc] = useState("");
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const campaignRef = useRef<{ id: string; fingerprint: string } | null>(null);

  const selectedUsers = useMemo(() => users.filter((account) => selectedIds.includes(account.id)), [selectedIds, users]);
  const expectedRecipients = useMemo(() => {
    const eligible = users.filter((account) => !account.inactiveForEmail);
    if (audience === "selected") return selectedUsers.filter((account) => !account.inactiveForEmail).length;
    if (audience === "free") return eligible.filter((account) => !account.tier || account.tier === "free").length;
    return eligible.filter((account) => audience === "all" || account.tier === audience).length;
  }, [audience, selectedUsers, users]);
  const excludedInactiveCount = users.filter((account) => account.inactiveForEmail).length;

  const values = { videoTitle, videoUrl, updateTitle, updateDesc };
  const applyTemplate = (key: TemplateKey) => {
    const next = templateContent(key, values);
    setActiveTemplate(key);
    setSubject(next.subject);
    setPreheader(next.preheader);
    setBody(next.body);
    setCtaLabel(next.ctaLabel);
    setCtaUrl(next.ctaUrl);
    setConfirmation("");
    setResult(null);
    void playAppSound("select");
  };
  const refreshTemplate = () => applyTemplate(activeTemplate);

  const toggleUser = (id: string) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : current.length < MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS ? [...current, id] : current);
    void playAppSound("select");
  };

  const sendEmail = async () => {
    if (confirmation !== "ENVOYER") {
      setResult({ ok: false, error: "Écris ENVOYER pour confirmer cet envoi réel." });
      void playAppSound("error");
      return;
    }
    setIsSending(true);
    setResult(null);
    const requestPayload = { audience, selectedUserIds: selectedIds, subject, preheader, body, ctaLabel, ctaUrl };
    const fingerprint = JSON.stringify(requestPayload);
    if (!campaignRef.current || campaignRef.current.fingerprint !== fingerprint) {
      campaignRef.current = { id: crypto.randomUUID(), fingerprint };
    }
    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: campaignRef.current.id, approved: true, confirmation: "ENVOYER", ...requestPayload }),
      });
      const payload = await response.json().catch(() => ({})) as SendResult;
      const succeeded = response.ok && payload.ok;
      setResult({ ok: succeeded, ...payload });
      if (succeeded) {
        campaignRef.current = null;
        setConfirmation("");
      }
      void playAppSound(succeeded ? "confirm" : "error");
    } catch {
      setResult({ ok: false, error: "La réponse de l'envoi est indisponible. Relance la même campagne pour conserver l'idempotence." });
      void playAppSound("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="adm-section" aria-labelledby="admin-mail-title">
      {dataWarning ? <div className="adm-notice adm-notice-error" role="alert"><AlertCircle aria-hidden="true" /><p>{dataWarning}</p></div> : null}
      <div className="adm-section-heading">
        <div><h2 id="admin-mail-title">Composer un e-mail</h2><p>Prépare ton message, vérifie les destinataires, puis confirme l'envoi réel.</p></div>
        <span className="adm-recipient-count"><Users aria-hidden="true" />{expectedRecipients} destinataire{expectedRecipients > 1 ? "s" : ""}</span>
      </div>

      <div className="adm-template-tabs" role="group" aria-label="Choisir un gabarit">
        {(Object.keys(TEMPLATE_LABELS) as TemplateKey[]).map((key) => {
          const Icon = TEMPLATE_LABELS[key].icon;
          return <button type="button" key={key} aria-pressed={activeTemplate === key} onClick={() => applyTemplate(key)}><Icon aria-hidden="true" />{TEMPLATE_LABELS[key].label}</button>;
        })}
      </div>

      {activeTemplate === "video" ? (
        <div className="adm-template-fields">
          <label>Titre de la vidéo<input value={videoTitle} onChange={(event) => setVideoTitle(event.target.value)} /></label>
          <label>Lien de la vidéo<input value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://..." /></label>
          <button type="button" className="adm-ghost-button" onClick={refreshTemplate}><RefreshCw aria-hidden="true" />Appliquer</button>
        </div>
      ) : null}
      {activeTemplate === "update" ? (
        <div className="adm-template-fields">
          <label>Titre de la mise à jour<input value={updateTitle} onChange={(event) => setUpdateTitle(event.target.value)} /></label>
          <label>Description<input value={updateDesc} onChange={(event) => setUpdateDesc(event.target.value)} /></label>
          <button type="button" className="adm-ghost-button" onClick={refreshTemplate}><RefreshCw aria-hidden="true" />Appliquer</button>
        </div>
      ) : null}

      <div className="adm-mail-layout">
        <div className="adm-mail-form">
          <label>Objet<input value={subject} maxLength={160} onChange={(event) => setSubject(event.target.value)} /></label>
          <label>Préheader<input value={preheader} maxLength={200} onChange={(event) => setPreheader(event.target.value)} /></label>
          <label>Message<textarea value={body} maxLength={20000} rows={9} onChange={(event) => setBody(event.target.value)} /></label>
          <div className="adm-form-grid-two"><label>Lien du bouton<input value={ctaUrl} maxLength={2048} onChange={(event) => setCtaUrl(event.target.value)} /></label><label>Texte du bouton<input value={ctaLabel} maxLength={80} onChange={(event) => setCtaLabel(event.target.value)} /></label></div>
          <div className="adm-mail-preview" aria-label="Aperçu de l'e-mail">
            <span>BUILD</span>
            <small>{preheader || "Préheader"}</small>
            <h3>{subject || "Objet de ton e-mail"}</h3>
            {body ? body.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>) : <p>Ton message apparaîtra ici.</p>}
            {ctaLabel ? <b>{ctaLabel}</b> : null}
          </div>
        </div>

        <aside className="adm-mail-audience" aria-labelledby="mail-audience-title">
          <h3 id="mail-audience-title">Destinataires</h3>
          <div className="adm-audience-tabs" role="group" aria-label="Choisir l'audience">
            {(Object.keys(AUDIENCE_LABELS) as Audience[]).map((item) => <button type="button" key={item} aria-pressed={audience === item} onClick={() => { setAudience(item); setConfirmation(""); void playAppSound("select"); }}>{AUDIENCE_LABELS[item]}</button>)}
          </div>
          <p>{excludedInactiveCount} compte{excludedInactiveCount > 1 ? "s" : ""} gratuit{excludedInactiveCount > 1 ? "s" : ""} inactif{excludedInactiveCount > 1 ? "s" : ""} depuis plus de trois mois ne reçoivent jamais d'e-mail.</p>
          <div className="adm-recipient-list">
            {users.map((account) => <label key={account.id} data-disabled={account.inactiveForEmail || undefined}><input type="checkbox" checked={selectedIds.includes(account.id)} onChange={() => toggleUser(account.id)} disabled={account.inactiveForEmail || (!selectedIds.includes(account.id) && selectedIds.length >= MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS)} /><span>{account.email}</span><small>{account.tier === "full" ? COFFRE_LABEL : account.tier === "beginner" ? "Fondations" : "Gratuit"}</small></label>)}
          </div>
          {expectedRecipients > MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS ? <p className="adm-inline-error">La voie synchrone est limitée à {MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS} destinataires. Aucun e-mail ne sera envoyé.</p> : null}
          <label className="adm-confirm-field">Je confirme cet envoi réel. Écris <b>ENVOYER</b><input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" /></label>
          <button type="button" className="adm-primary-button" onClick={() => { void sendEmail(); }} disabled={isSending || expectedRecipients === 0 || expectedRecipients > MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS || !subject.trim() || !body.trim() || confirmation !== "ENVOYER"}><Send aria-hidden="true" />{isSending ? "Envoi en cours" : "Envoyer"}</button>
          {result ? <p className={result.ok ? "adm-success" : "adm-inline-error"} role={result.ok ? "status" : "alert"}>{result.ok ? `${result.accepted ?? 0} e-mail${(result.accepted ?? 0) > 1 ? "s" : ""} accepté${(result.accepted ?? 0) > 1 ? "s" : ""} par Resend.` : result.error ?? "L'envoi a échoué."}</p> : null}
        </aside>
      </div>
    </section>
  );
}
