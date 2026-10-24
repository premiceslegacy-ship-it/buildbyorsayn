import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBlocVideos } from "@/lib/blocData.server";
import { NavBar } from "@/components/NavBar";
import { DaRoot } from "@/components/da/DaRoot";
import { ReaderView } from "@/components/reader/ReaderView";
import { parseReaderMode } from "@/components/reader/readerModel";
import { VideoCard } from "@/components/VideoCard";
import { ProtocolVideo } from "@/components/protocole/ProtocolVideo";
import { protocoleIntroductionMarkdown, protocoleMarkdown } from "@/lib/protocoleContent";
import { normalizeProfileTier } from "@/lib/mcpAccess";

export const metadata = {
  title: "Le protocole zéro | BUILD",
  description: "Tu apprends une tâche précise. Tu la confrontes au terrain. Puis tu gardes ce que le terrain t'a vraiment appris.",
};

export default async function ProtocolePage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const query = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();
  const userTier = normalizeProfileTier(profile?.tier ?? null);

  if (userTier !== "beginner" && userTier !== "full") redirect("/checkout");
  const protocolVideoResult = await getBlocVideos("protocole", userTier);
  const protocolVideos = protocolVideoResult.state === "ready" ? protocolVideoResult.videos : [];

  const email = user.email ?? "";
  const displayName =
    (user.user_metadata?.first_name as string) ||
    (user.user_metadata?.full_name as string)?.split(" ")[0] ||
    email.split("@")[0];
  const introduction = protocoleIntroductionMarkdown();
  const markdown = protocoleMarkdown();
  const markdownForCopy = markdown.replace(/^---\n[\s\S]*?\n---\s*/, "");

  return <DaRoot className="da-app has-tabbar">
    <NavBar
      activeLink="protocole"
      tier={userTier}
      isAdmin={user.app_metadata?.role === "admin"}
      displayName={displayName}
      displayEmail={email}
      initials={displayName.substring(0, 2).toUpperCase()}
    />
    <ReaderView
      title="Le protocole zéro"
      toolbarTitle="Le protocole zéro"
      backLabel="Protocole"
      backHref="/programme"
      initialMode={parseReaderMode(query.mode)}
      sections={[{
        id: "protocole-zero",
        number: "01",
        title: "Absorber, produire, distiller",
        summary: "Tu vas apprendre une tâche assez précise pour être testée. Tu vas la mettre devant une vraie personne.",
        markdown,
        video: protocolVideoResult.state === "ready"
          ? <ProtocolVideo videos={protocolVideos} />
          : protocolVideoResult.state === "unavailable"
            ? <p role="status">La vidéo est momentanément indisponible.</p>
            : <VideoCard title="Le protocole zéro" youtubeId="tcFGu_zNsPE" description="La méthode complète, de l’absorption à la distillation." />,
      }]}
      copyMarkdown={`${introduction}\n\n${markdownForCopy}`}
      videoIntroductionMarkdown={introduction}
      thumbnailSrc="/da/mini/protocole.jpg"
    />
  </DaRoot>;
}
