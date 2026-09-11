import "server-only";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { redirect } from "next/navigation";
import { doctrineAccessStatus } from "@/lib/doctrine/access.server";
import { readPublishedDoctrine } from "@/lib/doctrine/storage";
import { chapterTitle, type DoctrineFile } from "../../doctrine/markdown";
import { COFFRE_LABEL, COFFRE_PRICE } from "@/lib/pricing";
import { CHAPTER_META, GROUP_LABELS } from "./chapters";
import { HermesChapter } from "./HermesChapter";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import "../../doctrine/doctrine.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Hermes Agent | BUILD", robots: { index: false, follow: false } };

function GateShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/skills" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour aux skills
        </Link>
        {children}
      </div>
    </main>
  );
}

export default async function HermesAgentPage() {
  const status = await doctrineAccessStatus();
  if (status === 401) redirect("/login");

  if (status !== 200) {
    return (
      <GateShell>
        <div className="mt-10 rounded-2xl border border-[#e8d5b0]/15 bg-[#e8d5b0]/[0.04] p-8">
          <div className="w-12 h-12 rounded-full bg-[#e8d5b0]/10 flex items-center justify-center mb-6">
            <Lock className="w-5 h-5 text-[#e8d5b0]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Hermes Agent - doctrine agentique</h1>
          <p className="mt-4 text-white/60 leading-relaxed">
            Comment décomposer un métier en agents, borner leur autorité et rendre une entreprise entière AI-first - en capitalisant sur sa connaissance et ses process pour les rendre accessibles à des agents IA. Ce contenu est réservé à {COFFRE_LABEL}.
          </p>
          <Link
            href="/checkout"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#e8d5b0] px-5 py-3 text-sm font-semibold text-[#0e0e0f] hover:bg-[#f0dfc0] transition-colors"
          >
            Prendre {COFFRE_LABEL} - {COFFRE_PRICE}€
          </Link>
        </div>
      </GateShell>
    );
  }

  let files: readonly DoctrineFile[];
  try {
    files = await readPublishedDoctrine();
  } catch {
    return (
      <GateShell>
        <h1 className="mt-10 text-2xl sm:text-3xl font-semibold">Doctrine momentanément indisponible</h1>
        <p className="mt-4 text-white/60">Réessaie plus tard. Aucun contenu non vérifié ne sera affiché.</p>
      </GateShell>
    );
  }

  const socle = files.filter((f) => (CHAPTER_META[f.path]?.group ?? "socle") === "socle");
  const entreprise = files.filter((f) => CHAPTER_META[f.path]?.group === "entreprise");
  const groups = (
    [
      { key: "socle", files: socle },
      { key: "entreprise", files: entreprise },
    ] as const
  ).filter((g) => g.files.length > 0);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0]">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
        <Link href="/skills" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour aux skills
        </Link>

        <header className="mt-8 mb-10 flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-8">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#e8d5b0] font-semibold mb-3">
              Réservé à {COFFRE_LABEL}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Hermes Agent</h1>
            <p className="text-white/50 text-base sm:text-[17px] mt-4 leading-relaxed">
              La doctrine agentique de BUILD : comment décomposer un métier en agents, borner leur autorité et rendre une entreprise entière AI-first, en capitalisant sur sa connaissance et ses process pour les rendre accessibles à des agents IA. Ce même contenu est aussi consultable par ton assistant via le MCP BUILD.
            </p>
            <p className="mt-4 text-xs text-white/35 leading-relaxed">
              Synthèse pédagogique de principes et de méthodes, pas une documentation d'exploitation d'un produit particulier. Aucune autonomie, aucun connecteur ni résultat commercial n'est certifié par sa seule lecture.
            </p>
          </div>
          <img
            src="/assets/hermes/hermes-ascii-portrait.png"
            alt=""
            aria-hidden="true"
            className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 opacity-90 mx-auto sm:mx-0"
          />
        </header>

        {files.length === 0 ? (
          <p className="text-white/50">Aucun chapitre disponible pour le moment. Réessaie plus tard.</p>
        ) : (
          <div className="doctrine-reader flex flex-col gap-10">
            {groups.map((group) => (
              <section key={group.key} id={`groupe-${group.key}`}>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#e8d5b0]/75 font-semibold mb-1.5">
                  {GROUP_LABELS[group.key].title}
                </p>
                <p className="text-xs text-white/40 leading-relaxed mb-4 max-w-xl">
                  {GROUP_LABELS[group.key].intro}
                </p>
                <div className="flex flex-col gap-2.5">
                  {group.files.map((file, index) => (
                    <HermesChapter
                      key={file.path}
                      file={file}
                      files={files}
                      title={chapterTitle(file)}
                      summary={CHAPTER_META[file.path]?.summary}
                      diagram={CHAPTER_META[file.path]?.diagram}
                      defaultOpen={group.key === "socle" && index === 0}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {groups.length > 0 && (
        <ScrollProgress
          sections={groups.map((g) => ({ id: `groupe-${g.key}`, label: GROUP_LABELS[g.key].title.split(" - ")[0] }))}
        />
      )}
    </main>
  );
}
