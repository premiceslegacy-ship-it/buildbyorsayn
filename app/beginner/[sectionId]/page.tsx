import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import { FoundationReader } from "@/components/reader/FoundationReader";
import { parseReaderMode } from "@/components/reader/readerModel";
import { Section5 } from "../sections/Section5";
import { ANGLE_MORT, findSectionIndex, SECTIONS } from "../sections.data";
import { SectionContent } from "../sections.components";
import { UPGRADE_PATH } from "@/lib/pricing";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ sectionId: string }>;
  searchParams: Promise<{ mode?: string }>;
};

export default async function BeginnerSectionPage({ params, searchParams }: Props) {
  const [{ sectionId }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect(`/login?next=${encodeURIComponent(`/beginner/${sectionId}`)}`);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .maybeSingle();
  const tier = profileError ? null : normalizeProfileTier(profile?.tier);

  if (tier !== "beginner" && tier !== "full") redirect("/checkout");

  const index = findSectionIndex(sectionId);
  const isAngleMort = sectionId === ANGLE_MORT.id;
  const section = index >= 0 ? SECTIONS[index] : undefined;
  if (!section && !isAngleMort) notFound();

  const current = section ?? ANGLE_MORT;
  const previousSection = section ? SECTIONS[index - 1] : SECTIONS.at(-1);
  const nextSection = section ? SECTIONS[index + 1] : undefined;
  const previous = previousSection ? { href: `/beginner/${previousSection.id}`, label: previousSection.label } : undefined;
  const next = section
    ? nextSection
      ? { href: `/beginner/${nextSection.id}`, label: nextSection.label }
      : { href: `/beginner/${ANGLE_MORT.id}`, label: ANGLE_MORT.label }
    : null;
  const email = user.email ?? "";
  const displayName =
    (user.user_metadata?.first_name as string | undefined) ||
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    email.split("@")[0];
  const chapters = [...SECTIONS, ANGLE_MORT].map((chapter) => ({
    ...chapter,
    href: `/beginner/${chapter.id}`,
  }));

  return <DaRoot className="da-app has-tabbar">
    <NavBar
      activeLink="beginner"
      tier={tier}
      isAdmin={user.app_metadata?.role === "admin"}
      displayName={displayName}
      displayEmail={email}
      initials={displayName.substring(0, 2).toUpperCase()}
    />
    <FoundationReader
      title={current.label}
      summary={current.summary}
      chapterNumber={current.num}
      currentId={current.id}
      chapters={chapters}
      previous={previous}
      next={next}
      initialMode={parseReaderMode(query.mode)}
    >
      {isAngleMort
        ? <Section5 upgradeUrl={UPGRADE_PATH} isFullUser={tier === "full"} />
        : section ? <SectionContent id={section.id} /> : null}
    </FoundationReader>
  </DaRoot>;
}
