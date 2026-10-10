"use client";

import { Check, Copy, Download, ExternalLink, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";

const BUILD_SYNC_ORIGIN = (process.env.NEXT_PUBLIC_APP_URL ?? "https://build-system-three.vercel.app")
  .replace(/\/+$/, "");

const COMMANDS = [
  {
    label: "macOS, Linux ou WSL",
    command: `curl -fsSL ${BUILD_SYNC_ORIGIN}/build-sync/install.sh | sh`,
  },
  {
    label: "Windows PowerShell",
    command: `irm ${BUILD_SYNC_ORIGIN}/build-sync/install.ps1 | iex`,
  },
] as const;

const EXPERIENCE_STEPS = [
  { label: "Copier", detail: "La commande", icon: Copy },
  { label: "Autoriser", detail: "Dans BUILD", icon: ExternalLink },
  { label: "Installer", detail: "Les bons skills", icon: Download },
  { label: "Synchroniser", detail: "Toutes les 6 h", icon: RefreshCw },
] as const;

export function BuildSyncInstall() {
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <section aria-labelledby="build-sync-title" className="mb-10 overflow-hidden border border-[#e8d5b0]/20 bg-[#e8d5b0]/[0.045] p-4 sm:p-6">
      <div className="grid min-w-0 gap-7 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8d5b0]">BUILD Sync</p>
          <h2 id="build-sync-title" className="mt-2 text-xl font-semibold tracking-tight text-[#f0ede8] sm:text-2xl">
            Installe une fois. Les skills restent à jour.
          </h2>
          <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-white/55 sm:text-sm">
            BUILD détecte Codex, Claude Code et Hermes, installe les skills accessibles avec ton abonnement puis vérifie automatiquement les nouvelles versions.
          </p>
          <div className="mt-4 grid gap-2 text-xs text-white/55 sm:grid-cols-2">
            <p className="flex items-start gap-2"><RefreshCw className="mt-0.5 size-3.5 shrink-0 text-[#e8d5b0]" />Contrôle automatique toutes les six heures</p>
            <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[#e8d5b0]" />Tes adaptations restent dans CUSTOM.md</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {COMMANDS.map(({ label, command }) => (
            <div key={label} className="min-w-0">
              <p className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-white/35">{label}</p>
              <div className="flex min-w-0 items-stretch border border-white/10 bg-black/35">
                <pre className="min-w-0 flex-1 overflow-x-auto p-3 text-[10px] leading-5 text-[#e8d5b0]/85 sm:text-[11px]"><code>{command}</code></pre>
                <button
                  type="button"
                  aria-label={copied === label ? `Commande ${label} copiée` : `Copier la commande ${label}`}
                  title={copied === label ? "Commande copiée" : "Copier la commande"}
                  onClick={() => {
                    void navigator.clipboard.writeText(command);
                    setCopied(label);
                    window.setTimeout(() => setCopied(null), 2_000);
                  }}
                  className="flex size-11 shrink-0 items-center justify-center border-l border-white/10 bg-white/[0.06] text-white/55 transition hover:text-[#e8d5b0]"
                >
                  {copied === label ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
              </div>
            </div>
          ))}
          <p className="text-[11px] leading-relaxed text-white/35">
            Requiert Node.js 20+. Une fenêtre BUILD s’ouvrira pour confirmer ton compte. Aucun mot de passe n’est transmis au programme local.
          </p>
        </div>
      </div>
      <ol aria-label="Étapes de l’installation BUILD Sync" className="mt-5 grid grid-cols-2 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
        {EXPERIENCE_STEPS.map(({ label, detail, icon: Icon }, index) => (
          <li key={label} className="flex min-w-0 items-center gap-2.5 bg-[#121214] px-3 py-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#e8d5b0]/20 text-[#e8d5b0]">
              <Icon className="size-3.5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-[9px] uppercase tracking-[0.14em] text-white/30">0{index + 1}</span>
              <span className="block truncate text-xs font-medium text-[#f0ede8]/85">{label}</span>
              <span className="block truncate text-[10px] text-white/35">{detail}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[11px] leading-relaxed text-white/45 sm:text-xs">
        <strong className="font-semibold text-[#e8d5b0]/85">Déjà téléchargé manuellement ?</strong>{" "}
        Lance l’installation une fois : l’ancien dossier sera sauvegardé, puis BUILD Sync prendra le relais. Si tu avais modifié SKILL.md, reporte seulement tes règles dans CUSTOM.md.
      </p>
    </section>
  );
}
