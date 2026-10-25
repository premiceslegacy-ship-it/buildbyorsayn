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
  all: "Tous les membres",
  free: "Gratuits",
  beginner: FONDATIONS_LABEL,
  full: COFFRE_LABEL,
  selected: "Choisir à la main",
};

const TEMPLATES: Record<TemplateKey, { label: string; hint: string }> = {
  blank: { label: "Message libre", hint: "Tu écris tout toi-même, à partir d'une page vide." },
  video: { label: "Nouvelle vidéo", hint: "Annonce une vidéo avec un bouton pour la regarder." },
  update: { label: "Mise à jour BUILD", hint: "Explique ce qui a changé et renvoie vers ton espace." },
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
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDesc, setUpdateDesc] = useState("");
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [buttonOpen, setButtonOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
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
    if (!sheetOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSending) {
        setSheetOpen(false);
        setConfirmation("");
        setResult(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen, isSending]);

  const applyTemplate = (key: TemplateKey) => {
    const next = templateContent(key, emailContext.baseUrl, { videoTitle, videoUrl, videoThumbnailUrl, updateTitle, updateDesc });
    setActiveTemplate(key);
    setSubject(next.subject);
    setPreheader(next.preheader);
    setBody(next.body);
    setCtaLabel(next.ctaLabel);
    setCtaUrl(next.ctaUrl);
    setThumbnailUrl(next.thumbnailUrl);
    setButtonOpen(Boolean(next.ctaLabel || next.ctaUrl));
    setOptionsOpen(Boolean(next.preheader));
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
      updateTitle,
      updateDesc,
    });
    setActiveTemplate("video");
    setSubject(next.subject);
    setPreheader(next.preheader);
    setBody(next.body);
    setCtaLabel(next.ctaLabel);
    setCtaUrl(next.ctaUrl);
    setThumbnailUrl(next.thumbnailUrl);
    setButtonOpen(true);
    setOptionsOpen(true);
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
        <p>Choisis un modèle, écris ton message, puis vérifie qui le reçoit avant d'envoyer.</p>
      </header>

      <div className="ml-layout">
        <div className="ml-flow">
          <fieldset className="ml-step">
            <legend>Quel message ?</legend>
            <div className="ml-templates">
              {(Object.keys(TEMPLATES) as TemplateKey[]).map((key) => (
                <button type="button" key={key} className="ml-template" aria-pressed={activeTemplate === key} onClick={() => applyTemplate(key)}>
                  <strong>{TEMPLATES[key].label}</strong>
                  <span>{TEMPLATES[key].hint}</span>
                </button>
              ))}
            </div>
            {activeTemplate === "video" ? (
              <div className="ml-fill">
                {publishedVideos.length > 0 ? (
                  <label>Vidéo publiée
                    <select value={selectedVideoId} onChange={(event) => selectPublishedVideo(event.target.value)}>
                      <option value="">Choisir une vidéo publiée</option>
                      {publishedVideos.map((video) => <option key={video.id} value={video.id}>{readableVideoTitle(video)}</option>)}
                    </select>
                  </label>
                ) : <p className="ml-note">Aucune vidéo publiée n'est disponible pour l'instant. Tu peux remplir les champs à la main.</p>}
                <label>Titre de la vidéo<input value={videoTitle} onChange={(event) => setVideoTitle(event.target.value)} /></label>
                <label>Lien de la vidéo<input value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://..." inputMode="url" /></label>
                <label>URL de la miniature<input value={videoThumbnailUrl} onChange={(event) => setVideoThumbnailUrl(event.target.value)} placeholder="https://..." inputMode="url" /></label>
                <button type="button" className="ml-quiet" onClick={() => applyTemplate("video")}>Remplir le message avec ces infos</button>
              </div>
            ) : null}
            {activeTemplate === "update" ? (
              <div className="ml-fill">
                <label>Titre de la mise à jour<input value={updateTitle} onChange={(event) => setUpdateTitle(event.target.value)} /></label>
                <label>Ce qui a changé<input value={updateDesc} onChange={(event) => setUpdateDesc(event.target.value)} /></label>
                <button type="button" className="ml-quiet" onClick={() => applyTemplate("update")}>Remplir le message avec ces infos</button>
              </div>
            ) : null}
          </fieldset>

          <fieldset className="ml-step">
            <legend>Écris-le</legend>
            <label className="ml-field">
              <span>Objet</span>
              <small>Ce que les membres voient dans leur boîte</small>
              <input value={subject} maxLength={160} onChange={(event) => setSubject(event.target.value)} />
            </label>
            <label className="ml-field">
              <span>Message</span>
              <small>Une ligne vide sépare les paragraphes. Des lignes qui commencent par &gt; forment une citation. Trois tirets seuls sur une ligne tracent un séparateur.</small>
              <textarea value={body} maxLength={20000} rows={8} onChange={(event) => setBody(event.target.value)} />
            </label>

            <button type="button" className="ml-disclose" aria-expanded={buttonOpen} aria-controls="ml-button-fields" onClick={() => setButtonOpen((open) => !open)}>
              <ChevronDown aria-hidden="true" />Ajouter un bouton
            </button>
            {buttonOpen ? (
              <div className="ml-pair" id="ml-button-fields">
                <label className="ml-field"><span>Texte du bouton</span><input value={ctaLabel} maxLength={80} onChange={(event) => setCtaLabel(event.target.value)} /></label>
                <label className="ml-field"><span>Lien du bouton</span><input value={ctaUrl} maxLength={2048} inputMode="url" placeholder="https://..." onChange={(event) => setCtaUrl(event.target.value)} /></label>
              </div>
            ) : null}

            <button type="button" className="ml-disclose" aria-expanded={optionsOpen} aria-controls="ml-option-fields" onClick={() => setOptionsOpen((open) => !open)}>
              <ChevronDown aria-hidden="true" />Options
            </button>
            {optionsOpen ? (
              <label className="ml-field" id="ml-option-fields">
                <span>Aperçu dans la boîte de réception</span>
                <small>La courte phrase grisée qui suit l'objet</small>
                <input value={preheader} maxLength={200} onChange={(event) => setPreheader(event.target.value)} />
              </label>
            ) : null}
          </fieldset>

          <fieldset className="ml-step">
            <legend>Pour qui ?</legend>
            <div className="ml-segments" role="group" aria-label="Choisir les destinataires">
              {(Object.keys(AUDIENCE_LABELS) as Audience[]).map((item) => (
                <button type="button" key={item} aria-pressed={audience === item} onClick={() => { setAudience(item); setConfirmation(""); }}>{AUDIENCE_LABELS[item]}</button>
              ))}
            </div>

            {audience === "selected" ? (
              <div className="ml-picker">
                <label className="ml-search"><Search aria-hidden="true" /><span className="ml-sr">Chercher un membre</span><input type="search" value={search} placeholder="Chercher un membre" onChange={(event) => setSearch(event.target.value)} autoComplete="off" /></label>
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
            ) : null}

            <p className="ml-count" role="status" aria-live="polite">
              {expectedRecipients === 0
                ? "Personne ne recevra ce mail pour l'instant."
                : overLimit
                  ? `${expectedRecipients} personnes, mais l'envoi est limité à ${MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS} à la fois.`
                  : `${expectedRecipients} ${plural(expectedRecipients, "personne recevra", "personnes recevront")} ce mail.`}
            </p>
            {ruleApplies ? (
              <p className="ml-note">Les comptes gratuits inactifs depuis plus de trois mois ne reçoivent jamais d'e-mail : {excludedInactiveCount} {plural(excludedInactiveCount, "compte est exclu", "comptes sont exclus")}.</p>
            ) : null}
            {overLimit && audience !== "selected" ? <button type="button" className="ml-quiet" onClick={() => { setAudience("selected"); setConfirmation(""); }}>Choisir à la main</button> : null}
          </fieldset>

          <div className="ml-send">
            <button type="button" className="adm-primary-button" disabled={!canReview} onClick={() => { setResult(null); setConfirmation(""); setSheetOpen(true); }}>Vérifier et envoyer</button>
            {overLimit ? <p>L'envoi est limité à {MAX_SYNC_ADMIN_BROADCAST_RECIPIENTS} personnes à la fois.</p> : missingContent ? <p>Il manque un objet ou un message.</p> : null}
          </div>
        </div>

        <aside className="ml-preview" aria-label="Aperçu de l'e-mail">
          <MailPreview subject={preview.subject} html={preview.html} text={preview.text} from={from} />
        </aside>
      </div>

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
