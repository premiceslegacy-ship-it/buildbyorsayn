import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function McpConnectorShowcase({ beta = false }: { beta?: boolean } = {}) {
  return (
    <section aria-labelledby="mcp-connector-title" className="mt-16 py-10 sm:py-14">
      <div className="mb-10 h-px bg-white/[0.08] sm:mb-14" aria-hidden="true" />

      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-16">
        <figure className="relative overflow-hidden rounded-[10px] border border-white/[0.1] bg-[#131315]">
          <img
            src="/api/mcp/showcase-asset"
            alt="Contexte BUILD transmis à ton assistant"
            className="block aspect-[16/9] h-full w-full object-cover"
            loading="lazy"
          />
          <figcaption className="border-t border-white/[0.1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/60 sm:px-7">
            TON CONTEXTE BUILD RESTE AVEC TOI
          </figcaption>
        </figure>

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c9b48a]">
            <span>{beta ? "Inclus dans les deux offres - Bêta" : "Inclus dans les deux offres"}</span>
          </div>

          <h3 id="mcp-connector-title" className="max-w-xl text-3xl font-semibold leading-[1.08] tracking-tight text-[#f0ede8] sm:text-4xl">
            Tu peux enfin poser la question qui te bloque.
          </h3>
          <p className="mt-4 max-w-xl text-[15px] leading-6 text-white/60">
            Ton assistant retrouve le contenu BUILD utile, te l&apos;explique et t&apos;aide à l&apos;adapter à ton projet.
          </p>

          <div className="mt-8 border-y border-white/[0.1] py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">Exemples de questions</p>
            <ul className="mt-3 divide-y divide-white/[0.08] text-[15px] text-[#f0ede8]">
              <li className="py-3 first:pt-0">Comment j&apos;applique ce contenu à mon projet ?</li>
              <li className="py-3 last:pb-0">Quel skill peut m&apos;aider ici, et quelle est la prochaine étape ?</li>
            </ul>
          </div>

          <p className="mt-5 max-w-lg text-xs leading-5 text-white/38">
            Fondations ou LE COFFRE : ton assistant voit uniquement les contenus inclus dans ton accès.
          </p>

          <Link
            href="/mcp/start"
            className="group mt-7 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[#e8d5b0] px-5 py-3 text-sm font-bold text-[#0a0908] shadow-[0_3px_0_rgba(100,76,36,0.9),inset_0_1px_0_rgba(255,255,255,0.5)] transition-[transform,box-shadow,background-color] duration-[80ms] hover:bg-[#f0dfc0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0dfc0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0f] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)] sm:w-auto"
          >
            Connecter mon assistant
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-10 h-px bg-white/[0.08] sm:mt-14" aria-hidden="true" />
    </section>
  );
}
