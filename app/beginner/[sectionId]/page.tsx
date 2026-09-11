"use client";

import { useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { SectionPager } from "@/components/ui/section-pager";
import { useBeginnerAuth } from "../useBeginnerAuth";
import { SECTIONS, ANGLE_MORT, findSectionIndex } from "../sections.data";
import { Section5 } from "../sections/Section5";

export default function BeginnerSectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>();
  const { tier, upgradeUrl, displayEmail } = useBeginnerAuth();

  const index = findSectionIndex(sectionId);
  const isAngleMort = sectionId === ANGLE_MORT.id;
  const section = index >= 0 ? SECTIONS[index] : undefined;

  const prev = useMemo(() => {
    if (!section) return undefined;
    const prevSection = SECTIONS[index - 1];
    if (prevSection) return { href: `/beginner/${prevSection.id}`, label: prevSection.label };
    return undefined;
  }, [section, index]);

  const next = useMemo(() => {
    if (section) {
      const nextSection = SECTIONS[index + 1];
      if (nextSection) return { href: `/beginner/${nextSection.id}`, label: nextSection.label };
      return { href: `/beginner/${ANGLE_MORT.id}`, label: ANGLE_MORT.label };
    }
    return null;
  }, [section, index]);

  if (!section && !isAngleMort) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none z-0" />

      <NavBar
        activeLink="beginner"
        tier={tier}
        displayEmail={displayEmail}
        initials={displayEmail ? displayEmail.substring(0, 2).toUpperCase() : "?"}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pb-32 relative z-10">
        <Link
          href="/beginner"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors mt-6 mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux fondations
        </Link>

        {isAngleMort ? (
          <Section5 key={sectionId} upgradeUrl={upgradeUrl} isFullUser={tier === "full"} />
        ) : section ? (
          <section.Component key={sectionId} />
        ) : null}

        {!isAngleMort && (
          <div className="mt-16">
            <SectionPager prev={prev} next={next ?? undefined} nextDisabledLabel="Dernière section" />
          </div>
        )}
      </div>

      <ScrollToTop />
    </main>
  );
}
