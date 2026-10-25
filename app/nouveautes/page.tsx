import type { Metadata } from "next";
import Image from "next/image";
import { DaRoot } from "@/components/da/DaRoot";
import { NouveautesView } from "@/components/da/NouveautesView";
import { NavBar } from "@/components/NavBar";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";
import { loadMemberNouveautesFeed } from "@/lib/nouveautes/loadMemberFeed.server";

export const metadata: Metadata = { title: "Nouveautés | BUILD", description: "Les dernières vidéos publiées sur YouTube et dans BUILD." };

export default async function NouveautesPage() {
  const identity = await requirePageAccess("authenticated", "/nouveautes");
  const feed = await loadMemberNouveautesFeed();
  return <DaRoot className="da-app has-tabbar"><NavBar {...identity} /><main><NouveautesView feed={feed} /><footer className="foot"><Image src="/da/logo-sombre.svg" alt="BUILD" width={96} height={24} /></footer></main></DaRoot>;
}
