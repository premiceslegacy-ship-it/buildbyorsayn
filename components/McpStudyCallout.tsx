import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function McpStudyCallout() {
  return (
    <section
      aria-labelledby="study-with-mcp-title"
      className="mb-10 border-y border-white/[0.08] py-5 sm:mb-12 sm:py-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e8d5b0]">
            Connexion bêta
          </p>
          <h2 id="study-with-mcp-title" className="text-lg font-semibold text-[#f0ede8]">
            Continue ce bloc dans Claude ou ChatGPT
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-white/50">
            Pose tes questions comme d&apos;habitude. Ton assistant voit uniquement les contenus inclus dans ton accès BUILD.
          </p>
        </div>
        <Link
          href="/dashboard/mcp"
          className="group inline-flex min-h-11 flex-none items-center justify-center gap-2 rounded-md border border-[#e8d5b0]/40 bg-[#e8d5b0] px-4 py-2.5 text-sm font-semibold text-[#0e0e0f] shadow-[0_3px_0_rgba(100,76,36,0.9),inset_0_1px_0_rgba(255,255,255,0.5)] transition-[transform,box-shadow,background-color] duration-[80ms] hover:bg-[#f0dfc0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f0dfc0] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e0f] active:translate-y-[2px] active:shadow-[0_1px_0_rgba(100,76,36,0.9)]"
        >
          Connecter mon assistant
          <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
