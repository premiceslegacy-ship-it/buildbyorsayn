import { redirect } from "next/navigation";
import { DaRoot } from "@/components/da/DaRoot";
import { WelcomeJourney } from "@/components/ui5/WelcomeJourney";
import { welcomeChoices, welcomeDisplayName } from "@/components/ui5/welcomeModel";
import { normalizeProfileTier } from "@/lib/mcpAccess";
import { programmeForTier } from "@/lib/programme";
import { createClient } from "@/lib/supabase/server";
import "./bienvenue.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bienvenue dans BUILD" };

export default async function BienvenuePage() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) redirect("/login?next=%2Fbienvenue");

  const { data: profile, error: profileError } = await supabase.from("profiles").select("tier").eq("id", user.id).maybeSingle();
  if (profileError) return <DaRoot className="da-app welcome-page"><main className="page-state"><div className="page-state__in"><h1 className="t-1">Ton accès ne peut pas être vérifié.</h1><p>Réessaie dans un instant. Aucun contenu réservé n&apos;est affiché tant que ton accès reste indéterminé.</p><a className="btn btn--p" href="/bienvenue">Réessayer</a></div></main></DaRoot>;

  const tier = normalizeProfileTier(profile?.tier ?? null) ?? "free";
  const cards = programmeForTier(tier).flatMap((section) => section.cards);
  const displayName = welcomeDisplayName(user.user_metadata);
  return <DaRoot className="da-app welcome-page"><WelcomeJourney displayName={displayName} tier={tier} choices={welcomeChoices(tier, cards)} /></DaRoot>;
}
