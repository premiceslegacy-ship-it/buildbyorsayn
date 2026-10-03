import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { NavBar } from "@/components/NavBar";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { SectionPager } from "@/components/ui/section-pager";
import { Section5 } from "../sections/Section5";
import { ANGLE_MORT, findSectionIndex, SECTIONS } from "../sections.data";
import { SectionContent } from "../sections.components";
import { withClientReferenceId } from "@/lib/pricing";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ sectionId: string }>;
};

export default async function BeginnerSectionPage({ params }: Props) {
  const { sectionId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/beginner/${sectionId}`)}`);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .maybeSingle();
  const tier = profileError ? null : normalizeProfileTier(profile?.tier);

  if (tier !== "beginner" && tier !== "full") {
    redirect("/checkout");
  }

  const index = findSectionIndex(sectionId);
  const isAngleMort = sectionId === ANGLE_MORT.id;
  const section = index >= 0 ? SECTIONS[index] : undefined;

  if (!section && !isAngleMort) {
    notFound();
  }

  const prev = section
    ? (() => {
        const previousSection = SECTIONS[index - 1];
        return previousSection
          ? { href: `/beginner/${previousSection.id}`, label: previousSection.label }
          : undefined;
      })()
    : undefined;

  const next = section
    ? (() => {
        const nextSection = SECTIONS[index + 1];
        return nextSection
          ? { href: `/beginner/${nextSection.id}`, label: nextSection.label }
          : { href: `/beginner/${ANGLE_MORT.id}`, label: ANGLE_MORT.label };
      })()
    : null;

  const displayEmail = user.email ?? "";
  const upgradeUrl = withClientReferenceId(
    process.env.STRIPE_UPGRADE_CHECKOUT_LINK ?? null,
    user.id
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1c1c1f] via-[#0e0e0f] to-[#0e0e0f] text-[#f0ede8] font-sans">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-5 blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none z-0" />

      <NavBar
        activeLink="beginner"
        tier={tier}
        isAdmin={user.app_metadata?.role === "admin"}
        displayEmail={displayEmail}
        initials={displayEmail ? displayEmail.substring(0, 2).toUpperCase() : "?"}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pb-32 relative z-10">
        <Link
          href="/beginner"
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/90 transition-colors mt-6 mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Retour aux fondations
        </Link>

        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e8d5b0]/65">
                Fondations · bloc {section?.num ?? ANGLE_MORT.num}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-[#f0ede8] sm:text-4xl">
                {section?.label ?? ANGLE_MORT.label}
              </h1>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-white/50">
                {section?.summary ?? ANGLE_MORT.summary}
              </p>
            </div>
            <span className="shrink-0 text-xs font-medium uppercase tracking-[0.14em] text-white/30">
              Bloc de travail
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-3xl">
          {isAngleMort ? (
            <Section5 upgradeUrl={upgradeUrl} isFullUser={tier === "full"} />
          ) : section ? (
            <SectionContent id={section.id} />
          ) : null}
        </div>

        {!isAngleMort && (
          <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 sm:pt-10">
            <SectionPager prev={prev} next={next ?? undefined} nextDisabledLabel="Dernière section" />
          </div>
        )}
      </div>

      <ScrollToTop />
    </main>
  );
}
