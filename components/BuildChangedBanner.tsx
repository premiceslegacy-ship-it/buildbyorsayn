import { Sparkles } from "lucide-react";

// Annonce de la refonte : à retirer quelques semaines après la mise en ligne.
export function BuildChangedBanner({ className = "" }: { className?: string }) {
  return (
    <div
      role="note"
      data-testid="build-changed-banner"
      className={`relative flex items-start gap-3.5 overflow-hidden rounded-2xl border border-[#e8d5b0]/20 bg-gradient-to-b from-[#e8d5b0]/[0.08] to-[#e8d5b0]/[0.03] px-4 py-3.5 sm:px-5 sm:py-4 ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8d5b0]/30 to-transparent" />
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[#e8d5b0]/20 bg-[#e8d5b0]/10">
        <Sparkles className="h-4 w-4 text-[#e8d5b0]" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[#f0ede8]">BUILD a changé</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-[rgba(240,237,232,0.6)]">
          Les chapitres sont réécrits, plus concrets, avec quoi faire ce soir. Ton assistant se connecte plus simplement. Les vidéos arrivent bloc par bloc.
        </p>
      </div>
    </div>
  );
}
