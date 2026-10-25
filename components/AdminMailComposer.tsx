"use client";

import { AlertCircle, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MailCatalog } from "@/components/admin/MailCatalog";
import { MailPreview } from "@/components/admin/MailPreview";
import type { EmailCatalogEntry } from "@/lib/email/catalog";
import { buildBroadcastEmail, type EmailContext } from "@/lib/email/templates";
import { COFFRE_LABEL, FONDATIONS_LABEL } from "@/lib/pricing";
import { countMailRecipients, type Audience, type MailUser } from "@/lib/adminMailAudience";
import { MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS } from "@/lib/resendTransport";
import { playAppSound } from "@/lib/ui/sound";
import "./admin/mail.css";

type TemplateKey = "blank" | "video" | "update";
type PublishedVideo = {
  id: string;
  title: string;
  position: number;
  locationLabel: string;
  thumbnailUrl: string | null;
  href: string;
};
type SendResult = { ok: boolean; accepted?: number; total?: number; error?: string };
type Mode = "write" | "catalog";

const CONFIRM_WORD = "ENVOYER";

const AUDIENCE_LABELS: Record<Audience, string> = {
  all: "Tous",
  free: "Gratuits",
  beginner: FONDATIONS_LABEL,
  full: COFFRE_LABEL,
  selected: "Choisir",
};

const TEMPLATES: Record<TemplateKey, { label: string; hint: string }> = {
  blank: { label: "Libre", hint: "" },
  video: { label: "Nouvelle vidéo", hint: "" },
  update: { label: "Mise à jour", hint: "" },
};

function templateContent(key: TemplateKey, baseUrl: string | null, values: { videoTitle: string; videoUrl: string; videoThumbnailUrl: string; updateTitle: string; updateDesc: string }) {
  if (key === "video") return {
    subject: values.videoTitle || "Titre de la vidéo",
    preheader: "La vidéo est disponible dans ton espace.",
    body: "Cette vidéo est disponible dans ton espace. Tu peux la regarder quand tu veux.",
    ctaLabel: "Regarder la vidéo",
    ctaUrl: values.videoUrl,
    thumbnailUrl: values.videoThumbnailUrl,
  };
  if (key === "update") return {
    subject: values.updateTitle || "Titre de la mise à jour",
    preheader: "Le contenu vient d'être mis à jour.",
    body: `${values.updateDesc || "Décris ici ce qui a changé."}\n\nConnecte-toi pour voir ce qui a changé.`,
    ctaLabel: "Voir la mise à jour",
    ctaUrl: baseUrl ? `${baseUrl}/dashboard` : "",
    thumbnailUrl: "",
  };
  return { subject: "", preheader: "", body: "", ctaLabel: "", ctaUrl: "", thumbnailUrl: "" };
}

function readableVideoTitle(video: PublishedVideo): string {
  const title = video.title.trim();
  if (!title || /^(?:build\s*[-:]\s*)?(?:bloc|block)\s+\w+\s*[-:,]\s*(?:vid(?:é|e)o|video)\s*\d+$/i.test(title)) {
    return `${video.locationLabel}, vidéo ${video.position}`;
  }
  return title;
}

function ModeSwitch({ mode, onChange }: { mode: Mode; onChange: (mode: Mode) => void }) {
  return (
    <div className="ml-segments ml-modeswitch" role="group" aria-label="Que veux-tu faire ?">
      <button type="button" aria-pressed={mode === "write"} onClick={() => onChange("write")}>Écrire un message</button>
      <button type="button" aria-pressed={mode === "catalog"} onClick={() => onChange("catalog")}>E-mails automatiques</button>
    </div>
  );
}

function plural(count: number, one: string, many: string) {
  return count > 1 ? many : one;
}

export function AdminMailComposer({ users, dataWarning, emailContext, catalog, from, publishedVideos = [] }: { users: MailUser[]; dataWarning: string | null; emailContext: EmailContext; catalog: EmailCatalogEntry[]; from: string; publishedVideos?: PublishedVideo[] }) {
  const [mode, setMode] = useState<Mode>("write");
  const [audience, setAudience] = useState<Audience>("selected");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>("blank");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState("");
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const campaignRef = useRef<{ id: string; fingerprint: string } | null>(null);

  const expectedRecipients = useMemo(() => countMailRecipients(users, audience, selectedIds), [audience, selectedIds, users]);
  const excludedInactiveCount = users.filter((account) => account.inactiveForEmail).length;
  const ruleApplies = excludedInactiveCount > 0 && (audience === "all" || audience === "free" || audience === "selected");
  const overLimit = expectedRecipients > MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS;
  const missingContent = !subject.trim() || !body.trim();
  const canReview = !dataWarning && expectedRecipients > 0 && !overLimit && !missingContent;

  const visibleUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term ? users.filter((account) => account.email.toLowerCase().includes(term)) : users;
  }, [search, users]);

  const preview = useMemo(
    () => buildBroadcastEmail(emailContext, {
      subject: subject || "L'objet de ton e-mail",
      preheader,
      body: body || "Ton message apparaîtra ici.",
      ctaLabel,
      ctaUrl,
      thumbnailUrl,
    }),
    [emailContext, subject, preheader, body, ctaLabel, ctaUrl, thumbnailUrl],
  );

  const closeSheet = () => {
    if (isSending) return;
    setSheetOpen(false);
    setConfirmation("");
    setResult(null);
  };

  useEffect(() => {
    if (!sheetOpen && !pickerOpen && !previewOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || isSending) return;
      if (sheetOpen) {
        setSheetOpen(false);
        setConfirmation("");
        setResult(null);
      } else if (pickerOpen) {
        setPickerOpen(false);
      } else {
        setPreviewOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen, pickerOpen, previewOpen, isSending]);

  const applyTemplate = (key: TemplateKey) => {
    const next = templateContent(key, emailContext.baseUrl, { videoTitle, videoUrl, videoThumbnailUrl, updateTitle: "", updateDesc: "" });
    setActiveTemplate(key);
    setSubject(next.subject);
    setPreheader(next.preheader);
    setBody(next.body);
    setCtaLabel(next.ctaLabel);
    setCtaUrl(next.ctaUrl);
    setThumbnailUrl(next.thumbnailUrl);
    setOptionsOpen(false);
    setConfirmation("");
    setResult(null);
  };

  const selectPublishedVideo = (id: string) => {
    setSelectedVideoId(id);
    const video = publishedVideos.find((item) => item.id === id);
    if (!video) return;
    const nextTitle = readableVideoTitle(video);
    setVideoTitle(nextTitle);
    setVideoUrl(video.href);
    setVideoThumbnailUrl(video.thumbnailUrl ?? "");
    const next = templateContent("video", emailContext.baseUrl, {
      videoTitle: nextTitle,
      videoUrl: video.href,
      videoThumbnailUrl: video.thumbnailUrl ?? "",
      updateTitle: "",
      updateDesc: "",
    });
    setActiveTemplate("video");
    setSubject(next.subject);
    setPreheader(next.preheader);
    setBody(next.body);
    setCtaLabel(next.ctaLabel);
    setCtaUrl(next.ctaUrl);
    setThumbnailUrl(next.thumbnailUrl);
    setOptionsOpen(false);
    setConfirmation("");
    setResult(null);
  };

  const toggleUser = (id: string) => {
    setSelectedIds((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : current.length < MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS ? [...current, id] : current);
  };

  const sendEmail = async () => {
    if (confirmation !== CONFIRM_WORD) {
      setResult({ ok: false, error: `Écris ${CONFIRM_WORD} pour confirmer cet envoi réel.` });
      void playAppSound("error");
      return;
    }
    setIsSending(true);
    setResult(null);
    const requestPayload = { audience, selectedUserIds: selectedIds, subject, preheader, body, ctaLabel, ctaUrl, thumbnailUrl };
    const fingerprint = JSON.stringify(requestPayload);
    if (!campaignRef.current || campaignRef.current.fingerprint !== fingerprint) {
      campaignRef.current = { id: crypto.randomUUID(), fingerprint };
    }
    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: campaignRef.current.id, approved: true, confirmation: CONFIRM_WORD, ...requestPayload }),
      });
      const payload = await response.json().catch(() => ({})) as SendResult;
      const succeeded = response.ok && payload.ok;
      setResult({ ok: succeeded, ...payload });
      if (succeeded) {
        campaignRef.current = null;
        setConfirmation("");
        setSheetOpen(false);
      }
      void playAppSound(succeeded ? "confirm" : "error");
    } catch {
      setResult({ ok: false, error: "La réponse de l'envoi est indisponible. Relance la même campagne pour conserver l'idempotence." });
      void playAppSound("error");
    } finally {
      setIsSending(false);
    }
  };

  const startOver = () => {
    applyTemplate("blank");
    setSelectedIds([]);
    setSearch("");
    setAudience("all");
  };

  if (result?.ok) {
    const accepted = result.accepted ?? 0;
    return (
      <section className="ml-root ml-done" aria-labelledby="mail-done-title">
        <div role="status">
          <h2 id="mail-done-title">{accepted} e-mail{plural(accepted, "", "s")} {plural(accepted, "envoyé", "envoyés")}.</h2>
          <p>{result.total !== undefined && result.total > accepted ? `Sur ${result.total} destinataires, ${accepted} ${plural(accepted, "a été accepté", "ont été acceptés")} pour l'envoi.` : "Tes membres vont le recevoir dans quelques instants."}</p>
        </div>
        <button type="button" className="adm-ghost-button" onClick={startOver}>Écrire un autre message</button>
      </section>
    );
  }

  const excerpt = body.trim().length > 160 ? `${body.trim().slice(0, 160)}…` : body.trim();

  if (mode === "catalog") {
    return (
      <div className="ml-modes">
        <ModeSwitch mode={mode} onChange={setMode} />
        <MailCatalog entries={catalog} from={from} />
      </div>
    );
  }

  return (
    <section className="ml-root" aria-labelledby="admin-mail-title">
      <ModeSwitch mode={mode} onChange={setMode} />
      {dataWarning ? <div className="adm-notice adm-notice-error" role="alert"><AlertCircle aria-hidden="true" /><p>{dataWarning}</p></div> : null}
      <header className="ml-head">
        <h2 id="admin-mail-title">Écrire à tes membres</h2>
      </header>

      <div className="ml-layout">
        <div className="ml-flow">
          <fieldset className="ml-step" aria-label="Modèle">
            <div className="ml-templates" role="group" aria-label="Modèle de message">
              {(Object.keys(TEMPLATES) as TemplateKey[]).map((key) => (
                <button type="button" key={key} className="ml-template" aria-pressed={activeTemplate === key} onClick={() => applyTemplate(key)}>
                  <strong>{TEMPLATES[key].label}</strong>
                </button>
              ))}
            </div>
            {activeTemplate === "video" ? (
              <div className="ml-fill ml-video-picker">
                {publishedVideos.length > 0 ? (
                  <label>Vidéo publiée
                    <select value={selectedVideoId} onChange={(event) => selectPublishedVideo(event.target.value)}>
                      <option value="">Choisir une vidéo publiée</option>
                      {publishedVideos.map((video) => <option key={video.id} value={video.id}>{readableVideoTitle(video)}</option>)}
                    </select>
                  </label>
                ) : <p className="ml-note">Aucune vidéo publiée pour l'instant.</p>}
              </div>
            ) : null}
          </fieldset>

          <fieldset className="ml-step" aria-label="Message">
            <label className="ml-field">
              <span>Objet</span>
              <input aria-label="Objet de l'e-mail" value={subject} maxLength={160} onChange={(event) => setSubject(event.target.value)} />
            </label>
            <label className="ml-field">
              <span>Message <button type="button" className="ml-help" aria-label="Afficher l'aide du message" aria-expanded={helpOpen} onClick={() => setHelpOpen((open) => !open)}>?</button></span>
              <small>Une ligne vide sépare les paragraphes.</small>
              {helpOpen ? <small className="ml-help-copy">Une ligne qui commence par &gt; devient une citation. Trois tirets seuls sur une ligne tracent un séparateur.</small> : null}
              <textarea value={body} maxLength={20000} rows={8} onChange={(event) => setBody(event.target.value)} />
            </label>
            <button type="button" className="ml-disclose" aria-expanded={optionsOpen} aria-controls="ml-option-fields" onClick={() => setOptionsOpen((open) => !open)}>
              <ChevronDown aria-hidden="true" />Options
            </button>
            {optionsOpen ? (
              <div className="ml-options" id="ml-option-fields">
                <div className="ml-pair">
                  <label className="ml-field"><span>Texte du bouton</span><input value={ctaLabel} maxLength={80} onChange={(event) => setCtaLabel(event.target.value)} /></label>
                  <label className="ml-field"><span>Lien du bouton</span><input value={ctaUrl} maxLength={2048} inputMode="url" placeholder="https://..." onChange={(event) => setCtaUrl(event.target.value)} /></label>
                </div>
                <label className="ml-field">
                  <span>Aperçu dans la boîte</span>
                  <input value={preheader} maxLength={200} onChange={(event) => setPreheader(event.target.value)} />
                </label>
                <p className="ml-option-help">Citations et séparateurs sont disponibles dans le bouton « ? ».</p>
              </div>
            ) : null}
          </fieldset>

          <fieldset className="ml-step">
            <legend>Pour qui ?</legend>
            <div className="ml-audience-head">
              <div className="ml-segments" role="group" aria-label="Choisir les destinataires">
                {(Object.keys(AUDIENCE_LABELS) as Audience[]).map((item) => (
                  <button type="button" key={item} aria-pressed={audience === item} onClick={() => {
                    setAudience(item);
                    setConfirmation("");
                    if (item === "selected") setPickerOpen(true);
                  }}>{AUDIENCE_LABELS[item]}</button>
                ))}
              </div>
              <p className="ml-count" role="status" aria-live="polite">
                {expectedRecipients === 0 ? "0 destinataire" : `${expectedRecipients} ${plural(expectedRecipients, "destinataire", "destinataires")}`}
              </p>
            </div>
            {overLimit ? <p className="ml-note">Limite d'envoi : {MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS} destinataires.</p> : null}
            {ruleApplies ? <p className="ml-note">Les comptes inactifs sont exclus : {excludedInactiveCount}.</p> : null}
            {overLimit && audience !== "selected" ? <button type="button" className="ml-quiet" onClick={() => { setAudience("selected"); setPickerOpen(true); setConfirmation(""); }}>Choisir</button> : null}
          </fieldset>

          {pickerOpen ? (
            <div className="ml-picker-layer" role="presentation">
              <button type="button" className="adm-dialog-scrim" aria-label="Fermer le choix des destinataires" onClick={() => setPickerOpen(false)} />
              <section className="ml-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="ml-picker-title">
                <div className="ml-picker-dialog-head">
                  <div><h2 id="ml-picker-title">Choisir</h2><p>{selectedIds.length} sélectionné{selectedIds.length > 1 ? "s" : ""}</p></div>
                  <button type="button" className="ml-picker-close" onClick={() => setPickerOpen(false)} aria-label="Fermer">Fermer</button>
                </div>
                <div className="ml-picker">
                  <label className="ml-search"><Search aria-hidden="true" /><span className="ml-sr">Chercher un membre</span><input type="search" value={search} placeholder="Chercher un membre" onChange={(event) => setSearch(event.target.value)} autoComplete="off" autoFocus /></label>
                  <div className="ml-list">
                    {visibleUsers.length === 0 ? <p>Aucun membre ne correspond.</p> : visibleUsers.map((account) => {
                      const checked = selectedIds.includes(account.id);
                      return (
                        <label key={account.id} data-disabled={account.inactiveForEmail || undefined}>
                          <input type="checkbox" checked={checked} onChange={() => toggleUser(account.id)} disabled={account.inactiveForEmail || (!checked && selectedIds.length >= MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS)} />
                          <span>{account.email}</span>
                          <small>{account.inactiveForEmail ? "Inactif" : account.tier === "full" ? COFFRE_LABEL : account.tier === "beginner" ? FONDATIONS_LABEL : "Gratuit"}</small>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <button type="button" className="adm-ghost-button ml-picker-done" onClick={() => setPickerOpen(false)}>Terminer</button>
              </section>
            </div>
          ) : null}

          <div className="ml-send">
            <button type="button" className="adm-primary-button" disabled={!canReview} onClick={() => { setResult(null); setConfirmation(""); setSheetOpen(true); }}>Vérifier et envoyer</button>
            {overLimit ? <p>L'envoi est limité à {MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS} personnes à la fois.</p> : missingContent ? <p>Il manque un objet ou un message.</p> : null}
          </div>
        </div>

        <button type="button" className="ml-preview-trigger" onClick={() => setPreviewOpen(true)}>Aperçu</button>
        <aside className="ml-preview" aria-label="Aperçu de l'e-mail">
          <MailPreview subject={preview.subject} html={preview.html} text={preview.text} from={from} />
        </aside>
      </div>
      {previewOpen ? (
        <div className="ml-preview-layer" role="presentation">
          <button type="button" className="adm-dialog-scrim" aria-label="Fermer l'aperçu" onClick={() => setPreviewOpen(false)} />
          <section className="ml-preview-sheet" role="dialog" aria-modal="true" aria-labelledby="ml-preview-title">
            <div className="ml-preview-sheet-head">
              <h2 id="ml-preview-title">Aperçu</h2>
              <button type="button" className="ml-picker-close" onClick={() => setPreviewOpen(false)}>Fermer</button>
            </div>
            <MailPreview subject={preview.subject} html={preview.html} text={preview.text} from={from} />
          </section>
        </div>
      ) : null}

      {sheetOpen ? (
        <div className="adm-dialog-layer">
          <button className="adm-dialog-scrim" type="button" aria-label="Fermer la confirmation" onClick={closeSheet} />
          <section className="adm-clean-dialog ml-sheet" role="dialog" aria-modal="true" aria-labelledby="mail-sheet-title">
            <h2 id="mail-sheet-title">Prêt à envoyer ?</h2>
            <dl className="ml-recap">
              <div><dt>Objet</dt><dd>{subject}</dd></div>
              <div><dt>Destinataires</dt><dd>{expectedRecipients} {plural(expectedRecipients, "personne", "personnes")}</dd></div>
              <div><dt>Extrait</dt><dd>{excerpt}</dd></div>
            </dl>
            <p>Cet envoi est réel et ne peut pas être annulé.</p>
            <label>Pour confirmer, écris {CONFIRM_WORD}<input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="off" autoFocus /></label>
            {result && !result.ok ? <p className="adm-inline-error" role="alert">{result.error ?? "L'envoi a échoué."}</p> : null}
            <div className="adm-dialog-actions">
              <button type="button" className="adm-ghost-button" onClick={closeSheet} disabled={isSending}>Annuler</button>
              <button type="button" className="adm-primary-button" onClick={() => { void sendEmail(); }} disabled={isSending || confirmation !== CONFIRM_WORD}>{isSending ? "Envoi en cours" : "Envoyer"}</button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
