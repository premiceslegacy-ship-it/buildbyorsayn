"use client";

import { useMemo, useState } from "react";
import { Mail, Send, Users, Video, RefreshCw, FileText } from "lucide-react";

type MailUser = {
  id: string;
  email: string;
  tier: string | null;
};

type Audience = "selected" | "all" | "free" | "beginner" | "full";

type SendResult = {
  ok: boolean;
  sent?: number;
  batches?: number;
  error?: string;
};

type TemplateKey = "blank" | "video" | "update";

const AUDIENCE_LABELS: Record<Audience, string> = {
  selected: "Sélection",
  all: "Tous",
  free: "Gratuits",
  beginner: "Fondations",
  full: "Complet",
};

const TEMPLATES: Record<TemplateKey, { label: string; icon: React.ReactNode; fill: (vals: { videoTitle?: string; videoUrl?: string; updateTitle?: string; updateDesc?: string }) => { subject: string; preheader: string; body: string; ctaLabel: string; ctaUrl: string } }> = {
  blank: {
    label: "Vide",
    icon: <FileText className="h-3.5 w-3.5" />,
    fill: () => ({ subject: "", preheader: "", body: "", ctaLabel: "", ctaUrl: "" }),
  },
  video: {
    label: "Nouvelle vidéo",
    icon: <Video className="h-3.5 w-3.5" />,
    fill: ({ videoTitle = "[Titre de la vidéo]", videoUrl = "" }) => ({
      subject: `Nouvelle vidéo : ${videoTitle}`,
      preheader: "Disponible maintenant dans ta bibliothèque BUILD.",
      body: `Une nouvelle vidéo vient d'être ajoutée à BUILD.\n\n${videoTitle}\n\nElle illustre concrètement ce que tu apprends dans les modules - pas de théorie, que de l'actionnable.\n\nClique ci-dessous pour la regarder directement.`,
      ctaLabel: "Regarder la vidéo →",
      ctaUrl: videoUrl,
    }),
  },
  update: {
    label: "Mise à jour BUILD",
    icon: <RefreshCw className="h-3.5 w-3.5" />,
    fill: ({ updateTitle = "[Titre de la mise à jour]", updateDesc = "[Décris ce qui a changé]" }) => ({
      subject: `Mise à jour BUILD : ${updateTitle}`,
      preheader: "Le contenu vient d'être mis à jour.",
      body: `BUILD vient d'être mis à jour.\n\n${updateTitle}\n\n${updateDesc}\n\nConnecte-toi pour voir les changements.`,
      ctaLabel: "Voir la mise à jour →",
      ctaUrl: "https://build-system-three.vercel.app/dashboard",
    }),
  },
};

export function AdminMailComposer({ users }: { users: MailUser[] }) {
  const [audience, setAudience] = useState<Audience>("selected");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchSize, setBatchSize] = useState(10);
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);

  // Template state
  const [activeTemplate, setActiveTemplate] = useState<TemplateKey>("blank");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDesc, setUpdateDesc] = useState("");

  const selectedUsers = useMemo(
    () => users.filter((user) => selectedIds.includes(user.id)),
    [selectedIds, users]
  );

  const expectedRecipients = useMemo(() => {
    if (audience === "selected") return selectedUsers.length;
    if (audience === "free") return users.filter((user) => !user.tier || user.tier === "free").length;
    return users.filter((user) => audience === "all" || user.tier === audience).length;
  }, [audience, selectedUsers.length, users]);

  const toggleUser = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const applyTemplate = (key: TemplateKey) => {
    setActiveTemplate(key);
    setResult(null);
    const filled = TEMPLATES[key].fill({ videoTitle, videoUrl, updateTitle, updateDesc });
    setSubject(filled.subject);
    setPreheader(filled.preheader);
    setBody(filled.body);
    setCtaLabel(filled.ctaLabel);
    setCtaUrl(filled.ctaUrl);
  };

  const refreshTemplate = () => {
    if (activeTemplate === "blank") return;
    const filled = TEMPLATES[activeTemplate].fill({ videoTitle, videoUrl, updateTitle, updateDesc });
    setSubject(filled.subject);
    setPreheader(filled.preheader);
    setBody(filled.body);
    setCtaLabel(filled.ctaLabel);
    setCtaUrl(filled.ctaUrl);
  };

  const sendEmail = async () => {
    setIsSending(true);
    setResult(null);

    const response = await fetch("/api/admin/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audience,
        selectedUserIds: selectedIds,
        batchSize,
        subject,
        preheader,
        body,
        ctaLabel,
        ctaUrl,
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as SendResult;
    setResult({ ok: response.ok && payload.ok, ...payload });
    setIsSending(false);
  };

  return (
    <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[#e8d5b0]">
            <Mail className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.15em]">Broadcast membres</p>
          </div>
          <h2 className="text-xl font-semibold text-[#f0ede8]">Envoyer un email ciblé</h2>
          <p className="mt-1 text-sm text-white/35">
            Vidéo YouTube, update blocks, annonce produit ou message individuel.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/45">
          <Users className="h-3.5 w-3.5" />
          {expectedRecipients} destinataire{expectedRecipients > 1 ? "s" : ""}
        </div>
      </div>

      {/* Template selector */}
      <div className="mb-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30">Template</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TEMPLATES) as TemplateKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => applyTemplate(key)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                activeTemplate === key
                  ? "border-[#e8d5b0]/40 bg-[#e8d5b0]/12 text-[#e8d5b0]"
                  : "border-white/10 bg-white/[0.03] text-white/35 hover:bg-white/[0.06]"
              }`}
            >
              {TEMPLATES[key].icon}
              {TEMPLATES[key].label}
            </button>
          ))}
        </div>

        {/* Template fields */}
        {activeTemplate === "video" && (
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-[#e8d5b0]/15 bg-[#e8d5b0]/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#e8d5b0]/60">Infos vidéo</p>
            <input
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              onBlur={refreshTemplate}
              placeholder="Titre de la vidéo"
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/20 focus:border-[#e8d5b0]/40"
            />
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onBlur={refreshTemplate}
              placeholder="URL YouTube (https://youtu.be/...)"
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/20 focus:border-[#e8d5b0]/40"
            />
            <button
              type="button"
              onClick={refreshTemplate}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-[#e8d5b0]/20 bg-[#e8d5b0]/10 px-3 py-1.5 text-xs text-[#e8d5b0]/80 transition-colors hover:bg-[#e8d5b0]/20"
            >
              <RefreshCw className="h-3 w-3" />
              Appliquer
            </button>
          </div>
        )}

        {activeTemplate === "update" && (
          <div className="mt-3 flex flex-col gap-2 rounded-xl border border-[#e8d5b0]/15 bg-[#e8d5b0]/5 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#e8d5b0]/60">Infos mise à jour</p>
            <input
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              onBlur={refreshTemplate}
              placeholder="Titre de la mise à jour"
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/20 focus:border-[#e8d5b0]/40"
            />
            <textarea
              value={updateDesc}
              onChange={(e) => setUpdateDesc(e.target.value)}
              onBlur={refreshTemplate}
              placeholder="Ce qui a changé, ce qui a été ajouté..."
              rows={3}
              className="resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/20 focus:border-[#e8d5b0]/40"
            />
            <button
              type="button"
              onClick={refreshTemplate}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-[#e8d5b0]/20 bg-[#e8d5b0]/10 px-3 py-1.5 text-xs text-[#e8d5b0]/80 transition-colors hover:bg-[#e8d5b0]/20"
            >
              <RefreshCw className="h-3 w-3" />
              Appliquer
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex flex-col gap-3">
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Objet de l'email"
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-[#e8d5b0]/40"
          />
          <input
            value={preheader}
            onChange={(event) => setPreheader(event.target.value)}
            placeholder="Préheader optionnel"
            className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-[#e8d5b0]/40"
          />
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Message. Tu peux coller l'annonce, le lien YouTube ou la note de mise à jour."
            rows={7}
            className="resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-relaxed text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-[#e8d5b0]/40"
          />
          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <input
              value={ctaUrl}
              onChange={(event) => setCtaUrl(event.target.value)}
              placeholder="URL du bouton"
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-[#e8d5b0]/40"
            />
            <input
              value={ctaLabel}
              onChange={(event) => setCtaLabel(event.target.value)}
              placeholder="Texte bouton"
              className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 outline-none transition-colors placeholder:text-white/20 focus:border-[#e8d5b0]/40"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(AUDIENCE_LABELS) as Audience[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setAudience(item)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  audience === item
                    ? "border-[#e8d5b0]/40 bg-[#e8d5b0]/12 text-[#e8d5b0]"
                    : "border-white/10 bg-white/[0.03] text-white/35 hover:bg-white/[0.06]"
                }`}
              >
                {AUDIENCE_LABELS[item]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {[1, 10, 30].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setBatchSize(size)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  batchSize === size
                    ? "border-[#e8d5b0]/40 bg-[#e8d5b0]/12 text-[#e8d5b0]"
                    : "border-white/10 bg-white/[0.03] text-white/35 hover:bg-white/[0.06]"
                }`}
              >
                {size} par {size}
              </button>
            ))}
          </div>

          <div className="max-h-72 overflow-y-auto rounded-xl border border-white/8 bg-black/15">
            {users.map((user) => (
              <label
                key={user.id}
                className="flex cursor-pointer items-center gap-3 border-b border-white/5 px-3 py-2.5 last:border-b-0 hover:bg-white/[0.03]"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                  className="h-4 w-4 accent-[#e8d5b0]"
                />
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-white/55">{user.email}</span>
                <span className="text-[11px] text-white/25">{user.tier ?? "free"}</span>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={sendEmail}
            disabled={isSending || expectedRecipients === 0 || !subject.trim() || !body.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c9b48a] px-5 py-3 text-sm font-semibold text-[#0e0e0f] transition-colors hover:bg-[#e8d5b0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            {isSending ? "Envoi..." : "Envoyer"}
          </button>

          {result && (
            <p className={`text-xs ${result.ok ? "text-emerald-300/80" : "text-red-300/80"}`}>
              {result.ok
                ? `${result.sent ?? 0} email(s) envoyés en ${result.batches ?? 0} lot(s).`
                : result.error ?? "L'envoi a échoué."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
