import type { Metadata } from "next";
import Image from "next/image";
import { DaRoot } from "@/components/da/DaRoot";
import { NouveautesView } from "@/components/da/NouveautesView";
import { NavBar } from "@/components/NavBar";
import { NouveautesSeen } from "@/components/nouveautes/NouveautesSeen";
import { navIdentity } from "@/lib/auth/navIdentity.server";
import { loadNouveautesFeed } from "@/lib/nouveautes/loadVideos";

export const metadata: Metadata = { title: "Nouveautés | BUILD", description: "Les dernières vidéos de la chaîne YouTube BUILD." };

export default async function NouveautesPage() {
  const [feed, identity] = await Promise.all([loadNouveautesFeed(), navIdentity()]);
  return <DaRoot className="da-app has-tabbar"><NavBar {...(identity ?? {})} /><main><NouveautesView feed={feed} /><footer className="foot"><Image src="/da/logo-sombre.svg" alt="BUILD" width={96} height={24} /></footer></main><NouveautesSeen /></DaRoot>;
}
