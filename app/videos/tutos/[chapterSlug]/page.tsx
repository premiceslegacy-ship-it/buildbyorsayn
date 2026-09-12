import "server-only";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { chapterTitle, withoutLeadingTitle, DoctrineMarkdown } from "../../../doctrine/markdown";
import { CHAPTER_META, chapterSlug, chapterPathFromSlug } from "../chapters";
import { CHAPTER_DIAGRAMS } from "../chapterDiagrams";
import { hermesGate } from "../gate.server";
import { NavBar } from "@/components/NavBar";
import { SectionPager } from "@/components/ui/section-pager";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import "../../../doctrine/doctrine.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HermesChapterPage({
  params,
}: {
  params: Promise<{ chapterSlug: string }>;
}) {
  const { chapterSlug: slug } = await params;
  const gate = await hermesGate();
  if (gate.files === null) return gate.render;
  const { files } = gate;

  const path = chapterPathFromSlug(slug);
  const file = path ? files.find((f) => f.path === path) : undefined;
  if (!file) notFound();

  const meta = CHAPTER_META[file.path];
  const displayTitle = meta?.displayTitle ?? chapterTitle(file);
  const currentIndex = files.findIndex((f) => f.path === file.path);
  const prevFile = currentIndex > 0 ? files[currentIndex - 1] : undefined;
  const nextFile = files[currentIndex + 1];

  const identity = await navIdentity();

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0] relative overflow-x-clip">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />

      <NavBar
        activeLink="videos-tutos"
        tier={identity?.tier ?? null}
        displayName={identity?.displayName}
        displayEmail={identity?.displayEmail}
        initials={identity?.initials}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 relative z-10">
        <Link
          href="/videos/tutos"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux chapitres
        </Link>

        <article className="doctrine-reader">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{displayTitle}</h1>
          {meta?.summary && <p className="text-white/45 text-sm mb-8 leading-relaxed">{meta.summary}</p>}

          <div className="doctrine-markdown">
            <DoctrineMarkdown file={withoutLeadingTitle(file)} files={files} />
          </div>
          {CHAPTER_DIAGRAMS[file.path]}
        </article>

        <div className="mt-16">
          <SectionPager
            prev={prevFile ? { href: `/videos/tutos/${chapterSlug(prevFile.path)}`, label: CHAPTER_META[prevFile.path]?.displayTitle ?? chapterTitle(prevFile) } : undefined}
            next={nextFile ? { href: `/videos/tutos/${chapterSlug(nextFile.path)}`, label: CHAPTER_META[nextFile.path]?.displayTitle ?? chapterTitle(nextFile) } : undefined}
            nextDisabledLabel="Dernier chapitre"
          />
        </div>
      </div>
    </main>
  );
}
