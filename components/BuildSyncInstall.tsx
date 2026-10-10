"use client";

import { Check, Copy, RefreshCw, ShieldCheck } from "lucide-react";
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

export function BuildSyncInstall() {
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <section aria-labelledby="build-sync-title" className="mb-10 border border-[#e8d5b0]/20 bg-[#e8d5b0]/[0.045] p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8d5b0]">BUILD Sync</p>
          <h2 id="build-sync-title" className="mt-2 text-2xl font-semibold tracking-tight text-[#f0ede8]">
            Installe une fois. Les skills restent à jour.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
            BUILD détecte Codex, Claude Code et Hermes, installe les skills accessibles avec ton abonnement puis vérifie automatiquement les nouvelles versions.
          </p>
          <div className="mt-4 grid gap-2 text-xs text-white/55 sm:grid-cols-2">
            <p className="flex items-start gap-2"><RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e8d5b0]" />Contrôle automatique toutes les six heures</p>
            <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e8d5b0]" />Tes adaptations restent dans CUSTOM.md</p>
          </div>
        </div>

        <div className="space-y-3">
          {COMMANDS.map(({ label, command }) => (
            <div key={label}>
              <p className="mb-1.5 text-[10px] uppercase tracking-[0.14em] text-white/35">{label}</p>
              <div className="relative border border-white/10 bg-black/35">
                <pre className="overflow-x-auto py-3 pl-3 pr-12 text-[11px] text-[#e8d5b0]/85"><code>{command}</code></pre>
                <button
                  type="button"
                  aria-label={`Copier la commande ${label}`}
                  onClick={() => {
                    void navigator.clipboard.writeText(command);
                    setCopied(label);
                    window.setTimeout(() => setCopied(null), 2_000);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 border border-white/10 bg-white/[0.06] p-2 text-white/55 transition hover:text-[#e8d5b0]"
                >
                  {copied === label ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          ))}
          <p className="text-[11px] leading-relaxed text-white/35">
            Requiert Node.js 20+. Une fenêtre BUILD s’ouvrira pour confirmer ton compte. Aucun mot de passe n’est transmis au programme local.
          </p>
        </div>
      </div>
    </section>
  );
}
