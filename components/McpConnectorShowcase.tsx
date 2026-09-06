import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const ACCESS_LEVELS = [
  {
    name: "Fondations",
    description: "Les bases, les premiers contenus et les skills essentiels.",
  },
  {
    name: "LE COFFRE",
    description: "Toute la profondeur des méthodes, contenus et skills BUILD.",
  },
];

export function McpConnectorShowcase({ beta = false }: { beta?: boolean } = {}) {
  return (
    <section aria-labelledby="mcp-connector-title" className="mt-12">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem]">
        <Image
          src="/api/mcp/showcase-asset"
          alt="Les logos BUILD, Claude et ChatGPT réunis dans un paysage de montagne transformé en caractères ASCII"
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 960px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-transparent to-transparent" aria-hidden="true" />
      </div>

      <div className="grid gap-8 pt-8 sm:px-2 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#e8d5b0]">
              Inclus dans les deux offres
            </p>
            {beta ? (
              <span className="rounded-full border border-[#e8d5b0]/25 bg-[#e8d5b0]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#e8d5b0]">
                Connexion bêta
              </span>
            ) : null}
          </div>
          <h3 id="mcp-connector-title" className="max-w-xl text-2xl font-semibold leading-tight text-[#f0ede8] sm:text-3xl">
            Retrouve BUILD directement dans Claude ou ChatGPT
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
            Garde toute la puissance de ton assistant et ajoute-lui le contexte, les méthodes,
            les contenus et les skills BUILD. Tu poses tes questions comme d&apos;habitude, sans
            déplacer tes fichiers ni recommencer ton projet ailleurs.
          </p>
          <p className="mt-3 max-w-2xl text-xs leading-5 text-white/40">
            Selon ton compte, la connexion peut demander un forfait web payant compatible ou l&apos;accord de
            l&apos;administrateur de ton espace.
          </p>
          <Link
            href="/dashboard/mcp"
            className="group mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#e8d5b0] px-5 py-3.5 text-sm font-bold text-[#0a0908] shadow-[0_3px_0_rgba(100,76,36,0.9),0_7px_20px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.5)] transition-[transform,box-shadow,background-color] duration-[80ms] hover:bg-[#f0dfc0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0dfc0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0f] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)]"
          >
            Connecter mon assistant
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="space-y-3" aria-label="Profondeur selon l'offre">
          {ACCESS_LEVELS.map((level) => (
            <div
              key={level.name}
              className="flex gap-3 rounded-2xl border border-white/[0.08] bg-black/20 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#e8d5b0]/12 text-[#e8d5b0]">
                <Check className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#f0ede8]">{level.name}</p>
                <p className="mt-1 text-xs leading-5 text-white/50">{level.description}</p>
              </div>
            </div>
          ))}
          <p className="px-1 pt-1 text-xs leading-5 text-white/35">
            Ton assistant accède uniquement à ce qui est inclus dans ton offre.
          </p>
        </div>
      </div>
    </section>
  );
}
