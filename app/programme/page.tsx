import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DaRoot } from "@/components/da/DaRoot";
import { NavBar } from "@/components/NavBar";
import { ProgrammeRows } from "@/components/dashboard/ProgrammeRows";
import { requirePageAccess } from "@/lib/auth/paidPageAccess.server";
import { programmeForTier } from "@/lib/programme";
import { CHAPTER_META } from "@/app/videos/tutos/chapters";
import { loadProgrammeProgress } from "@/lib/programme.server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Programme | BUILD", description: "Tout le programme BUILD, dans l'ordre." };

export default async function ProgrammePage() {
  const identity = await requirePageAccess("authenticated", "/programme");
  const sections = programmeForTier(identity.tier);
  const completedBlocs = await loadProgrammeProgress(identity.user.id);
  const blocCount = sections[1].cards.length;
  const hermesLocked = identity.tier !== "full";
  return <DaRoot className="da-app has-tabbar">
    <NavBar {...identity} />
    <main>
      <header className="hero--app"><div className="hero__in"><h1 className="t-1">Le programme</h1><p className="t-lede">Par où commencer, les sept blocs dans l'ordre, puis Hermes Agent.</p><div className="bb__prog"><div className="seven" role="img" aria-label={`${completedBlocs} blocs sur ${blocCount} terminés`}>{Array.from({ length: blocCount }, (_, index) => <i className={index < completedBlocs ? "d" : undefined} key={index} />)}</div><span className="t-meta">{completedBlocs} blocs sur {blocCount} terminés</span></div></div></header>
      <ProgrammeRows sections={sections} />
      <section className="row" id="hermes"><div className="row__h"><div className="row__ht"><h2 className="t-h2">Hermes Agent</h2><p className="row__d">Mets l'IA au travail dans ton activité.</p></div></div><div className="feat"><Link className="feat__img" href={hermesLocked ? "/checkout" : "/videos/tutos"}><Image src="/da/mini/hermes.jpg" alt="" width={1200} height={675} /></Link><div className="feat__b"><h3 className="feat__t">De zéro à ton premier workflow</h3><p className="feat__d">Une vidéo, {Object.keys(CHAPTER_META).length} chapitres. Tu l'installes, puis tu lui confies ton premier travail.</p><div className="feat__act"><Link className="btn btn--g" href={hermesLocked ? "/checkout" : "/videos/tutos"}>{hermesLocked ? "Voir l'accès" : "Regarder la vidéo"}</Link><Link className="btn btn--l" href={hermesLocked ? "/checkout" : "/videos/tutos"}>Voir les chapitres</Link></div></div></div></section>
      <footer className="foot"><Image src="/da/logo-sombre.svg" alt="BUILD" width={96} height={24} /></footer>
    </main>
  </DaRoot>;
}
