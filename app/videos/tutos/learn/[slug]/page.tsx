import "server-only";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { hermesGate } from "../../gate.server";
import { HermesLearningBlock, isLearningSlug } from "../content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Hermes Agent | BUILD", robots: { index: false, follow: false } };

export default async function HermesLearningBlockPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isLearningSlug(slug)) notFound();

  const [identity, gate] = await Promise.all([navIdentity(), hermesGate()]);
  if (gate.files === null) return gate.render;

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-[#f0ede8] font-sans selection:bg-[#e8d5b0]/30 selection:text-[#e8d5b0] relative overflow-x-clip">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 bg-[#e8d5b0] opacity-[0.035] blur-[120px] w-[600px] h-[300px] rounded-full pointer-events-none" />
      <NavBar
        activeLink="videos-tutos"
        tier={identity?.tier ?? null}
        isAdmin={identity?.isAdmin}
        displayName={identity?.displayName}
        displayEmail={identity?.displayEmail}
        initials={identity?.initials}
      />
      <HermesLearningBlock slug={slug} />
    </main>
  );
}
