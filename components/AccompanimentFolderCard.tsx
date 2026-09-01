"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { FolderComponent } from "@/components/ui/folder-component";
import { LockGlyph } from "@/components/ui/pricing-glyphs";
import { AsciiDitherAsset } from "@/components/ui/ascii-dither-asset";
import { ACCOMPAGNEMENTS, ACCOMPANIMENT_CAL_URL } from "@/lib/accompagnements";

const AVAILABLE = ACCOMPAGNEMENTS.filter((item) => item.status === "available");

function AvailableCardContent() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[20px] p-3.5">
      <AsciiDitherAsset
        ditherSrc="/assets/accompaniment/accompaniment-card-dither-atkinson-build.png"
        charactersSrc="/assets/accompaniment/accompaniment-card-characters-build.png"
        className="absolute inset-0 h-full w-full"
        animated={false}
        fit="cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-transparent to-transparent" />
      <div className="relative z-10 mt-auto">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]">Disponible</p>
        <p className="mt-1 text-[11px] font-medium leading-snug text-[#f0ede8]">
          Vendre des sites web avec l&apos;IA
        </p>
      </div>
    </div>
  );
}

function SoonCardContent() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between p-3.5">
      <LockGlyph className="h-8 w-8 text-white/30" />
      <div className="relative z-10 mt-auto">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8f8b84]">Bientôt disponible</p>
      </div>
    </div>
  );
}

function AccompagnementCarousel() {
  const [index, setIndex] = useState(0);
  const item = AVAILABLE[index];
  const multiple = AVAILABLE.length > 1;

  const prev = () => setIndex((i) => (i === 0 ? AVAILABLE.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === AVAILABLE.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        {multiple && (
          <button
            onClick={prev}
            aria-label="Accompagnement précédent"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-[#e8d5b0] transition-colors hover:bg-white/[0.1]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-xs uppercase tracking-[0.16em] text-[#8f8b84]">Disponible</p>
          <h4 className="mt-2 text-lg font-bold text-[#f0ede8]">{item.title}</h4>
          <p className="mt-2 text-sm leading-relaxed text-[#8a8070]">{item.description}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <a
              href={ACCOMPANIMENT_CAL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#e8d5b0] px-4 py-2.5 text-sm font-bold text-[#0a0908] shadow-[0_3px_0_rgba(100,76,36,0.9)] transition-all duration-[80ms] hover:bg-[#f0dfc0] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)]"
            >
              Réserver le premier appel
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            {item.href && (
              <Link
                href={item.href}
                className="text-sm font-semibold text-[#e8d5b0]/80 underline underline-offset-4 hover:text-[#e8d5b0]"
              >
                Voir l&apos;accompagnement
              </Link>
            )}
          </div>
        </div>

        {multiple && (
          <button
            onClick={next}
            aria-label="Accompagnement suivant"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-[#e8d5b0] transition-colors hover:bg-white/[0.1]"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {multiple && (
        <div className="mt-4 flex justify-center gap-2 sm:justify-start">
          {AVAILABLE.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setIndex(i)}
              aria-label={`Voir ${a.title}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === index ? "w-6 bg-[#e8d5b0]" : "w-1.5 bg-white/20 hover:bg-white/35"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function AccompanimentFolderCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0908] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span aria-hidden="true" className="build-atmosphere-orb build-atmosphere-orb-one opacity-30" />
      <span aria-hidden="true" className="build-atmosphere-orb build-atmosphere-orb-two opacity-30" />

      <div className="relative z-10 flex flex-col items-center gap-14 px-6 py-12 sm:px-12 sm:py-16 lg:min-h-[440px] lg:flex-row lg:items-center lg:justify-between">
        <div className="text-center lg:max-w-sm lg:text-left">
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-3">
            Tu préfères qu&apos;on construise ça ensemble ?
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#f0ede8] mb-4 leading-tight">
            Des accompagnements 1:1 pour avancer sur ce qui compte.
          </h3>
          <p className="text-sm leading-relaxed text-[#8a8070]">
            Un dossier, plusieurs accompagnements. Clique pour l&apos;ouvrir et voir ce qui est disponible.
          </p>
        </div>

        <div className="flex flex-shrink-0 flex-col items-center sm:pr-8">
          <div className="scale-[0.8] sm:scale-100">
            <FolderComponent
              color="build"
              size="md"
              pinOpen={open}
              onOpenChange={setOpen}
              cards={[<SoonCardContent key="soon-1" />, <SoonCardContent key="soon-2" />, <AvailableCardContent key="available" />]}
            />
          </div>
          <p className="mt-3 text-xs text-white/30">Clique sur le dossier</p>
        </div>
      </div>

      <div
        className={`relative z-10 overflow-hidden border-t border-white/[0.08] bg-[#0a0908]/80 backdrop-blur-sm transition-[grid-template-rows] duration-500 ease-out ${
          open ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div className="px-6 py-8 sm:px-12">
            <AccompagnementCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}
