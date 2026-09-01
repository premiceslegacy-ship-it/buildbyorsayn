"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FolderComponent } from "@/components/ui/folder-component";
import { AsciiDitherAsset } from "@/components/ui/ascii-dither-asset";
import { ACCOMPAGNEMENTS, ACCOMPANIMENT_CAL_URL } from "@/lib/accompagnements";

const available = ACCOMPAGNEMENTS.find((item) => item.status === "available");

function AvailableCardContent() {
  return (
    <div className="relative flex h-full w-full flex-col justify-between p-3.5">
      <AsciiDitherAsset
        ditherSrc="/assets/accompaniment/coffre-dither-atkinson-build.png"
        charactersSrc="/assets/accompaniment/coffre-characters-build.png"
        className="guidance-ascii-scene absolute inset-x-2 top-2 h-[62%]"
      />
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
      <AsciiDitherAsset
        ditherSrc="/assets/accompaniment/soon-dither-atkinson-build.png"
        charactersSrc="/assets/accompaniment/soon-characters-build.png"
        className="guidance-ascii-scene absolute inset-x-2 top-2 h-[62%] opacity-70"
        animated={false}
      />
      <div className="relative z-10 mt-auto">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8f8b84]">Bientôt disponible</p>
      </div>
    </div>
  );
}

export function AccompanimentFolderCard() {
  return (
    <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0908] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <span aria-hidden="true" className="build-atmosphere-orb build-atmosphere-orb-one opacity-40" />
      <span aria-hidden="true" className="build-atmosphere-orb build-atmosphere-orb-two opacity-40" />

      <div className="relative z-10 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10">
        <div className="mx-auto sm:mx-0">
          <FolderComponent
            color="build"
            size="sm"
            cards={[<SoonCardContent key="soon-1" />, <SoonCardContent key="soon-2" />, <AvailableCardContent key="available" />]}
          />
        </div>

        <div className="text-center sm:text-left">
          <p className="text-[11px] font-bold uppercase tracking-[3px] text-[#c9b48a] mb-3">
            Tu préfères qu&apos;on construise ça ensemble ?
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-[#f0ede8] mb-3 leading-tight">
            Un accompagnement 1:1, pas une formation de plus.
          </h3>
          <p className="text-[#8a8070] text-sm leading-relaxed mb-6 max-w-md mx-auto sm:mx-0">
            {available?.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <a
              href={ACCOMPANIMENT_CAL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#e8d5b0] px-5 py-3 text-sm font-bold text-[#0a0908] shadow-[0_3px_0_rgba(100,76,36,0.9)] transition-all duration-[80ms] hover:bg-[#f0dfc0] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)]"
            >
              Réserver le premier appel
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            {available?.href && (
              <Link
                href={available.href}
                className="text-sm font-semibold text-[#e8d5b0]/80 underline underline-offset-4 hover:text-[#e8d5b0]"
              >
                Voir l&apos;accompagnement
              </Link>
            )}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/30 sm:justify-start">
            <AsciiDitherAsset
              ditherSrc="/assets/accompaniment/arrow-dither-atkinson-build.png"
              charactersSrc="/assets/accompaniment/arrow-characters-build.png"
              className="guidance-ascii-scene h-4 w-10"
              animated={false}
            />
            <span>D&apos;autres accompagnements arrivent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
